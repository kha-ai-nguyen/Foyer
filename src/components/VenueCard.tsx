'use client'

import { useState } from 'react'
import type { Venue } from '@/types'

interface VenueCardProps {
  venue: Venue
  isFlipped: boolean
  onFlip: () => void
}

export default function VenueCard({ venue, isFlipped, onFlip }: VenueCardProps) {
  return (
    <div
      className="cursor-pointer [perspective:1000px]"
      onClick={onFlip}
    >
      <div
        className={`relative w-full transition-transform duration-500 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ minHeight: '420px' }}
      >
        {/* Front face */}
        <div className="absolute inset-0 backface-hidden bg-card border-2 border-dark rounded-md overflow-hidden">
          <div className="relative h-[60%] min-h-[250px]">
            <img
              src={venue.imageUrl}
              alt={venue.name}
              className="w-full h-full object-cover border-b-2 border-dark"
            />
          </div>
          <div className="bg-dark text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-2 border-b-2 border-dark">
            {venue.eventType}
          </div>
          <div className="p-4">
            <h3 className="font-display font-extrabold text-2xl uppercase text-dark leading-tight">
              {venue.name}
            </h3>
            <p className="text-text-muted text-sm font-bold uppercase tracking-widest mt-1">
              {venue.neighbourhood}
            </p>
          </div>
        </div>

        {/* Back face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-card border-2 border-dark rounded-md overflow-hidden p-5 flex flex-col gap-3">
          <div className="border-2 border-dark rounded-sm bg-white p-3 flex justify-between">
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block">
                Capacity
              </span>
              <span className="text-sm font-bold uppercase text-dark">
                {venue.capacityRange}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block">
                Price
              </span>
              <span className="text-sm font-bold uppercase text-dark">
                {venue.priceEstimate}
              </span>
            </div>
          </div>
          <p className="text-sm text-text-muted font-medium leading-relaxed flex-1">
            {venue.description}
          </p>
          <button className="w-full bg-primary border-2 border-dark text-dark font-bold uppercase tracking-widest py-3.5 rounded-md hover:bg-secondary hover:text-white transition-colors">
            View Venue →
          </button>
        </div>
      </div>
    </div>
  )
}
