// PHASE 2 — not yet wired to routing
'use client'

import type { Enquiry, EnquiryStage } from '@/types'
import { User, Calendar, Users, Mail } from 'lucide-react'

const STAGE_META: Record<EnquiryStage, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-primary' },
  contacted: { label: 'Contacted', color: 'bg-base-deep' },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-secondary' },
  accepted: { label: 'Accepted', color: 'bg-primary' },
  declined: { label: 'Declined', color: 'bg-dark' },
}

const PIPELINE_STAGES: EnquiryStage[] = [
  'new',
  'contacted',
  'proposal_sent',
  'accepted',
  'declined',
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  return (
    <div className="bg-card border-2 border-dark rounded-md p-4 space-y-3 hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-display font-extrabold text-sm uppercase text-dark leading-tight">
          {enquiry.booker_name}
        </h4>
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">
          {enquiry.event_type}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-text-muted">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs font-medium">{formatDate(enquiry.event_date)}</span>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <Users className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs font-medium">{enquiry.headcount} guests</span>
        </div>
        {enquiry.budget && (
          <div className="flex items-center gap-2 text-text-muted">
            <span className="w-3.5 h-3.5 flex-shrink-0 text-center text-xs font-bold">£</span>
            <span className="text-xs font-medium">{enquiry.budget}</span>
          </div>
        )}
      </div>

      {enquiry.message && (
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
          {enquiry.message}
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-dark/10">
        <span className="text-[10px] text-text-muted font-medium">
          {formatDate(enquiry.created_at)}
        </span>
        <div className="flex gap-1">
          <button className="w-6 h-6 flex items-center justify-center border border-dark/20 rounded hover:bg-primary hover:border-dark transition-colors">
            <Mail className="w-3 h-3" />
          </button>
          <button className="w-6 h-6 flex items-center justify-center border border-dark/20 rounded hover:bg-primary hover:border-dark transition-colors">
            <User className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BookingPipeline({ enquiries }: { enquiries: Enquiry[] }) {
  const grouped = PIPELINE_STAGES.reduce<Record<EnquiryStage, Enquiry[]>>(
    (acc, stage) => {
      acc[stage] = enquiries.filter((e) => e.stage === stage)
      return acc
    },
    { new: [], contacted: [], proposal_sent: [], accepted: [], declined: [] }
  )

  return (
    <div className="space-y-4">
      <h2 className="font-display font-extrabold text-xl uppercase text-dark">
        Enquiry Pipeline
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const meta = STAGE_META[stage]
          const items = grouped[stage]

          return (
            <div
              key={stage}
              className="flex-shrink-0 w-64 flex flex-col"
            >
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${meta.color} border border-dark`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-dark">
                  {meta.label}
                </span>
                <span className="ml-auto text-[10px] font-bold text-text-muted bg-white border border-dark/20 rounded px-1.5 py-0.5">
                  {items.length}
                </span>
              </div>

              {/* Column body */}
              <div className="flex-1 bg-base-deep/30 border-2 border-dark/10 rounded-md p-2 space-y-2 min-h-[200px]">
                {items.length > 0 ? (
                  items.map((enquiry) => (
                    <EnquiryCard key={enquiry.id} enquiry={enquiry} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <span className="text-xs text-text-muted font-medium">No enquiries</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
