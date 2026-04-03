'use client'

import { useState } from 'react'
import type { EventType } from '@/types'
import { SlidersHorizontal, X } from 'lucide-react'

const EVENT_TYPES: EventType[] = ['Workshop', 'Wedding', 'Corporate', 'Party', 'Exhibition']
const CAPACITIES = ['Up to 50', '50–150', '150–300', '300+']
const PRICES = ['£', '££', '£££', '££££']

interface FilterBarProps {
  selectedType: EventType | null
  onTypeSelect: (type: EventType | null) => void
  selectedCapacity: string | null
  onCapacitySelect: (capacity: string | null) => void
  selectedPrice: string | null
  onPriceSelect: (price: string | null) => void
}

export default function FilterBar({
  selectedType,
  onTypeSelect,
  selectedCapacity,
  onCapacitySelect,
  selectedPrice,
  onPriceSelect,
}: FilterBarProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      {/* Inline bar */}
      <div className="bg-card border-2 border-dark rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Event type chips */}
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => onTypeSelect(selectedType === type ? null : type)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-2 rounded-md transition-colors ${
                  selectedType === type
                    ? 'bg-primary text-dark border-dark'
                    : 'bg-white text-dark border-dark hover:bg-secondary hover:text-white hover:border-secondary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[2px] bg-dark self-stretch min-h-[32px]" />

          {/* Dropdowns + more filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedCapacity ?? ''}
                onChange={(e) => onCapacitySelect(e.target.value || null)}
                className="appearance-none bg-white border-2 border-dark rounded-md px-4 py-2 pr-8 text-[10px] font-bold uppercase tracking-widest text-dark focus:bg-primary focus:outline-none cursor-pointer"
              >
                <option value="">Capacity</option>
                {CAPACITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" viewBox="0 0 12 12" fill="none">
                <path d="M3 5L6 8L9 5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="relative">
              <select
                value={selectedPrice ?? ''}
                onChange={(e) => onPriceSelect(e.target.value || null)}
                className="appearance-none bg-white border-2 border-dark rounded-md px-4 py-2 pr-8 text-[10px] font-bold uppercase tracking-widest text-dark focus:bg-primary focus:outline-none cursor-pointer"
              >
                <option value="">Price</option>
                {PRICES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" viewBox="0 0 12 12" fill="none">
                <path d="M3 5L6 8L9 5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dark rounded-md text-[10px] font-bold uppercase tracking-widest text-dark hover:bg-primary transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Expanded modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-dark/50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-card border-2 border-dark rounded-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b-2 border-dark">
              <h2 className="font-display font-extrabold text-xl uppercase text-dark">
                Filters
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center border-2 border-dark rounded-md hover:bg-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Event type section */}
              <div>
                <h3 className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-3">
                  Event Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  {EVENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => onTypeSelect(selectedType === type ? null : type)}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-2 rounded-md transition-colors ${
                        selectedType === type
                          ? 'bg-primary text-dark border-dark'
                          : 'bg-white text-dark border-dark hover:bg-secondary hover:text-white hover:border-secondary'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capacity section */}
              <div>
                <h3 className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-3">
                  Capacity
                </h3>
                <div className="flex flex-wrap gap-2">
                  {CAPACITIES.map((cap) => (
                    <button
                      key={cap}
                      onClick={() => onCapacitySelect(selectedCapacity === cap ? null : cap)}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-2 rounded-md transition-colors ${
                        selectedCapacity === cap
                          ? 'bg-primary text-dark border-dark'
                          : 'bg-white text-dark border-dark hover:bg-secondary hover:text-white hover:border-secondary'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price section */}
              <div>
                <h3 className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-3">
                  Price Range
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRICES.map((price) => (
                    <button
                      key={price}
                      onClick={() => onPriceSelect(selectedPrice === price ? null : price)}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-2 rounded-md transition-colors ${
                        selectedPrice === price
                          ? 'bg-primary text-dark border-dark'
                          : 'bg-white text-dark border-dark hover:bg-secondary hover:text-white hover:border-secondary'
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t-2 border-dark">
              <button
                onClick={() => {
                  onTypeSelect(null)
                  onCapacitySelect(null)
                  onPriceSelect(null)
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-dark hover:text-secondary underline transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 bg-dark text-primary font-bold uppercase tracking-widest text-[10px] rounded-md border-2 border-dark hover:bg-secondary hover:text-white transition-colors"
              >
                Show Venues
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
