'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import RoleToggle from '@/components/RoleToggle'

const DEMO_VENUES = [
  { name: 'Morchella', slug: 'morchella' },
  { name: 'Boxcar', slug: 'boxcar' },
  { name: 'Tamila', slug: 'tamila' },
]

const NAV_LINKS = [
  { label: 'Create Event', href: '/create-event' },
  { label: 'My Events', href: '/events' },
  { label: 'Explore Venues', href: '/explore' },
]

export default function BookerNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showVenuePicker, setShowVenuePicker] = useState(false)

  function isActive(href: string) {
    if (href === '/create-event') return pathname === href
    if (href === '/events') return pathname === '/events' || pathname.startsWith('/events/')
    if (href === '/explore') return pathname.startsWith('/explore')
    return pathname === href
  }

  return (
    <>
      <aside className="hidden md:flex flex-col fixed left-0 top-14 bottom-0 w-[250px] bg-base border-r-2 border-dark z-40 pt-6">
        {/* Role toggle */}
        <div className="px-3 mb-5">
          <RoleToggle
            activeRole="booker"
            onSwitch={(role) => {
              if (role === 'venue') setShowVenuePicker(true)
            }}
          />
        </div>

        {/* Header */}
        <div className="px-5 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-0.5">
            You are
          </p>
          <h2 className="font-display font-extrabold text-2xl uppercase text-dark">
            Booker
          </h2>
        </div>

        {/* Nav links */}
        <nav className="px-3 space-y-0.5">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive(href)
                  ? 'bg-dark text-primary'
                  : 'text-dark hover:bg-base-deep'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-5 pb-6">
          <p className="text-[10px] text-text-muted">Fete v0 · booker demo</p>
        </div>
      </aside>

      {/* Venue picker modal */}
      {showVenuePicker && (
        <div
          className="fixed inset-0 z-[60] bg-dark/50 flex items-center justify-center px-4"
          onClick={() => setShowVenuePicker(false)}
        >
          <div
            className="bg-white border-2 border-dark rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
              Demo venues
            </p>
            <h2 className="font-display font-bold text-2xl uppercase text-dark mb-5">
              Select a venue to manage
            </h2>
            <div className="space-y-2">
              {DEMO_VENUES.map((v) => (
                <button
                  key={v.slug}
                  onClick={() => {
                    setShowVenuePicker(false)
                    router.push(`/dashboard/${v.slug}`)
                  }}
                  className="w-full text-left px-4 py-3 border-2 border-dark rounded-xl font-display font-bold text-lg uppercase hover:bg-primary transition-colors"
                >
                  {v.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowVenuePicker(false)}
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
