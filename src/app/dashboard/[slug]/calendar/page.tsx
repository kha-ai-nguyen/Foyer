import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/client'
import { getSpacesByVenue, getAvailabilityForAllSpaces } from '@/lib/supabase/queries'
import CalendarClient from './CalendarClient'

export const dynamic = 'force-dynamic'

async function getVenueBySlug(slug: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('venues')
    .select('id, name, slug, neighbourhood')
    .eq('slug', slug)
    .single()
  return data
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const venue = await getVenueBySlug(slug)
  if (!venue) notFound()

  const [spaces, blocks] = await Promise.all([
    getSpacesByVenue(venue.id),
    getAvailabilityForAllSpaces(venue.id),
  ])

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
          {venue.neighbourhood}
        </p>
        <h1 className="font-display font-extrabold text-3xl uppercase text-dark">Calendar</h1>
        <p className="text-sm text-text-muted mt-1">
          View blocked dates across all spaces. Edit individual space calendars from the space detail page.
        </p>
      </div>
      <CalendarClient spaces={spaces} initialBlocks={blocks} />
    </div>
  )
}
