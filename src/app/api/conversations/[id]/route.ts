import { NextRequest, NextResponse } from 'next/server'
import { updateConversationStatus } from '@/lib/supabase/queries'
import type { ConversationStatus } from '@/types'

const VALID_STATUSES: ConversationStatus[] = [
  'incoming',
  'awaiting_response',
  'in_negotiation',
  'confirmed',
  'declined',
]

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: { status?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { status } = body
  if (!status || !VALID_STATUSES.includes(status as ConversationStatus)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  try {
    await updateConversationStatus(id, status as ConversationStatus)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PATCH conversations error:', err)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
