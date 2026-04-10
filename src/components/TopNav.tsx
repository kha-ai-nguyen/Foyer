'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const DEMO_VENUES = [
  { name: 'Morchella', slug: 'morchella', neighbourhood: 'Shoreditch' },
  { name: 'Boxcar', slug: 'boxcar', neighbourhood: 'Hackney' },
  { name: 'Tamila', slug: 'tamila', neighbourhood: 'Brixton' },
  { name: 'The Culpeper', slug: 'the-culpeper', neighbourhood: 'Spitalfields' },
  { name: 'Lardo', slug: 'lardo', neighbourhood: 'London Fields' },
  { name: 'Studio 9294', slug: 'studio-9294', neighbourhood: 'Hackney Wick' },
  { name: 'The Exhibitionist', slug: 'the-exhibitionist', neighbourhood: 'South Kensington' },
  { name: 'Ottolenghi Islington', slug: 'ottolenghi-islington', neighbourhood: 'Islington' },
  { name: 'Printworks London', slug: 'printworks-london', neighbourhood: 'Surrey Quays' },
  { name: 'Pergola on the Roof', slug: 'pergola-on-the-roof', neighbourhood: 'White City' },
]

const DEMO_BOOKERS = [
  { name: 'Sophie Chen', eventId: '11111111-0000-0000-0000-000000000001', detail: 'Alumni dinner · 60 guests' },
  { name: 'James Hartley', eventId: '11111111-0000-0000-0000-000000000002', detail: 'Corporate lunch · 40 guests' },
  { name: 'Priya Patel', eventId: '11111111-0000-0000-0000-000000000003', detail: 'Birthday party · 80 guests' },
  { name: 'Tom Williams', eventId: '11111111-0000-0000-0000-000000000004', detail: 'Workshop · 30 guests' },
  { name: 'Emma Davis', eventId: '11111111-0000-0000-0000-000000000005', detail: 'Wedding · 100 guests' },
  { name: 'Marcus Johnson', eventId: '11111111-0000-0000-0000-000000000006', detail: 'Product launch · 120 guests' },
  { name: 'Natasha Ivanova', eventId: '11111111-0000-0000-0000-000000000007', detail: 'Hen party · 25 guests' },
  { name: 'Oliver Grant', eventId: '11111111-0000-0000-0000-000000000008', detail: 'Team dinner · 45 guests' },
  { name: 'Zara Ahmed', eventId: '11111111-0000-0000-0000-000000000009', detail: 'Gallery opening · 60 guests' },
  { name: 'Ben Clarke', eventId: '11111111-0000-0000-0000-000000000010', detail: 'Alumni dinner · 50 guests' },
]

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showPicker, setShowPicker] = useState(false)
  const [pickerTab, setPickerTab] = useState<'venue' | 'booker'>('venue')

  const dashboardMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const currentSlug = dashboardMatch ? dashboardMatch[1] : null
  const isVenueRole = !!currentSlug

  const currentVenueName = currentSlug
    ? (DEMO_VENUES.find((v) => v.slug === currentSlug)?.name ?? capitalize(currentSlug))
    : null

  function switchToVenue(slug: string) {
    setShowPicker(false)
    router.push(`/dashboard/${slug}`)
  }

  function switchToBooker(eventId: string) {
    setShowPicker(false)
    router.push(`/events/${eventId}`)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-base border-b-2 border-dark flex items-center px-5 gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-extrabold text-xl uppercase text-dark tracking-tight"
        >
          Fete
        </Link>

        <div className="w-[2px] h-5 bg-dark/20" />

        {/* Role indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Mode</span>
          <span className="bg-dark text-primary text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
            {isVenueRole ? currentVenueName : 'Booker'}
          </span>
        </div>

        <div className="ml-auto" />

        {/* Switch role */}
        {isVenueRole ? (
          <button
            onClick={() => { setPickerTab('booker'); setShowPicker(true) }}
            className="bg-white border-2 border-dark text-dark text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-primary transition-colors"
          >
            ← Booker
          </button>
        ) : (
          <button
            onClick={() => { setPickerTab('venue'); setShowPicker(true) }}
            className="bg-dark text-primary text-sm font-semibold px-4 py-1.5 rounded-lg border-2 border-dark hover:bg-secondary hover:text-white hover:border-secondary transition-colors"
          >
            Venue →
          </button>
        )}
      </nav>

      {/* Demo switcher modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-[60] bg-dark/50 flex items-center justify-center px-4"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="bg-white border-2 border-dark rounded-2xl p-6 w-full max-w-sm max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
              Demo mode
            </p>
            <h2 className="font-display font-bold text-2xl uppercase text-dark mb-4">
              Switch perspective
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {(['venue', 'booker'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPickerTab(tab)}
                  className={`flex-1 py-2 rounded-lg border-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    pickerTab === tab
                      ? 'bg-dark text-primary border-dark'
                      : 'bg-white text-dark border-dark hover:bg-base-deep'
                  }`}
                >
                  {tab === 'venue' ? 'Venue' : 'Booker'}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2 overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin' }}>
              {pickerTab === 'venue'
                ? DEMO_VENUES.map((v) => (
                    <button
                      key={v.slug}
                      onClick={() => switchToVenue(v.slug)}
                      className="w-full text-left px-4 py-3 border-2 border-dark rounded-xl hover:bg-primary transition-colors group"
                    >
                      <p className="font-display font-bold text-base uppercase text-dark">{v.name}</p>
                      <p className="text-[11px] text-text-muted group-hover:text-dark/60">{v.neighbourhood}</p>
                    </button>
                  ))
                : DEMO_BOOKERS.map((b) => (
                    <button
                      key={b.eventId}
                      onClick={() => switchToBooker(b.eventId)}
                      className="w-full text-left px-4 py-3 border-2 border-dark rounded-xl hover:bg-primary transition-colors group"
                    >
                      <p className="font-display font-bold text-base uppercase text-dark">{b.name}</p>
                      <p className="text-[11px] text-text-muted group-hover:text-dark/60">{b.detail}</p>
                    </button>
                  ))}
            </div>

            <button
              onClick={() => setShowPicker(false)}
              className="mt-4 w-full text-center text-sm text-text-muted underline underline-offset-2 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
