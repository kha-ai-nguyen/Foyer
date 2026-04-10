import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/client'
import { insertMessage } from '@/lib/supabase/queries'

// GET: list proposals for a conversation or venue
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get('conversation_id')
  const eventId = searchParams.get('event_id')

  const supabase = createServiceClient()

  let query = supabase.from('proposals').select('*').order('created_at', { ascending: false })

  if (conversationId) query = query.eq('conversation_id', conversationId)
  else if (eventId) query = query.eq('event_id', eventId)
  else return NextResponse.json({ error: 'conversation_id or event_id required' }, { status: 400 })

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ proposals: data })
}

// POST: create a new proposal and notify booker via message
export async function POST(req: NextRequest) {
  let body: {
    conversation_id?: string
    venue_id?: string
    event_id?: string
    price_per_head?: number
    total_estimate?: number
    notes?: string | null
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { conversation_id, venue_id, event_id, price_per_head, total_estimate, notes } = body

  if (!conversation_id || !venue_id || !event_id || !price_per_head) {
    return NextResponse.json(
      { error: 'conversation_id, venue_id, event_id, price_per_head are required' },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()

  // Get venue + space info for the notification message
  const { data: conv } = await supabase
    .from('conversations')
    .select('space:spaces(name, payment_deposit_pct, payment_min_spend), venue:venues(name)')
    .eq('id', conversation_id)
    .single()

  const spaceName = (conv?.space as { name?: string } | null)?.name ?? 'the space'
  const venueName = (conv?.venue as { name?: string } | null)?.name ?? 'the venue'
  const depositPct = (conv?.space as { payment_deposit_pct?: number | null } | null)?.payment_deposit_pct
  const minSpend = (conv?.space as { payment_min_spend?: number | null } | null)?.payment_min_spend

  // Create the proposal record
  const { data: proposal, error } = await supabase
    .from('proposals')
    .insert({
      conversation_id,
      venue_id,
      event_id,
      price_per_head,
      total_estimate: total_estimate ?? null,
      notes: notes ?? null,
      status: 'sent',
      sent_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    console.error('proposals insert error:', error)
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
  }

  // Update conversation status to in_negotiation
  await supabase
    .from('conversations')
    .update({ status: 'in_negotiation' })
    .eq('id', conversation_id)

  // Send a message from the venue summarising the proposal
  const totalDisplay = total_estimate
    ? `£${total_estimate.toLocaleString()} total`
    : `£${(price_per_head * 0).toLocaleString()} total`

  const paymentLines: string[] = []
  if (depositPct) paymentLines.push(`${depositPct}% deposit to confirm`)
  if (minSpend) paymentLines.push(`£${minSpend.toLocaleString()} minimum spend`)

  const proposalMessage = `Hi,

${venueName} has sent you a formal proposal for ${spaceName}.

• Price per head: £${price_per_head}${total_estimate ? `\n• Estimated total: £${total_estimate.toLocaleString()}` : ''}${paymentLines.length > 0 ? `\n• ${paymentLines.join('\n• ')}` : ''}${notes ? `\n\nNote from venue: ${notes}` : ''}

You can view and accept the full proposal in your event summary.`

  try {
    await insertMessage(conversation_id, 'venue', proposalMessage)
  } catch (err) {
    console.error('Failed to insert proposal message:', err)
  }

  return NextResponse.json({ proposal_id: proposal.id })
}
