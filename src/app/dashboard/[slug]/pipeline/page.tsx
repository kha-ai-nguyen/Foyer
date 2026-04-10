import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/client'
import { getConversationsByVenueId } from '@/lib/supabase/queries'
import PipelineClient from './PipelineClient'

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

export default async function PipelinePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const venue = await getVenueBySlug(slug)
  if (!venue) notFound()

  const conversations = await getConversationsByVenueId(venue.id)

  // Map conversations to the card shape PipelineClient expects
  const cards = conversations.map((c) => {
    // Supabase returns joined rows; cast via unknown to typed shape
    const event = (c.event as unknown) as {
      id: string
      event_type: string
      headcount: number
      budget_per_head_max: number | null
      date_from: string | null
      booker_name: string
    } | null

    const space = (c.space as unknown) as {
      id: string
      name: string
      capacity: number
      base_price: number
    } | null

    return {
      conversation_id: c.id,
      space_name: space?.name ?? 'Unknown space',
      event_date: event?.date_from ?? new Date().toISOString().split('T')[0],
      event_type: (event?.event_type ?? 'Other') as import('./PipelineClient').EventType,
      headcount: event?.headcount ?? 0,
      booker_budget_per_head: event?.budget_per_head_max ?? 0,
      booker_name: event?.booker_name ?? 'Guest',
      status: (c.status ?? 'incoming') as import('./PipelineClient').Stage,
      last_message_at: c.last_message_at ?? c.created_at,
    }
  })

  // Get space names for filter dropdown
  const spaceNames = Array.from(
    new Set(cards.map((c) => c.space_name).filter(Boolean))
  )

  return (
    <PipelineClient
      venueName={venue.name}
      slug={slug}
      cards={cards}
      spaceNames={spaceNames}
    />
  )
}
