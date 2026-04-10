import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/client'
import { getOrCreateConversation, insertMessage } from '@/lib/supabase/queries'

const anthropic = new Anthropic()

async function generateFelicityResponse(params: {
  bookerName: string
  venueName: string
  spaceName: string
  neighbourhood: string
  capacity: number
  basePricePerHead: number
  headcount: number
  eventType: string
  eventDate: string
  depositPct: number | null
  minSpend: number | null
  payAhead: boolean
}): Promise<string> {
  const {
    bookerName,
    venueName,
    spaceName,
    neighbourhood,
    capacity,
    basePricePerHead,
    headcount,
    eventType,
    eventDate,
    depositPct,
    minSpend,
    payAhead,
  } = params

  const totalEstimate = basePricePerHead * headcount
  const paymentLines: string[] = []
  if (depositPct) paymentLines.push(`${depositPct}% deposit to confirm`)
  if (minSpend) paymentLines.push(`£${minSpend.toLocaleString()} minimum spend`)
  if (payAhead) paymentLines.push('full payment required in advance')

  const systemPrompt = `You are Felicity, the AI events coordinator for Fete — a premium venue marketplace. You're warm, professional, and helpful. You reply to new event enquiries on behalf of venues.

Your job is to:
1. Greet the booker by first name
2. Confirm the space is available (assume it is unless the data clearly says otherwise)
3. Present the pricing clearly (per head + estimated total)
4. Flag any important caveats (e.g. capacity is slightly under the headcount requested)
5. Offer next steps (ask if they want a formal proposal)

Keep replies concise — 4–6 short paragraphs max. Use line breaks generously. Never use markdown headers or bullet points formatted with "-" — use "•" for lists. Sign off as "Felicity, Fete".`

  const userPrompt = `New enquiry received:

Booker: ${bookerName}
Event type: ${eventType}
Date: ${eventDate}
Headcount: ${headcount} guests

Space: ${spaceName} at ${venueName}
Location: ${neighbourhood}
Space capacity: up to ${capacity} guests
Price: £${basePricePerHead}/head (estimated total £${totalEstimate.toLocaleString()} for ${headcount} guests)
Payment terms: ${paymentLines.length > 0 ? paymentLines.join(', ') : 'to be confirmed with venue'}

Write Felicity's first response to ${bookerName}.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    })

    const content = message.content[0]
    if (content.type === 'text') return content.text
  } catch (err) {
    console.error('Claude API error, falling back to template:', err)
  }

  // Fallback template if Claude API fails
  return `Hi ${bookerName}!

Great news — ${spaceName} at ${venueName} is available on ${eventDate} and fits your party of ${headcount}${capacity < headcount ? ' (just slightly over the usual capacity — worth confirming with the venue)' : ' perfectly'}.

• Price: £${basePricePerHead}/head · estimated total £${totalEstimate.toLocaleString()}
${paymentLines.length > 0 ? `• ${paymentLines.join('\n• ')}` : ''}

I've flagged your enquiry to the ${venueName} team and they'll be in touch shortly. In the meantime, feel free to ask me anything below.

Felicity, Fete`
}

export async function POST(req: NextRequest) {
  let body: {
    venueId?: string | null
    venueName?: string
    venueEmail?: string
    spaceId?: string | null
    spaceName?: string
    spaceCapacity?: number
    spacePrice?: number
    spaceDepositPct?: number | null
    spaceMinSpend?: number | null
    spacePayAhead?: boolean
    neighbourhood?: string
    eventDate?: string
    headcount?: number
    pricePerHead?: number | null
    eventType?: string
    notes?: string | null
    bookerName?: string
    eventId?: string | null
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    venueId, venueName, venueEmail, spaceId, spaceName, spaceCapacity,
    spacePrice, spaceDepositPct, spaceMinSpend, spacePayAhead,
    neighbourhood, eventDate, headcount, pricePerHead, eventType, notes,
    bookerName, eventId: existingEventId,
  } = body

  if (!venueName || !eventDate || !headcount || !eventType) {
    return NextResponse.json(
      { error: 'venueName, eventDate, headcount and eventType are required' },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()

  // Use existing event or create a new one
  let eventId = existingEventId ?? null
  if (!eventId) {
    const { data: eventData, error: dbError } = await supabase
      .from('events')
      .insert({
        venue_id: venueId ?? null,
        venue_name: venueName,
        venue_email: venueEmail ?? '',
        event_date: eventDate,
        headcount,
        price_per_head: pricePerHead ?? null,
        event_type: eventType,
        notes: notes ?? null,
        booker_name: bookerName ?? 'Guest',
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('events insert error:', dbError)
      return NextResponse.json({ error: 'Failed to save event' }, { status: 500 })
    }
    eventId = eventData?.id
  }

  let conversationId: string | null = null

  // Create conversation + Felicity response
  if (venueId && eventId) {
    try {
      conversationId = await getOrCreateConversation(eventId, venueId, spaceId ?? null)

      const felicityMessage = await generateFelicityResponse({
        bookerName: bookerName ?? 'there',
        venueName,
        spaceName: spaceName ?? 'the space',
        neighbourhood: neighbourhood ?? '',
        capacity: spaceCapacity ?? headcount,
        basePricePerHead: spacePrice ?? pricePerHead ?? 80,
        headcount,
        eventType,
        eventDate,
        depositPct: spaceDepositPct ?? null,
        minSpend: spaceMinSpend ?? null,
        payAhead: spacePayAhead ?? false,
      })

      await insertMessage(conversationId, 'felicity', felicityMessage)
    } catch (err) {
      console.error('Failed to create conversation/Felicity message:', err)
    }
  }

  // Send email to venue (skip if env vars missing)
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  if (gmailUser && gmailPass && venueEmail) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
      })

      const budgetLine = pricePerHead ? `Budget: £${pricePerHead}/head\n` : ''
      const notesLine = notes ? `Notes: ${notes}\n` : ''

      await transporter.sendMail({
        from: gmailUser,
        to: venueEmail,
        replyTo: 'noreply@fete.london',
        subject: `New enquiry for ${venueName} — ${eventType} for ${headcount} guests`,
        text: `You have a new private event enquiry via Fete.

Event type: ${eventType}
Date: ${eventDate}
Guests: ${headcount}
${budgetLine}${notesLine}
---
This enquiry was sent via Fete (https://fete.london).
To reply, log in to your venue dashboard.`,
      })
    } catch (emailError) {
      console.error('Failed to send enquiry email:', emailError)
    }
  }

  return NextResponse.json({ success: true, conversation_id: conversationId })
}
