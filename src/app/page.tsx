import { getVenues } from '@/lib/supabase/queries'
import VenueGrid from '@/components/VenueGrid'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const venues = await getVenues()

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-display font-extrabold text-4xl md:text-5xl uppercase text-dark">
          Venues
        </h1>
      </header>
      <VenueGrid venues={venues} />
    </main>
  )
}
