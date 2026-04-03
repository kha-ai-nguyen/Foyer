'use client'

import { useState } from 'react'
import type { EventType } from '@/types'
import { venues } from '@/data/venues'
import FilterBar from '@/components/FilterBar'
import VenueCard from '@/components/VenueCard'

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<EventType | null>(null)
  const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null)
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null)

  const filtered = venues.filter((v) => {
    if (selectedType && v.eventType !== selectedType) return false
    if (selectedCapacity && v.capacityRange !== selectedCapacity) return false
    if (selectedPrice && v.priceEstimate !== selectedPrice) return false
    return true
  })

  function handleFlip(id: string) {
    setFlippedCardId((prev) => (prev === id ? null : id))
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-display font-extrabold text-4xl md:text-5xl uppercase text-dark">
          Venues
        </h1>
        <p className="text-text-muted font-medium mt-2">
          {filtered.length} {filtered.length === 1 ? 'venue' : 'venues'} in London
        </p>
      </header>

      <FilterBar
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
        selectedCapacity={selectedCapacity}
        onCapacitySelect={setSelectedCapacity}
        selectedPrice={selectedPrice}
        onPriceSelect={setSelectedPrice}
      />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              isFlipped={flippedCardId === venue.id}
              onFlip={() => handleFlip(venue.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-display font-extrabold text-2xl uppercase text-dark mb-2">
            No venues yet
          </p>
          <p className="text-text-muted font-medium">
            Check back soon — we're adding London venues daily.
          </p>
        </div>
      )}
    </main>
  )
}
