export type EventType =
  | 'Workshop'
  | 'Wedding'
  | 'Corporate'
  | 'Party'
  | 'Exhibition'

// Matches the Supabase venues table schema (snake_case)
export interface Venue {
  id: string
  name: string
  neighbourhood: string
  capacity_min: number | null
  capacity_max: number | null
  price_estimate: string | null
  event_types: string[]
  description: string | null
  photos: string[]
  website: string | null
  last_confirmed_at: string | null
  created_at: string
}
