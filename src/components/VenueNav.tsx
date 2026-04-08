'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import RoleToggle from '@/components/RoleToggle'

type Props = {
  slug: string
  venueName: string
}

export default function VenueNav({ slug, venueName }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const NAV_LINKS = [
    { label: 'Profile', href: `/dashboard/${slug}/profile` },
    { label: 'Spaces', href: `/dashboard/${slug}/spaces` },
    { label: 'Pipeline', href: `/dashboard/${slug}/pipeline` },
    { label: 'Calendar', href: `/dashboard/${slug}/calendar` },
  ]

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-14 bottom-0 w-[250px] bg-base border-r-2 border-dark z-40 pt-6">
      {/* Role toggle */}
      <div className="px-3 mb-5">
        <RoleToggle
          activeRole="venue"
          onSwitch={(role) => {
            if (role === 'booker') router.push('/events')
          }}
        />
      </div>

      {/* Venue header */}
      <div className="px-5 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-0.5">
          Managing
        </p>
        <h2 className="font-display font-extrabold text-xl uppercase text-dark leading-tight">
          {venueName}
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
        <p className="text-[10px] text-text-muted">/{slug}</p>
      </div>
    </aside>
  )
}
