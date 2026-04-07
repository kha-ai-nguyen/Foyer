'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { MasonrySpace } from '@/app/events/[id]/results/mockSpaces'

interface Props {
  spaces: MasonrySpace[]
  eventId: string
}

export default function FeaturedCarousel({ spaces, eventId }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleRequestProposal = useCallback(async (space: MasonrySpace) => {
    if (!space.available || loadingId) return
    setLoadingId(space.id)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          space_id: space.id,
          venue_id: space.venue_id,
        }),
      })
      const data = await res.json()
      if (data.conversation_id) {
        router.push(`/conversations/${data.conversation_id}`)
      }
    } catch {
      setLoadingId(null)
    }
  }, [eventId, loadingId, router])

  if (spaces.length === 0) return null

  return (
    <div className="mb-8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
        Top picks for you
      </p>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
      >
        {spaces.map((space, i) => (
          <motion.div
            key={space.id}
            className="shrink-0 w-[320px] md:w-[380px] relative rounded-2xl border-2 border-dark overflow-hidden cursor-pointer group"
            style={{ height: 400, scrollSnapAlign: 'start' }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={space.photos[0]}
              alt={`${space.venue.name} – ${space.name}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-5 z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-extrabold text-white uppercase text-xl tracking-wide leading-tight">
                    {space.venue.name}
                  </h3>
                  <p className="text-white/50 text-[11px] uppercase tracking-wide mt-1">
                    {space.venue.neighbourhood} · {space.name}
                  </p>
                  <p className="text-white/40 text-[10px] mt-0.5">
                    Up to {space.capacity} guests
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-display font-extrabold text-primary text-2xl">
                    £{space.total_price.toLocaleString()}
                  </span>
                  <p className="text-white/40 text-[10px]">est. total</p>
                </div>
              </div>

              {space.available && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleRequestProposal(space) }}
                  disabled={loadingId === space.id}
                  className="w-full mt-4 bg-primary border-2 border-dark text-dark font-bold uppercase text-xs tracking-widest py-3 rounded-xl hover:bg-secondary hover:text-white transition-colors disabled:opacity-60"
                  style={{ minHeight: 44 }}
                >
                  {loadingId === space.id ? 'Sending...' : 'Request proposal →'}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
