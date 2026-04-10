import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

async function getProposal(proposalId: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('proposals')
    .select(`
      *,
      conversation:conversations(
        id,
        status,
        event:events(id, event_type, headcount, date_from, booker_name, budget_per_head_max),
        venue:venues(id, name, slug, neighbourhood),
        space:spaces(id, name, capacity, base_price, photos, payment_deposit_pct, payment_min_spend)
      )
    `)
    .eq('id', proposalId)
    .single()
  return data
}

async function acceptProposal(proposalId: string, conversationId: string) {
  'use server'
  const supabase = createServiceClient()
  await supabase
    .from('proposals')
    .update({ status: 'accepted', accepted_at: new Date().toISOString() })
    .eq('id', proposalId)
  await supabase
    .from('conversations')
    .update({ status: 'confirmed' })
    .eq('id', conversationId)
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string; proposalId: string }>
}) {
  const { id: eventId, proposalId } = await params
  const proposal = await getProposal(proposalId)
  if (!proposal) notFound()

  const conv = proposal.conversation as {
    id: string
    status: string
    event: { id: string; event_type: string; headcount: number; date_from: string | null; booker_name: string; budget_per_head_max: number | null } | null
    venue: { id: string; name: string; slug: string; neighbourhood: string } | null
    space: { id: string; name: string; capacity: number; base_price: number; photos: string[]; payment_deposit_pct: number | null; payment_min_spend: number | null } | null
  } | null

  const event = conv?.event
  const venue = conv?.venue
  const space = conv?.space
  const isAccepted = proposal.status === 'accepted'
  const conversationId = conv?.id

  const pricePerHead = proposal.price_per_head ?? space?.base_price ?? 0
  const headcount = event?.headcount ?? 0
  const total = proposal.total_estimate ?? pricePerHead * headcount
  const depositPct = space?.payment_deposit_pct ?? null
  const depositAmount = depositPct ? Math.round(total * (depositPct / 100)) : null

  const photos = space?.photos?.length ? space.photos : []

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href={`/events/${eventId}`}
        className="text-xs uppercase tracking-widest font-bold text-text-muted hover:text-dark mb-6 inline-block"
      >
        ← Back to your event
      </Link>

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest font-medium text-text-muted mb-1">
          Proposal from {venue?.name ?? 'the venue'}
        </p>
        <h1 className="font-display font-extrabold text-4xl uppercase text-dark">
          {space?.name ?? 'Space'}
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {venue?.neighbourhood} · {event?.event_type} · {formatDate(event?.date_from ?? null)}
        </p>
      </div>

      {/* Photo strip */}
      {photos.length > 0 && (
        <div
          className="flex gap-1 h-48 overflow-x-auto rounded-2xl overflow-hidden mb-6 border-2 border-dark"
          style={{ scrollbarWidth: 'none' }}
        >
          {photos.slice(0, 3).map((url, i) => (
            <div
              key={i}
              className="shrink-0 w-72 h-full bg-base-deep bg-cover bg-center"
              style={{ backgroundImage: `url(${url})` }}
            />
          ))}
        </div>
      )}

      {/* Proposal details */}
      <div className="bg-white border-2 border-dark rounded-2xl p-6 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Pricing</p>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-text-muted uppercase tracking-wide text-xs font-medium mb-1">Price per head</p>
            <p className="font-display font-bold text-2xl text-dark">£{pricePerHead}</p>
          </div>
          <div>
            <p className="text-text-muted uppercase tracking-wide text-xs font-medium mb-1">Guests</p>
            <p className="font-display font-bold text-2xl text-dark">{headcount}</p>
          </div>
          <div>
            <p className="text-text-muted uppercase tracking-wide text-xs font-medium mb-1">Estimated total</p>
            <p className="font-display font-bold text-2xl text-dark">£{total.toLocaleString()}</p>
          </div>
          {depositAmount && (
            <div>
              <p className="text-text-muted uppercase tracking-wide text-xs font-medium mb-1">Deposit ({depositPct}%)</p>
              <p className="font-display font-bold text-2xl text-dark">£{depositAmount.toLocaleString()}</p>
            </div>
          )}
        </div>

        {space?.payment_min_spend && (
          <div className="border-t border-dark/10 pt-4">
            <p className="text-xs text-text-muted">
              Minimum spend: <strong className="text-dark">£{space.payment_min_spend.toLocaleString()}</strong>
            </p>
          </div>
        )}

        {proposal.notes && (
          <div className="border-t border-dark/10 pt-4 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Notes from venue</p>
            <p className="text-sm text-dark whitespace-pre-wrap">{proposal.notes}</p>
          </div>
        )}
      </div>

      {/* Accept / status */}
      {isAccepted ? (
        <div className="bg-green-50 border-2 border-green-600 rounded-2xl p-6 text-center">
          <p className="font-display font-bold text-2xl uppercase text-green-700 mb-1">Confirmed!</p>
          <p className="text-sm text-green-600">
            You accepted this proposal. The venue has been notified.
          </p>
          <Link
            href={`/conversations/${conversationId}`}
            className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-green-700 underline underline-offset-2"
          >
            View conversation →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <form
            action={async () => {
              'use server'
              if (conversationId) {
                await acceptProposal(proposalId, conversationId)
              }
              redirect(`/events/${eventId}/proposals/${proposalId}`)
            }}
          >
            <button
              type="submit"
              className="w-full bg-primary text-dark font-display font-bold text-lg uppercase py-4 rounded-xl border-2 border-dark hover:bg-dark hover:text-primary transition-colors"
            >
              Accept this proposal →
            </button>
          </form>

          <Link
            href={`/conversations/${conversationId}`}
            className="block w-full bg-white text-dark font-display font-bold text-base uppercase text-center py-3.5 rounded-xl border-2 border-dark hover:bg-base-deep transition-colors"
          >
            Ask a question first
          </Link>

          {/* E-sign placeholder */}
          <button
            disabled
            className="w-full bg-white text-text-muted font-display font-bold text-base uppercase py-3.5 rounded-xl border-2 border-dark/30 cursor-not-allowed opacity-50"
            title="Coming soon"
          >
            Sign contract — coming soon
          </button>
        </div>
      )}
    </main>
  )
}
