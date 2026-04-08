'use client'

import Link from 'next/link'

export default function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-base border-b-2 border-dark flex items-center px-5">
      <Link
        href="/"
        className="font-display font-extrabold text-xl uppercase text-dark tracking-tight"
      >
        Fete
      </Link>
    </nav>
  )
}
