// PHASE 2 — not yet wired to routing
'use client'

import type { Enquiry, Proposal } from '@/types'
import BookingPipeline from './BookingPipeline'
import BookingsBoard from './BookingsBoard'
import TimeSavedMeter from './TimeSavedMeter'
import { Inbox, FileText, TrendingUp } from 'lucide-react'
import { useState } from 'react'

type DashboardTab = 'pipeline' | 'proposals' | 'insights'

interface TimeSavedData {
  total_hours_saved: number
  hours_this_month: number
  enquiries_auto_processed: number
  avg_response_time_minutes: number
  manual_avg_response_time_minutes: number
  proposals_auto_generated: number
}

interface VenueDashboardProps {
  enquiries: Enquiry[]
  proposals: Proposal[]
  timeSaved: TimeSavedData
}

const TABS: { key: DashboardTab; label: string; icon: typeof Inbox }[] = [
  { key: 'pipeline', label: 'Pipeline', icon: Inbox },
  { key: 'proposals', label: 'Proposals', icon: FileText },
  { key: 'insights', label: 'Insights', icon: TrendingUp },
]

export default function VenueDashboard({
  enquiries,
  proposals,
  timeSaved,
}: VenueDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('pipeline')

  const activeEnquiries = enquiries.filter(
    (e) => e.stage !== 'accepted' && e.stage !== 'declined'
  ).length
  const pendingProposals = proposals.filter((p) => p.status === 'submitted').length
  const acceptedValue = proposals
    .filter((p) => p.status === 'accepted')
    .reduce((sum, p) => sum + p.total_value, 0)

  return (
    <div className="space-y-6">
      {/* Summary stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border-2 border-dark rounded-md p-4">
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-1">
            Total Enquiries
          </span>
          <span className="font-display font-extrabold text-2xl text-dark">
            {enquiries.length}
          </span>
        </div>
        <div className="bg-card border-2 border-dark rounded-md p-4">
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-1">
            Active
          </span>
          <span className="font-display font-extrabold text-2xl text-dark">
            {activeEnquiries}
          </span>
        </div>
        <div className="bg-card border-2 border-dark rounded-md p-4">
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-1">
            Pending Proposals
          </span>
          <span className="font-display font-extrabold text-2xl text-dark">
            {pendingProposals}
          </span>
        </div>
        <div className="bg-card border-2 border-dark rounded-md p-4">
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-1">
            Accepted Value
          </span>
          <span className="font-display font-extrabold text-2xl text-dark">
            £{acceptedValue.toLocaleString('en-GB')}
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 border-b-2 border-dark pb-0">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest border-2 border-b-0 rounded-t-md transition-colors ${
              activeTab === key
                ? 'bg-card text-dark border-dark -mb-[2px] z-10'
                : 'bg-base-deep/50 text-text-muted border-transparent hover:bg-base-deep hover:text-dark'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'pipeline' && (
          <BookingPipeline enquiries={enquiries} />
        )}
        {activeTab === 'proposals' && (
          <BookingsBoard proposals={proposals} />
        )}
        {activeTab === 'insights' && (
          <TimeSavedMeter data={timeSaved} />
        )}
      </div>
    </div>
  )
}
