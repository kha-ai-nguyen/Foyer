import { createServiceClient } from './client'
import type { Venue } from '@/types'

export async function getVenues(): Promise<Venue[]> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getVenues error:', error.message)
    return []
  }
  return (data ?? []) as Venue[]
}
