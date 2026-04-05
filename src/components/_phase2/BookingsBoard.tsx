// PHASE 2 — not yet wired to routing
'use client'

import { useState } from 'react'
import type { Proposal, ProposalStatus } from '@/types'
import { formatDateFull, formatCurrency } from '@/lib/utils'
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_CONFIG: Record<ProposalStatus, { label: string; icon: typeof Clock; bg: string; text: string }> = {
  submitted: { label: 'Submitted', icon: Clock, bg: 'bg-base-deep', text: 'text-dark' },
  accepted: { label: 'Accepted', icon: CheckCircle, bg: 'bg-primary', text: 'text-dark' },
  declined: { label: 'Declined', icon: XCircle, bg: 'bg-dark', text: 'text-white' },
}

function ProposalRow({ proposal }: { proposal: Proposal }) {
  const [expanded, setExpanded] = useState(false)
  const config = STATUS_CONFIG[proposal.status]
  const StatusIcon = config.icon

  return (
    <div className="bg-card border-2 border-dark rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full p-4 flex items-center gap-4 hover:bg-base/30 transition-colors text-left focus-visible:outline-2 focus-visible:outline-dark"
      >
        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${config.bg} ${config.text} border-2 border-dark`}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </span>

        {/* Booker + event */}
        <div className="flex-1 min-w-0">
          <span className="font-display font-extrabold text-sm uppercase text-dark">
            {proposal.booker_name}
          </span>
          <span className="text-text-muted text-xs ml-2">
            {proposal.event_type} · {formatDateFull(proposal.event_date)}
          </span>
        </div>

        {/* Price */}
        <span className="font-display font-extrabold text-sm text-dark whitespace-nowrap">
          {formatCurrency(proposal.total_value)}
        </span>

        {/* Expand toggle */}
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t-2 border-dark p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-1">
              Price / Head
            </span>
            <span className="text-sm font-bold text-dark">
              £{proposal.price_per_head}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-1">
              Headcount
            </span>
            <span className="text-sm font-bold text-dark">
              {proposal.headcount}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-1">
              Sent
            </span>
            <span className="text-sm font-bold text-dark">
              {formatDateFull(proposal.date_submitted)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-1">
              Responded
            </span>
            <span className="text-sm font-bold text-dark">
              {proposal.date_responded ? formatDateFull(proposal.date_responded) : '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingsBoard({ proposals }: { proposals: Proposal[] }) {
  const [filter, setFilter] = useState<ProposalStatus | 'all'>('all')

  const filtered = filter === 'all'
    ? proposals
    : proposals.filter((p) => p.status === filter)

  const counts = {
    all: proposals.length,
    submitted: proposals.filter((p) => p.status === 'submitted').length,
    accepted: proposals.filter((p) => p.status === 'accepted').length,
    declined: proposals.filter((p) => p.status === 'declined').length,
  }

  const totalValue = proposals
    .filter((p) => p.status === 'accepted')
    .reduce((sum, p) => sum + p.total_value, 0)

  const filterButtons: { key: ProposalStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'submitted', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'declined', label: 'Declined' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-extrabold text-xl uppercase text-dark">
          Proposals
        </h2>
        <div className="text-right">
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block">
            Accepted Value
          </span>
          <span className="font-display font-extrabold text-lg text-dark">
            {formatCurrency(totalValue)}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filterButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border-2 rounded-md transition-colors ${
              filter === key
                ? 'bg-primary text-dark border-dark'
                : 'bg-white text-dark border-dark hover:bg-secondary hover:text-white hover:border-secondary'
            }`}
          >
            {label}
            <span className="ml-1.5 text-text-muted">{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Proposals list */}
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((proposal) => (
            <ProposalRow key={proposal.id} proposal={proposal} />
          ))
        ) : (
          <div className="text-center py-12 bg-card border-2 border-dark rounded-md">
            <p className="text-text-muted font-medium">No proposals match this filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
