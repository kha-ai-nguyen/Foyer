'use client'

import { useState } from 'react'
import type { Venue } from '@/types'
import { Globe, Phone, Mail, ChevronRight, Search, ListChecks, Send } from 'lucide-react'

interface VenueListViewProps {
  venues: Venue[]
}

const STEPS = [
  { icon: Search, label: 'Browse', description: 'Search venues' },
  { icon: ListChecks, label: 'Shortlist', description: 'Pick favourites' },
  { icon: Send, label: 'Send Enquiries', description: 'Contact venues' },
]

export default function VenueListView({ venues }: VenueListViewProps) {
  const [currentStep] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top stepper */}
      <div className="flex items-center justify-center gap-2 p-6 border-b-2 border-dark bg-card">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${i !== currentStep ? 'opacity-50' : ''}`}>
              <div className={`w-8 h-8 flex items-center justify-center border-2 border-dark rounded-md ${
                i === currentStep ? 'bg-primary' : 'bg-white'
              }`}>
                <step.icon className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-dark">
                  {step.label}
                </p>
                <p className="text-[10px] text-text-muted">{step.description}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="w-4 h-4 text-dark mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* List rows */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {venues.map((venue) => {
          const isSelected = selectedIds.has(venue.id)
          return (
            <div
              key={venue.id}
              className={`bg-card border-2 rounded-lg p-4 flex items-center gap-4 transition-colors ${
                isSelected ? 'border-primary bg-primary/5' : 'border-dark'
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleSelection(venue.id)}
                className={`w-5 h-5 flex-shrink-0 border-2 rounded-sm flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-primary border-primary' : 'border-dark bg-white'
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Thumbnail */}
              <img
                src={venue.imageUrl}
                alt={venue.name}
                className="w-16 h-16 object-cover rounded-sm border-2 border-dark flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-extrabold text-sm uppercase text-dark truncate">
                  {venue.name}
                </h4>
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                  {venue.neighbourhood} · {venue.capacityRange}
                </p>
              </div>

              {/* Action icons */}
              <div className="hidden sm:flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center border-2 border-dark rounded-md hover:bg-primary transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center border-2 border-dark rounded-md hover:bg-primary transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center border-2 border-dark rounded-md hover:bg-primary transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center border-2 border-dark rounded-md hover:bg-primary transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}

        {venues.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted font-medium">No venues to display</p>
          </div>
        )}
      </div>

      {/* Summary bar */}
      <div className="border-t-2 border-dark bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block">
              Total
            </span>
            <span className="font-display font-extrabold text-2xl text-dark">
              {venues.length}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block">
              Shortlisted
            </span>
            <span className="font-display font-extrabold text-2xl text-dark">
              {selectedIds.size}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block">
              Enquiries Sent
            </span>
            <span className="font-display font-extrabold text-2xl text-dark">
              0
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
