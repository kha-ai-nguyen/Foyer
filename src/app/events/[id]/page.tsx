import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBookerEvent, getConversationsByEventId } from '@/lib/supabase/queries'
import { createServiceClient } from '@/lib/supabase/client'
import BookerNav from '@/components/BookerNav'

async function getProposalsByEventId(eventId: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('proposals')
    .select('id, conversation_id, status, price_per_head, total_estimate')
    .eq('event_id', eventId)
    .in('status', ['sent', 'accepted'])
  return (data ?? []) as Array<{
    id: string
    conversation_id: string
    status: string
    price_per_head: number
    total_estimate: number | null
  }>
}

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  incoming: { label: 'Felicity replied', className: 'bg-primary text-dark' },
  awaiting_response: { label: 'Awaiting venue', className: 'bg-base-deep text-dark' },
  in_negotiation: { label: 'In discussion', className: 'bg-blue-100 text-blue-800' },
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
  declined: { label: 'Declined', className: 'bg-red-100 text-red-700' },
}

function formatDate(d: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [event, conversations, proposals] = await Promise.all([
    getBookerEvent(id),
    getConversationsByEventId(id),
    getProposalsByEventId(id),
  ])

  // Build proposal lookup by conversation_id
  const proposalByConvId = Object.fromEntries(
    proposals.map((p) => [p.conversation_id, p])
  )
  if (!event) notFound()

  const dateLabel =
    event.date_from && event.date_to
      ? `${formatDate(event.date_from)} – ${formatDate(event.date_to)}`
      : event.date_from
      ? formatDate(event.date_from)
      : 'Flexible'

  const hasConversations = conversations.length > 0

  return (
    <>
      <BookerNav />
      <main className="md:ml-[250px] px-6 py-10">
        <div className="max-w-xl mx-auto">
          <p className="text-xs uppercase tracking-widest font-medium text-text-muted mb-2">
            Your event
          </p>
          <h1 className="font-display font-extrabold text-4xl uppercase text-dark mb-8">
            {event.event_type}
          </h1>

          {/* Event summary card */}
          <div className="bg-white border-2 border-dark rounded-2xl p-6 mb-8 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-muted uppercase tracking-wide text-xs font-medium mb-1">Guests</p>
                <p className="font-semibold text-dark text-lg">{event.headcount}</p>
              </div>
              {event.budget_per_head_max && (
                <div>
                  <p className="text-text-muted uppercase tracking-wide text-xs font-medium mb-1">Budget</p>
                  <p className="font-semibold text-dark text-lg">£{event.budget_per_head_max}/head</p>
                </div>
              )}
              <div>
                <p className="text-text-muted uppercase tracking-wide text-xs font-medium mb-1">Date</p>
                <p className="font-semibold text-dark">{dateLabel}</p>
              </div>
              {event.postcode && (
                <div>
                  <p className="text-text-muted uppercase tracking-wide text-xs font-medium mb-1">Location</p>
                  <p className="font-semibold text-dark font-mono">
                    {event.postcode} · {event.radius_km}km
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Outreach section */}
          {hasConversations && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest font-bold text-text-muted">
                  Your outreach · {conversations.length} venue{conversations.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="space-y-3">
                {conversations.map((conv) => {
                  const venue = conv.venue as { name: string; neighbourhood: string } | null
                  const space = conv.space as { name: string; base_price: number } | null
                  const status = (conv as { status?: string }).status ?? 'incoming'
                  const statusMeta = STATUS_LABELS[status] ?? STATUS_LABELS.incoming
                  const lastActivity = relativeTime((conv as { last_message_at?: string }).last_message_at ?? conv.created_at)
                  const proposal = proposalByConvId[conv.id]

                  return (
                    <div
                      key={conv.id}
                      className="bg-white border-2 border-dark rounded-2xl p-4 hover:shadow-[4px_4px_0_#1A1A1A] transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-base uppercase text-dark truncate">
                            {venue?.name ?? 'Venue'}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {space?.name ?? ''}{venue?.neighbourhood ? ` · ${venue.neighbourhood}` : ''}
                            {space?.base_price ? ` · £${space.base_price}/head` : ''}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${statusMeta.className}`}>
                            {statusMeta.label}
                          </span>
                          <span className="text-[10px] text-text-muted">{lastActivity}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3 flex-wrap">
                        <Link
                          href={`/conversations/${conv.id}`}
                          className="text-[11px] font-semibold uppercase tracking-widest text-text-muted hover:text-secondary transition-colors"
                        >
                          View thread →
                        </Link>
                        {proposal && (
                          <Link
                            href={`/events/${id}/proposals/${proposal.id}`}
                            className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border-2 transition-colors ${
                              proposal.status === 'accepted'
                                ? 'border-green-600 text-green-700 bg-green-50'
                                : 'border-primary bg-primary text-dark hover:bg-dark hover:text-primary'
                            }`}
                          >
                            {proposal.status === 'accepted' ? 'Confirmed ✓' : `View proposal · £${proposal.price_per_head}/head →`}
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-3">
            <Link
              href={`/events/${id}/results`}
              className="block w-full bg-primary text-dark font-display font-bold text-lg uppercase text-center py-4 rounded-xl border-2 border-dark hover:bg-dark hover:text-primary transition-colors"
            >
              {hasConversations ? 'Find more spaces →' : 'View matching spaces →'}
            </Link>
            <Link
              href={`/explore?event=${id}`}
              className="block w-full bg-white text-dark font-display font-bold text-lg uppercase text-center py-4 rounded-xl border-2 border-dark hover:bg-base-deep transition-colors"
            >
              Browse all spaces
            </Link>
            <Link
              href="/create-event"
              className="block w-full text-center text-sm text-text-muted underline underline-offset-2 py-2"
            >
              Start a different event
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
