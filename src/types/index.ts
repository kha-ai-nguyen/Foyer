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
  slug: string | null
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
  claimed: boolean
  claimed_by_name: string | null
  claimed_by_email: string | null
  claimed_by_role: string | null
  claimed_at: string | null
  placeholder_image_url: string | null
}

export interface AvailabilityBlock {
  id: string
  venue_id: string
  blocked_date: string // YYYY-MM-DD
  note: string | null
  created_at: string
}

export interface Enquiry {
  id: string
  venue_id: string | null
  venue_name: string
  venue_email: string
  event_date: string // YYYY-MM-DD
  headcount: number
  price_per_head: number | null
  event_type: string
  notes: string | null
  sent_at: string
  sender_placeholder: string
}

export interface ClaimRequest {
  id: string
  venue_id: string
  name: string
  email: string
  role: string
  created_at: string
  approved: boolean
}

// Phase 2 — Enquiry & Proposal types

export type EnquiryStage =
  | 'new'
  | 'contacted'
  | 'proposal_sent'
  | 'accepted'
  | 'declined'

export interface Enquiry {
  id: string
  venue_id: string
  booker_name: string
  booker_email: string
  event_type: EventType
  event_date: string
  headcount: number
  budget: string | null
  message: string | null
  stage: EnquiryStage
  created_at: string
  updated_at: string
}

export type ProposalStatus = 'submitted' | 'accepted' | 'declined'

export interface Proposal {
  id: string
  venue_id: string
  enquiry_id: string
  booker_name: string
  event_type: EventType
  event_date: string
  headcount: number
  price_per_head: number
  total_value: number
  status: ProposalStatus
  date_submitted: string
  date_responded: string | null
}

export interface TimeSavedData {
  total_hours_saved: number
  hours_this_month: number
  enquiries_auto_processed: number
  avg_response_time_minutes: number
  manual_avg_response_time_minutes: number
  proposals_auto_generated: number
}
