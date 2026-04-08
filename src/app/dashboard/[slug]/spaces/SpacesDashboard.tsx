'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Space, ExtractedVenueData } from '@/types'
import PDFUploadWidget from '@/components/PDFUploadWidget'
import ExtractedDataReview from '@/components/ExtractedDataReview'
import { slugify } from '@/lib/utils'

type Venue = { id: string; name: string; slug: string; neighbourhood: string }

// ── Quick-create modal (name + capacity only, then redirect to detail) ──────

function QuickCreateModal({
  venueId,
  venueSlug,
  onClose,
}: {
  venueId: string
  venueSlug: string
  onClose: () => void
}) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!name || !capacity) return
    setLoading(true)

    const res = await fetch('/api/spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        venue_id: venueId,
        name,
        capacity: parseInt(capacity) || 0,
        base_price: 0,
      }),
    })

    if (res.ok) {
      const space = await res.json()
      const spaceSlug = space.slug || slugify(name)
      router.push(`/dashboard/${venueSlug}/spaces/${spaceSlug}`)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-dark/60 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white border-2 border-dark rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display font-bold text-2xl uppercase mb-5">Add space</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Space name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Private Dining Room"
              className="w-full border-2 border-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 60"
              className="w-full border-2 border-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCreate}
            disabled={loading || !name || !capacity}
            className="flex-1 bg-dark text-white font-display font-bold uppercase py-3 rounded-xl hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create & edit'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 border-2 border-dark rounded-xl font-semibold hover:bg-base-deep"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Import modal ────────────────────────────────────────────────────────────

function ImportModal({
  slug,
  onClose,
  onDone,
}: {
  slug: string
  onClose: () => void
  onDone: () => void
}) {
  const [step, setStep] = useState<'upload' | 'review' | 'success'>('upload')
  const [extractedData, setExtractedData] = useState<ExtractedVenueData | null>(null)

  if (step === 'success') {
    onDone()
    return null
  }

  return (
    <div className="fixed inset-0 bg-dark/60 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white border-2 border-dark rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-2xl uppercase">Import from PDF</h2>
          <button onClick={onClose} className="text-dark hover:text-secondary text-xl font-bold">×</button>
        </div>
        {step === 'upload' && (
          <PDFUploadWidget slug={slug} onExtracted={(data) => { setExtractedData(data); setStep('review') }} />
        )}
        {step === 'review' && extractedData && (
          <ExtractedDataReview
            data={extractedData}
            slug={slug}
            onSaved={() => setStep('success')}
            onReset={() => { setExtractedData(null); setStep('upload') }}
          />
        )}
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function SpacesDashboard({
  venue,
  initialSpaces,
}: {
  venue: Venue
  initialSpaces: Space[]
}) {
  const [spaces, setSpaces] = useState<Space[]>(initialSpaces)
  const [showCreate, setShowCreate] = useState(false)
  const [showImport, setShowImport] = useState(false)

  async function handleDelete(e: React.MouseEvent, spaceId: string) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this space? This cannot be undone.')) return
    await fetch(`/api/spaces/${spaceId}`, { method: 'DELETE' })
    setSpaces((prev) => prev.filter((s) => s.id !== spaceId))
  }

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
            {venue.neighbourhood}
          </p>
          <h2 className="font-display font-bold text-3xl uppercase text-dark">Spaces</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="border-2 border-dark text-dark font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-base-deep transition-colors"
          >
            Import from PDF
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-primary border-2 border-dark text-dark font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-dark hover:text-primary transition-colors"
          >
            + Add space
          </button>
        </div>
      </div>

      {spaces.length === 0 ? (
        <div className="bg-white border-2 border-dark rounded-2xl p-10 text-center">
          <p className="font-display font-bold text-xl uppercase text-dark mb-2">No spaces yet</p>
          <p className="text-text-muted text-sm mb-4">Add your first space or import from a PDF brochure.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowCreate(true)}
              className="bg-primary border-2 border-dark text-dark font-semibold px-5 py-2.5 rounded-xl hover:bg-dark hover:text-primary transition-colors"
            >
              + Add space
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="border-2 border-dark text-dark font-semibold px-5 py-2.5 rounded-xl hover:bg-base-deep transition-colors"
            >
              Import from PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {spaces.map((space) => {
            const spaceSlug = space.slug || slugify(space.name)
            return (
              <Link
                key={space.id}
                href={`/dashboard/${venue.slug}/spaces/${spaceSlug}`}
                className="block bg-white border-2 border-dark rounded-2xl p-5 flex items-start justify-between gap-4 hover:shadow-[4px_4px_0_#1A1A1A] hover:-translate-y-0.5 transition-all"
              >
                {space.photos.length > 0 && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-dark shrink-0">
                    <img src={space.photos[0]} alt={space.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg uppercase truncate">{space.name}</h3>
                  <div className="flex gap-4 text-sm text-text-muted mt-1 flex-wrap">
                    <span>Up to <strong className="text-dark">{space.capacity}</strong> guests</span>
                    <span><strong className="text-dark">£{space.base_price}</strong>/head</span>
                    {space.payment_deposit_pct && <span>{space.payment_deposit_pct}% deposit</span>}
                    {space.payment_min_spend && <span>£{space.payment_min_spend.toLocaleString()} min</span>}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, space.id)}
                  className="px-3 py-1.5 border-2 border-dark rounded-lg text-sm font-medium hover:bg-secondary hover:text-white hover:border-secondary transition-colors shrink-0"
                >
                  Delete
                </button>
              </Link>
            )
          })}
        </div>
      )}

      {showCreate && (
        <QuickCreateModal
          venueId={venue.id}
          venueSlug={venue.slug}
          onClose={() => setShowCreate(false)}
        />
      )}

      {showImport && (
        <ImportModal
          slug={venue.slug}
          onClose={() => setShowImport(false)}
          onDone={() => {
            setShowImport(false)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
