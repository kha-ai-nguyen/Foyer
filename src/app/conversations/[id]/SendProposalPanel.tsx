'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  conversationId: string
  venueId: string
  eventId: string
  spaceBasePrice: number
  headcount: number
  existingProposalId?: string | null
  eventPath: string
}

export default function SendProposalPanel({
  conversationId,
  venueId,
  eventId,
  spaceBasePrice,
  headcount,
  existingProposalId,
  eventPath,
}: Props) {
  const router = useRouter()
  const [pricePerHead, setPricePerHead] = useState(spaceBasePrice)
  const [notes, setNotes] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(!!existingProposalId)
  const [proposalId, setProposalId] = useState<string | null>(existingProposalId ?? null)

  const totalEstimate = Math.round(pricePerHead * headcount)

  async function sendProposal() {
    setSending(true)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          venue_id: venueId,
          event_id: eventId,
          price_per_head: pricePerHead,
          total_estimate: totalEstimate,
          notes: notes.trim() || null,
        }),
      })
      const data = await res.json()
      if (data.proposal_id) {
        setProposalId(data.proposal_id)
        setSent(true)
        router.refresh()
      }
    } finally {
      setSending(false)
    }
  }

  if (sent && proposalId) {
    return (
      <div className="bg-green-50 border-2 border-green-600 rounded-2xl p-5">
        <p className="font-display font-bold text-lg uppercase text-green-700 mb-1">Proposal sent!</p>
        <p className="text-sm text-green-600 mb-3">
          £{pricePerHead}/head · £{totalEstimate.toLocaleString()} total
        </p>
        <a
          href={`/events/${eventId}/proposals/${proposalId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold uppercase tracking-widest text-green-700 underline underline-offset-2"
        >
          Preview booker view →
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-dark rounded-2xl p-5">
      <h3 className="font-display font-bold text-lg uppercase text-dark mb-4">
        Send Proposal
      </h3>

      <div className="space-y-4 mb-5">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-1.5">
            Price per head (£)
          </label>
          <input
            type="number"
            value={pricePerHead}
            onChange={(e) => setPricePerHead(Number(e.target.value))}
            className="w-full border-2 border-dark rounded-xl px-4 py-3 text-lg font-bold text-dark focus:outline-none focus:border-primary bg-base/30"
          />
        </div>

        <div className="bg-base rounded-xl px-4 py-3 text-sm font-semibold text-dark">
          Estimated total: <span className="font-display font-bold text-xl">£{totalEstimate.toLocaleString()}</span>
          <span className="text-text-muted font-normal text-xs ml-2">for {headcount} guests</span>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-1.5">
            Notes for booker (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g. includes 3-course menu, welcome drink, staffing…"
            rows={3}
            className="w-full border-2 border-dark/30 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-dark text-sm"
          />
        </div>
      </div>

      <button
        onClick={sendProposal}
        disabled={sending || pricePerHead <= 0}
        className="w-full bg-primary text-dark font-display font-bold uppercase py-3.5 rounded-xl border-2 border-dark hover:bg-dark hover:text-primary transition-colors disabled:opacity-40"
      >
        {sending ? 'Sending…' : 'Send proposal to booker →'}
      </button>
    </div>
  )
}
