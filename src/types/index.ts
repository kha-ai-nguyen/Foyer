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
