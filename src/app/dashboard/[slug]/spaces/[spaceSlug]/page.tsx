import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/client'
import { getSpaceBySlug, getMenuPackagesBySpace, getAvailabilityBlocks } from '@/lib/supabase/queries'
import SpaceDetail from './SpaceDetail'

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

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; spaceSlug: string }>
}) {
  const { slug, spaceSlug } = await params
  const venue = await getVenueBySlug(slug)
  if (!venue) notFound()

  const space = await getSpaceBySlug(venue.id, spaceSlug)
  if (!space) notFound()

  const [menuPackages, blockedDates] = await Promise.all([
    getMenuPackagesBySpace(space.id),
    getAvailabilityBlocks(space.id),
  ])

  return (
    <SpaceDetail
      venue={venue}
      space={space}
      initialMenuPackages={menuPackages}
      initialBlockedDates={blockedDates}
    />
  )
}
