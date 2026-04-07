'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { MasonrySpace } from '@/app/events/[id]/results/mockSpaces'

const TILE_HEIGHTS: Record<string, number> = {
  featured: 440,
  large: 360,
  medium: 280,
  small: 200,
}

interface Props {
  space: MasonrySpace
  eventId: string
  index: number
}

export default function MasonryTile({ space, eventId, index }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [tapped, setTapped] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  const photos = space.photos.length > 0 ? space.photos : ['/placeholder.jpg']
  const height = TILE_HEIGHTS[space.tileSize] ?? 280
  const showDetails = hovered || tapped

  // Auto-cycle photos on hover
  useEffect(() => {
    if (!hovered || photos.length <= 1) return
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % photos.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [hovered, photos.length])

  // Reset photo when not hovered
  useEffect(() => {
    if (!hovered) setPhotoIndex(0)
  }, [hovered])

  const handleRequestProposal = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!space.available || loading) return
    setLoading(true)
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
      setLoading(false)
    }
  }, [space.available, space.id, space.venue_id, eventId, loading, router])

  return (
    <motion.div
      className="break-inside-avoid mb-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4), ease: 'easeOut' }}
    >
      <motion.div
        className={`relative overflow-hidden rounded-2xl border-2 border-dark cursor-pointer ${
          !space.available ? 'opacity-50' : ''
        }`}
        style={{ height }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => { setHovered(false); setTapped(false) }}
        onClick={() => setTapped((t) => !t)}
      >
        {/* Photo with crossfade */}
        <AnimatePresence mode="wait">
          <motion.img
            key={photoIndex}
            src={photos[photoIndex]}
            alt={`${space.venue.name} – ${space.name}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
          />
        </AnimatePresence>

        {/* Photo count dots */}
        {photos.length > 1 && (
          <div className="absolute top-3 right-3 flex gap-1 z-10">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === photoIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Unavailable badge */}
        {!space.available && (
          <div className="absolute top-3 left-3 z-10 bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
            Unavailable
          </div>
        )}

        {/* Default gradient overlay — always visible */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent pt-16 pb-4 px-4 z-10">
          <h3 className="font-display font-extrabold text-white uppercase text-sm tracking-wide leading-tight">
            {space.venue.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display font-extrabold text-primary text-lg">
              £{space.total_price.toLocaleString()}
            </span>
            <span className="text-white/60 text-[10px] uppercase tracking-wide">
              est.
            </span>
          </div>
          <p className="text-white/50 text-[10px] uppercase tracking-wide mt-0.5">
            {space.venue.neighbourhood} · {space.distance_km.toFixed(1)}km
          </p>
        </div>

        {/* Hover/tap detail overlay */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="absolute inset-0 z-20 bg-dark/90 flex flex-col justify-end p-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-white uppercase text-lg tracking-wide leading-tight">
                  {space.venue.name}
                </h3>
                <p className="text-white/60 text-xs uppercase tracking-wide">
                  {space.venue.neighbourhood} · {space.distance_km.toFixed(1)}km
                </p>
                <p className="text-white/80 text-sm">{space.name}</p>
                <p className="text-white/60 text-xs">
                  Up to {space.capacity} guests
                </p>

                {/* Price */}
                <div className="inline-block bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1">
                  <span className="font-display font-extrabold text-2xl text-primary">
                    £{space.total_price.toLocaleString()}
                  </span>
                  <span className="text-white/50 text-xs ml-1">est. total</span>
                  <p className="text-white/40 text-[10px] mt-0.5">
                    £{space.base_price}/head
                    {space.payment_min_spend
                      ? ` + £${space.payment_min_spend.toLocaleString()} min spend`
                      : ''}
                  </p>
                </div>

                {/* Payment terms pills */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {space.payment_deposit_pct && (
                    <span className="text-[10px] text-white/50 border border-white/20 rounded-full px-2 py-0.5">
                      {space.payment_deposit_pct}% deposit
                    </span>
                  )}
                  {space.payment_min_spend && (
                    <span className="text-[10px] text-white/50 border border-white/20 rounded-full px-2 py-0.5">
                      £{space.payment_min_spend.toLocaleString()} min
                    </span>
                  )}
                </div>

                {/* CTA */}
                {space.available ? (
                  <button
                    onClick={handleRequestProposal}
                    disabled={loading}
                    className="w-full mt-3 bg-primary border-2 border-dark text-dark font-bold uppercase text-xs tracking-widest py-3 px-4 rounded-xl hover:bg-secondary hover:text-white transition-colors disabled:opacity-60"
                    style={{ minHeight: 44 }}
                  >
                    {loading ? 'Sending...' : 'Request proposal →'}
                  </button>
                ) : (
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wide py-2 mt-2">
                    Not available on these dates
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
