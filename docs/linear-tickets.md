# Linear Tickets - Fete Phase 1 (KHA-1 to KHA-27)

**Project:** Fete  
**Team Key:** KHA  
**Organization:** Phase-based cycles (Phase 1a Infrastructure → Phase 1b Booker + Phase 1c Venue CRM in parallel)

---

## Labels (Create These First)

### Module Labels
- `booker-home`
- `booker-events`
- `booker-conversations`
- `booker-explore`
- `venue-inbox`
- `venue-pipeline`
- `venue-conversations`
- `venue-calendar`
- `venue-documents`
- `venue-payments`
- `venue-analytics`
- `venue-profile`

### Priority Labels
- `p0-critical`
- `p1-high`
- `p2-medium`
- `p3-backlog`

### Type Labels
- `infrastructure`
- `feature`
- `bug`
- `research`
- `doc`

### Status (Use Linear's built-in states)
- Backlog
- Todo
- In Progress
- In Review
- Done

---

## Phase 1a: Infrastructure (Blocking, Sprint 1–2)

### KHA-1: 11 Labs Voice Agent Setup & Sandbox Testing
- **Status:** Backlog
- **Priority:** P0 Critical
- **Labels:** `infrastructure`, `p0-critical`
- **Cycle:** Phase 1a
- **Estimate:** 5 days
- **Description:**
  Set up 11 Labs API integration and test voice agent capabilities in sandbox environment. This is the foundation for all outbound voice calling.

- **Acceptance Criteria:**
  - [ ] 11 Labs API key obtained and authenticated in `.env.local`
  - [ ] Test sandbox call successfully placed to test number
  - [ ] Voice model options tested (gender, accent variations documented)
  - [ ] Success rate + latency metrics measured and documented
  - [ ] Cost per minute calculated and recorded
  - [ ] `/api/agent/voice/call` endpoint returns jobId for async tracking

- **Technical Details:**
  - Create `/lib/agent/eleven-labs.ts` with 11 Labs SDK integration
  - Implement `/api/agent/voice/call` endpoint for initiating calls
  - Store call metadata (phone, script, start_time, expected_duration)
  - Setup async job queue (Bull/BullMQ) for call scheduling
  - Create Supabase table: `voice_calls` (id, venue_id, event_id, status, duration, transcription, created_at, completed_at)

---

### KHA-2: Voice Call Transcription & Storage Pipeline
- **Status:** Backlog
- **Priority:** P0 Critical
- **Labels:** `infrastructure`, `p0-critical`
- **Cycle:** Phase 1a
- **Estimate:** 5 days
- **Depends on:** KHA-1

- **Description:**
  Implement transcription pipeline for voice calls. Transcribed text must appear in conversation thread within 2 minutes of call completion.

- **Acceptance Criteria:**
  - [ ] Call transcription appears in `conversation_messages` within 2 minutes of call end
  - [ ] Key data extraction (availability, price, decision timeline) works via Claude API
  - [ ] Audio file stored encrypted in Supabase storage `/voice-calls/[venue_id]/[call_id].wav`
  - [ ] Transcription accuracy tested on 5+ real test calls
  - [ ] Webhook from 11 Labs triggers transcription job (no polling)
  - [ ] Failed transcriptions logged with error details + retry logic

- **Technical Details:**
  - Create `/api/agent/voice/transcribe` webhook endpoint (accept 11 Labs callback)
  - Integrate speech-to-text provider (Deepgram, AssemblyAI, or 11 Labs native)
  - Use Claude API with prompt to extract: availability_dates, price_quote, contact_name, decision_timeline, objections
  - Store in `conversation_messages` with:
    - `message_type: 'voice'`
    - `extracted_data: { availability, price, contact_name, decision_timeline, objections }`
    - `metadata: { duration, transcription_confidence, voice_model_used }`
  - Add audio URL to message for playback in conversation thread

---

### KHA-3: Email Parsing & Auto-Logging Pipeline
- **Status:** Backlog
- **Priority:** P0 Critical
- **Labels:** `infrastructure`, `p0-critical`
- **Cycle:** Phase 1a
- **Estimate:** 4 days

- **Description:**
  Implement inbound email parsing pipeline. Emails to Fete inbox are automatically logged to conversation threads with extracted key data.

- **Acceptance Criteria:**
  - [ ] Inbound emails to fete@[domain] auto-logged to `conversation_messages`
  - [ ] Key data extracted (availability, price, contact name, decision timeline) via Claude API
  - [ ] Email threading: multiple emails in same thread grouped correctly by In-Reply-To header
  - [ ] Parse accuracy tested on 10+ real inbound venue emails
  - [ ] Conversation matched via From email address (sender_email → conversation.venue_email)
  - [ ] Failed parses logged with email content + error reason

- **Technical Details:**
  - Setup email webhook (Gmail API, Postmark, or Mailgun)
  - Create `/api/email/inbound` endpoint (accept webhook payload)
  - Use Claude API with prompt to extract: availability_dates, price_range, contact_name, decision_timeline, questions, tone
  - Create `conversation_messages` record with:
    - `message_type: 'email'`
    - `sender: 'venue'` (or 'booker' if applicable)
    - `extracted_data: { availability, price, contact_name, decision_timeline }`
    - `metadata: { email_subject, email_from, email_to, reply_to_id }`
  - Match venue via email domain + sender address
  - Handle: plain text + HTML emails, attachments (store in Supabase), signature parsing

---

### KHA-4: Conversation Thread Data Model & Unification
- **Status:** Backlog
- **Priority:** P0 Critical
- **Labels:** `infrastructure`, `p0-critical`
- **Cycle:** Phase 1a
- **Estimate:** 2 days
- **Depends on:** KHA-2, KHA-3

- **Description:**
  Finalize database schema for unified conversation threads. All message types (voice, email, in-app) appear chronologically with extracted metadata.

- **Acceptance Criteria:**
  - [ ] Single conversation record shows all message types chronologically
  - [ ] Message metadata includes sender, type, timestamps, extracted key data
  - [ ] API endpoint `/api/conversations/[id]` returns unified thread in correct order
  - [ ] Database migration created and tested
  - [ ] Supabase RLS policies set (venue can only see their conversations)

- **Technical Details:**
  - Update `conversation_messages` schema:
    - Add `message_type` enum: 'email', 'voice', 'in_app'
    - Add `extracted_data` JSONB: { availability_dates, price_quote, contact_name, decision_timeline, objections, tone }
    - Add `metadata` JSONB: { email_subject, voice_duration, voice_model, transcription_confidence }
    - Add `external_id` (for email: message-id, for voice: call_id)
  - Create API endpoint `/api/conversations/[id]` that:
    - Returns all messages sorted by created_at
    - Groups emails by thread (In-Reply-To + subject)
    - Shows extracted data as badges/summaries in thread view
  - Create Supabase migration with proper indexing (conversation_id, created_at, message_type)

---

## Phase 1b: Booker Workflow (Sprint 3–4, Parallel with Phase 1c)

### KHA-5: Event Creation Form & Storage
- **Status:** Backlog
- **Priority:** P1 High
- **Labels:** `booker-events`, `feature`, `p1-high`
- **Cycle:** Phase 1b
- **Estimate:** 3 days

- **Description:**
  Build event creation form for bookers. Captures event details and saves to database.

- **Acceptance Criteria:**
  - [ ] Form captures: event_type, headcount, date, budget, location, guest_list (optional CSV/manual)
  - [ ] Saves to `events` table with booker_id
  - [ ] Form validation: date must be in future, headcount > 0, budget realistic
  - [ ] Confirmation page shows event summary with shareable link
  - [ ] Mobile-responsive form
  - [ ] Error handling for invalid input

- **Technical Details:**
  - Create form component in `app/(booker)/create-event/page.tsx`
  - Form fields: event_type (dropdown), headcount (number), date (date picker), location (autocomplete), budget (currency), guest_list (paste CSV)
  - Supabase insert: `events` table (id, booker_id, event_type, headcount, budget, location, guest_list_count, status, created_at)
  - Use shadcn form components + Tailwind
  - Redirect to `/my-events/[id]` on success
  - Toast notifications for errors/success

---

### KHA-6: Venue Search via Google Maps & Yelp APIs
- **Status:** Backlog
- **Priority:** P1 High
- **Labels:** `booker-explore`, `feature`, `p1-high`
- **Cycle:** Phase 1b
- **Estimate:** 5 days

- **Description:**
  Implement venue search from Google Maps and Yelp APIs. Results cached in Supabase for fast, low-cost queries.

- **Acceptance Criteria:**
  - [ ] User searches by venue type (restaurant, hotel, wedding venue, etc.) + location
  - [ ] Results cached in Supabase `venues` table (avoid repeated API calls)
  - [ ] Venue cards show: name, rating, capacity, photos, address, price range
  - [ ] "Add to Event" button works end-to-end (adds to `event_venues`)
  - [ ] Search results paginated (20 per page)
  - [ ] Mobile-responsive card layout

- **Technical Details:**
  - Create `/api/venues/search` endpoint (POST with type, location, radius)
  - Query Google Maps API + Yelp API in parallel
  - Cache results in `venues` table with `source` (google_maps, yelp) + `source_id`
  - Return cached results if found in DB (TTL: 30 days)
  - Create UI component in `app/(booker)/explore/page.tsx`
  - Venue card component: name, rating, capacity_min/max, photo_url, address, price_per_head
  - "Add to Event" → creates `event_venues` record with status='invited'

---

### KHA-7: CSV/Sheets Import for Custom Venue Lists
- **Status:** Backlog
- **Priority:** P2 Medium
- **Labels:** `booker-explore`, `feature`, `p2-medium`
- **Cycle:** Phase 1b
- **Estimate:** 3 days

- **Description:**
  Allow bookers to import custom venue lists from CSV or Google Sheets.

- **Acceptance Criteria:**
  - [ ] User uploads CSV or pastes Google Sheets URL
  - [ ] Parses columns: name, address, email, phone, capacity_min, capacity_max, price_per_head
  - [ ] Adds venues to `venues` table + links to event via `event_venues`
  - [ ] Handles duplicates gracefully (skip if already in DB)
  - [ ] Validation: required fields present, email format valid, capacity numbers valid
  - [ ] Progress bar during import
  - [ ] Success summary: "Added 8 venues, 2 duplicates skipped"

- **Technical Details:**
  - Create `/api/venues/import` endpoint (POST with CSV data or Sheets URL)
  - Use PapaParse library for CSV parsing
  - Integrate Google Sheets API (read-only) for direct sheet imports
  - Validate required fields: name, email, phone
  - Check duplicates via: name + address match (fuzzy match or exact)
  - Bulk insert into `venues` table (source='imported')
  - Create `event_venues` records for each imported venue
  - Return import summary with created + skipped counts

---

### KHA-8: "Blast" Outreach Button & Agent Scheduling
- **Status:** Backlog
- **Priority:** P0 Critical
- **Labels:** `booker-conversations`, `feature`, `p0-critical`
- **Cycle:** Phase 1b
- **Estimate:** 6 days
- **Depends on:** KHA-1, KHA-2, KHA-3

- **Description:**
  Implement "Blast" button to trigger agent outreach (voice + email) to multiple venues. This is the core booker feature.

- **Acceptance Criteria:**
  - [ ] Booker selects subset of venues for event, clicks "Blast"
  - [ ] Modal shows: # of venues, estimated call duration, email timing options (immediate, scheduled)
  - [ ] Confirm → triggers voice agent calls (scheduled 9am-5pm daily) + emails (immediate)
  - [ ] Jobs queued in Supabase `outreach_jobs` table (status: pending, started, completed, failed)
  - [ ] Booker can view real-time job status in dashboard
  - [ ] Each outreach creates `conversation` record linked to event + venue
  - [ ] Email drafted with Claude API (personalized to venue + event type)
  - [ ] Voice call placed via 11 Labs (personalized script based on venue + event)

- **Technical Details:**
  - Create `/api/outreach/blast` endpoint (POST with event_id, venue_ids)
  - Create `outreach_jobs` table: id, event_id, status, created_at, started_at, completed_at, results_json
  - Use Bull/BullMQ to queue jobs:
    - For each venue: create voice_call job (scheduled 9am-5pm)
    - For each venue: create email job (immediate)
  - Voice script generated via Claude API prompt (context: event type, headcount, budget, location, venue name)
  - Email body generated via Claude API prompt (same context + venue contact info)
  - Create `conversation` record per venue with status='new' → 'contacted' after first outreach
  - Real-time updates via Supabase subscription in booker dashboard

---

### KHA-9: Booker Event Dashboard (`/my-events/[id]`)
- **Status:** Backlog
- **Priority:** P1 High
- **Labels:** `booker-events`, `feature`, `p1-high`
- **Cycle:** Phase 1b
- **Estimate:** 4 days
- **Depends on:** KHA-8

- **Description:**
  Living event dashboard showing all venues targeted, their response status, and proposals.

- **Acceptance Criteria:**
  - [ ] Dashboard displays all venues targeted for this event
  - [ ] Shows conversation status per venue: new, contacted, proposal_sent, confirmed, declined
  - [ ] Real-time updates when venues respond
  - [ ] Links to proposal details (from each venue)
  - [ ] Shows last_message_at timestamp for each conversation
  - [ ] Filter by status (all, contacted, has_proposal, accepted)

- **Technical Details:**
  - Create page `app/(booker)/my-events/[id]/page.tsx`
  - Query `conversations` where event_id = [id], subscribe to real-time updates
  - Display as table: Venue Name, Status, Last Message, Proposal (if exists), Actions (accept/decline)
  - Status badge colors: new (gray), contacted (blue), proposal_sent (yellow), confirmed (green), declined (red)
  - Real-time subscription to `conversations` table changes (Supabase LISTEN)
  - Link to individual conversation threads

---

### KHA-10: Proposal Comparison Table UI
- **Status:** Backlog
- **Priority:** P1 High
- **Labels:** `booker-conversations`, `feature`, `p1-high`
- **Cycle:** Phase 1b
- **Estimate:** 4 days
- **Depends on:** KHA-9

- **Description:**
  Interactive table for comparing proposals side-by-side. Sortable, filterable, with visual comparison.

- **Acceptance Criteria:**
  - [ ] Table shows: venue name, price per head, total estimate, capacity, availability, response speed
  - [ ] Sortable columns (price, response speed, rating)
  - [ ] Filterable (capacity, price range, availability date)
  - [ ] Side-by-side comparison view for 2–3 selected proposals
  - [ ] Color-coded pricing (green if under budget, red if over)
  - [ ] Shows venue rating + review count
  - [ ] Photos carousel per venue

- **Technical Details:**
  - Create component `components/booker/proposal-comparison/index.tsx`
  - Use TanStack React Table for sorting + filtering
  - Query `proposals` joined with `venues` + `conversations`
  - Calculate response_speed as hours since outreach job started
  - Sidebar comparison view for 2-3 selected rows
  - Color logic: proposal.total_estimate < event.budget → green
  - Export comparison as PDF option

---

### KHA-11: Accept Proposal & Notification Flow
- **Status:** Backlog
- **Priority:** P2 Medium
- **Labels:** `booker-conversations`, `feature`, `p2-medium`
- **Cycle:** Phase 1b
- **Estimate:** 2 days
- **Depends on:** KHA-10

- **Description:**
  One-click proposal acceptance with notification to venue and event status update.

- **Acceptance Criteria:**
  - [ ] Booker clicks "Accept" on proposal in comparison table
  - [ ] `proposals` status changes to 'accepted'
  - [ ] Venue receives notification (in-app + email: "Your proposal for [event] was accepted!")
  - [ ] Event status moves to 'confirmed'
  - [ ] Conversation status moves to 'confirmed'
  - [ ] Booker sees "Confirmed ✓" on dashboard

- **Technical Details:**
  - Create `/api/proposals/[id]/accept` endpoint (POST)
  - Update `proposals` set status='accepted', accepted_at=now
  - Update `conversations` set status='confirmed'
  - Update `events` set status='confirmed'
  - Create in-app notification for venue user
  - Send email to venue: "Your proposal for {event.event_type} on {event.date} was accepted! Next steps..."
  - Trigger KHA-20 (post-acceptance automation) to generate task timeline

---

## Phase 1c: Venue CRM + Automation (Sprint 3–4, Parallel with Phase 1b)

### KHA-12: Task Inbox UI & Core Logic
- **Status:** Backlog
- **Priority:** P0 Critical
- **Labels:** `venue-inbox`, `feature`, `p0-critical`
- **Cycle:** Phase 1c
- **Estimate:** 5 days

- **Description:**
  Primary venue view showing all pending tasks across all leads in priority order.

- **Acceptance Criteria:**
  - [ ] Dashboard displays all pending tasks: calls to make, proposals to send, follow-ups needed
  - [ ] Tasks sorted by: lead_score (hot first), due_date, event_date
  - [ ] Each task shows: action type, venue/booker name, event type, deadline
  - [ ] Click task → opens conversation thread (with email/voice history)
  - [ ] Mark task complete → removes from inbox, closes related conversation task
  - [ ] Real-time updates (new incoming emails/calls show as new tasks)
  - [ ] Filter/search by venue, event type, priority

- **Technical Details:**
  - Create page `app/(dashboard)/[slug]/task-inbox/page.tsx`
  - Tasks are derived from:
    - Open conversations with last_message_at > 48h ago (follow-up task)
    - Conversations in 'new' state (call/email task)
    - Proposals in 'draft' state (send proposal task)
    - Manual tasks created by venue user
  - Query logic: JOIN conversations + proposals + tasks, calculate lead_score
  - Task schema: id, conversation_id, proposal_id, action_type, priority, due_at, completed_at
  - Real-time subscription to: conversations, proposals, tasks tables
  - UI: card-based list view with swipe-to-complete on mobile

---

### KHA-13: Enhanced Kanban Pipeline with Lead Temperature Coloring
- **Status:** Backlog
- **Priority:** P1 High
- **Labels:** `venue-pipeline`, `feature`, `p1-high`
- **Cycle:** Phase 1c
- **Estimate:** 3 days
- **Depends on:** KHA-16 (lead scoring)

- **Description:**
  Kanban board showing leads by pipeline stage, color-coded by temperature (hot/warm/cold).

- **Acceptance Criteria:**
  - [ ] 5 columns: New Lead, Contacted, Proposal Sent, Confirmed, Declined
  - [ ] Cards color-coded: Hot (🔴 red), Warm (🟡 yellow), Cold (🔵 blue) based on lead_score
  - [ ] Lead score badge visible on each card
  - [ ] Drag card to new column → updates conversation status
  - [ ] Double-click card → open full conversation thread
  - [ ] Real-time sync (other users see updates immediately)
  - [ ] Filter by event type or booker

- **Technical Details:**
  - Create component `components/venue/kanban/index.tsx`
  - Use React Beautiful Dnd (or dnd-kit) for drag-drop
  - Columns mapped from `conversations.status` enum: new, contacted, proposal_sent, confirmed, declined
  - Card color: if lead_score >= 80 then 'red', >= 50 then 'yellow', else 'blue'
  - On drag: update `conversations.status`, trigger KHA-17 (nudge logic recalculation)
  - Real-time subscription to `conversations` table

---

### KHA-14: Calendar View (Manual Event Blocking)
- **Status:** Backlog
- **Priority:** P2 Medium
- **Labels:** `venue-calendar`, `feature`, `p2-medium`
- **Cycle:** Phase 1c
- **Estimate:** 3 days

- **Description:**
  Calendar showing confirmed/pending events. Venue can manually block unavailable dates.

- **Acceptance Criteria:**
  - [ ] Month/week view of all confirmed events
  - [ ] Events show: booker name, event type, headcount, date/time
  - [ ] Click date → modal to add unavailability block (no color/smart logic)
  - [ ] Blocks marked as "Unavailable" (gray) and visible to bookers on proposal review
  - [ ] Delete block option
  - [ ] Color by event type (weddings: pink, corporate: blue, etc.)

- **Technical Details:**
  - Create page `app/(dashboard)/[slug]/calendar/page.tsx`
  - Use react-big-calendar or similar library
  - Query `events` joined with `conversations` where status='confirmed'
  - Create `venue_unavailability` table: id, venue_id, start_date, end_date, reason, created_at
  - Add/delete unavailability via modal
  - Events show in calendar with click-to-details
  - Color by event_type: extract from `events.event_type`

---

### KHA-15: Email Parsing Auto-Logging (Venue-Side)
- **Status:** Backlog
- **Priority:** P1 High
- **Labels:** `venue-inbox`, `feature`, `p1-high`
- **Cycle:** Phase 1c
- **Estimate:** 2 days
- **Depends on:** KHA-3, KHA-12

- **Description:**
  Venue views parsed email data in task inbox (leverages KHA-3 infrastructure on venue side).

- **Acceptance Criteria:**
  - [ ] Inbound venue emails auto-logged to conversation thread (via KHA-3)
  - [ ] Venue sees extracted data as structured fields: Availability, Price Quote, Contact, Decision Timeline
  - [ ] Extracted data shown prominently in task view (not raw email)
  - [ ] Email threading correct (multi-part conversations grouped)
  - [ ] Attachments linked (PDFs, images stored in Supabase)

- **Technical Details:**
  - Leverage KHA-3 infrastructure (email parsing + extraction already done)
  - On `/task-inbox` page: show extracted_data from `conversation_messages` where message_type='email'
  - Extract data displayed as:
    - "📅 Available: May 15–30"
    - "💰 Price: £80–100/head"
    - "📞 Contact: John Smith"
    - "⏰ Decision: By April 30"
  - UI components for each extracted field type
  - Attachments: link to Supabase public URL (if image) or download link (if PDF)

---

### KHA-16: Lead Scoring & Hot/Warm/Cold Qualification
- **Status:** Backlog
- **Priority:** P1 High
- **Labels:** `venue-inbox`, `feature`, `p1-high`
- **Cycle:** Phase 1c
- **Estimate:** 4 days
- **Depends on:** KHA-3, KHA-12

- **Description:**
  AI-driven lead scoring. Hot (80+), Warm (50–79), Cold (<50) based on event value, responsiveness, decision timeline.

- **Acceptance Criteria:**
  - [ ] Score calculated for each conversation: event_value (30%) + responsiveness (30%) + decision_timeline (20%) + event_type (20%)
  - [ ] event_value: headcount * budget per head (higher = hotter)
  - [ ] responsiveness: hours since outreach / avg response time (faster = hotter)
  - [ ] decision_timeline: days until decision deadline (sooner = hotter)
  - [ ] event_type weights: weddings higher than corporate (configurable per venue)
  - [ ] Score recalculated when new message added
  - [ ] Badges visible in task inbox + kanban
  - [ ] Venues can customize weights in profile settings

- **Technical Details:**
  - Create `/api/leads/score` endpoint
  - Score formula:
    ```
    event_value_score = (headcount * price_per_head) / venue_capacity → 0-30 points
    responsiveness_score = (avg_response_time - actual_response_time) / avg_response_time → 0-30 points
    decision_timeline_score = days_until_deadline / 30 → 0-20 points
    event_type_bonus: weddings +5, corporate +2, etc.
    TOTAL = sum(above) capped at 100
    ```
  - Use Claude API to extract decision_timeline from email/call transcription (NLP)
  - Store score in `conversations.lead_score` (recalculate on new message)
  - Update `venue_profiles.lead_scoring_weights` for customization
  - Scheduled job (cron) to recalculate scores daily

---

### KHA-17: Proactive Follow-Up Nudges
- **Status:** Backlog
- **Priority:** P2 Medium
- **Labels:** `venue-inbox`, `feature`, `p2-medium`
- **Cycle:** Phase 1c
- **Estimate:** 3 days
- **Depends on:** KHA-16

- **Description:**
  Smart alerts when leads are going cold. Venue gets AI-drafted follow-up message.

- **Acceptance Criteria:**
  - [ ] Alert triggered if lead hasn't responded in 48+ hours (configurable)
  - [ ] Alert shown in task inbox: "🥶 Cold: Follow up with [booker] or lose this lead"
  - [ ] AI-suggested follow-up message shown (Claude-drafted based on conversation context)
  - [ ] One-click send (pre-composed) or edit before sending
  - [ ] Sent message logged to conversation thread
  - [ ] Alert disappears once follow-up sent or deal closes

- **Technical Details:**
  - Create scheduled job (hourly cron) that checks `conversations.last_message_at < now - 48h`
  - For cold leads: use Claude API to draft follow-up message based on:
    - Event type, date, headcount
    - Previous responses + objections
    - Lead temperature
  - Store suggested message in `conversations.suggested_followup_message`
  - UI: show alert card with drafted message + one-click send button
  - On send: create `conversation_messages` record + update last_message_at

---

### KHA-18: AI-Suggested Responses in Conversation Thread
- **Status:** Backlog
- **Priority:** P2 Medium
- **Labels:** `venue-conversations`, `feature`, `p2-medium`
- **Cycle:** Phase 1c
- **Estimate:** 4 days
- **Depends on:** KHA-12

- **Description:**
  Venue opens conversation → sees 3–5 AI-suggested responses to choose from or edit.

- **Acceptance Criteria:**
  - [ ] Conversation thread shows "AI Suggestions" button
  - [ ] Click → shows 3–5 templated responses based on conversation context
  - [ ] Suggestions include: availability confirmation, pricing question response, objection handling
  - [ ] Venue can edit + send one-click, or ignore and reply manually
  - [ ] Suggestions improve over time (store which ones were sent, track booker reactions)
  - [ ] Venue can turn suggestions off globally

- **Technical Details:**
  - Create `/api/conversations/[id]/suggest-responses` endpoint
  - Use Claude API with prompt template:
    ```
    Context: event_type, headcount, budget, date
    Recent messages: [last 3 messages from thread]
    Venue profile: {venue.name, services, pricing}
    Suggest 5 professional responses to the last message. Format as JSON.
    ```
  - Call endpoint when venue opens conversation thread
  - Cache suggestions in `conversation_suggestions` table (id, conversation_id, suggestions_json, created_at)
  - UI: "💡 AI Suggestions" button → modal with 5 options
  - On send: track which suggestion was used (for model improvement)

---

### KHA-19: Docusign/Ironclad Contract Generation Integration
- **Status:** Backlog
- **Priority:** P1 High
- **Labels:** `venue-documents`, `feature`, `p1-high`
- **Cycle:** Phase 1c
- **Estimate:** 5 days

- **Description:**
  One-click contract generation and esignature via Docusign or Ironclad.

- **Acceptance Criteria:**
  - [ ] "Generate Contract" button in conversation thread
  - [ ] Auto-populates template: venue name, booker name, event date, price, capacity, services selected
  - [ ] Generates Docusign template (or Ironclad doc)
  - [ ] Both parties get signing URL (booker + venue contact emails)
  - [ ] Contract status tracked: draft, sent, signed, completed
  - [ ] Signed contract linked to proposal + conversation

- **Technical Details:**
  - Create `/api/contracts/generate` endpoint
  - Integrate Docusign API (or Ironclad API):
    - Create template with fields: {VENUE_NAME}, {BOOKER_NAME}, {EVENT_DATE}, {PRICE}, {CAPACITY}, {SERVICES}
    - Create envelope with signing order: venue first, then booker
    - Send envelope + track status
  - Store in `contracts` table: id, proposal_id, docusign_envelope_id, status, signed_at
  - UI button in conversation thread
  - Email notifications when party needs to sign

---

### KHA-20: Post-Acceptance Automation (Task Timeline)
- **Status:** Backlog
- **Priority:** P2 Medium
- **Labels:** `venue-documents`, `feature`, `p2-medium`
- **Cycle:** Phase 1c
- **Estimate:** 4 days
- **Depends on:** KHA-11 (proposal acceptance)

- **Description:**
  Auto-generate task timeline after proposal acceptance (menu finalization, headcount collection, setup guide).

- **Acceptance Criteria:**
  - [ ] Once proposal accepted, generate milestones:
    - T-4 weeks: "Collect menu finalization from [booker]"
    - T-2 weeks: "Confirm headcount with [booker]"
    - T-1 week: "Send setup + parking guide to [booker]"
  - [ ] Tasks auto-created in venue's task inbox
  - [ ] Venue can view/edit timeline in event details
  - [ ] Reminders sent via email 3 days before each milestone
  - [ ] Venue can customize timeline per event type

- **Technical Details:**
  - Trigger on proposal.status = 'accepted' (via webhook or function)
  - Create `event_tasks` table: id, event_id, type, due_date, description, reminder_sent_at
  - Timeline defaults by event_type:
    - Weddings: T-4w menu, T-2w headcount, T-1w setup guide, T-5d payment, T-1d final walkthrough
    - Corporate: T-3w agenda, T-1w headcount, T-3d slides + AV, T-1d parking + wifi
    - Dinners: T-2w menu, T-1w headcount, T-3d dietary requirements
  - Create UI to view + edit timeline
  - Scheduled job to send reminder emails (cron: daily, 3 days before due_date)

---

### KHA-21: Venue Profile & Settings
- **Status:** Backlog
- **Priority:** P1 High
- **Labels:** `venue-profile`, `feature`, `p1-high`
- **Cycle:** Phase 1c
- **Estimate:** 3 days

- **Description:**
  Venue settings page: profile info, email automation config, lead scoring weights, API integrations.

- **Acceptance Criteria:**
  - [ ] Venue can update: name, address, phone, email, capacity, pricing
  - [ ] Configure email automation: parsing enabled/disabled, auto-response templates
  - [ ] Customize lead scoring weights (event_value, responsiveness, decision_timeline, event_type)
  - [ ] View + revoke API integrations (Docusign, Ironclad, etc.)
  - [ ] Change password
  - [ ] Billing info (placeholder for Phase 2)

- **Technical Details:**
  - Create page `app/(dashboard)/[slug]/profile/page.tsx`
  - CRUD for `venue_profiles` table
  - UI sections:
    - Basic Info (name, address, capacity, phone, email)
    - Email Automation (toggle parsing, template editor for auto-responses)
    - Lead Scoring Weights (sliders for 4 factors, sum = 100)
    - Connected Apps (show Docusign/Ironclad status, revoke button)
    - Account (password change, logout)
  - Form validation + success toast

---

### KHA-22: Basic Profitability Analytics
- **Status:** Backlog
- **Priority:** P2 Medium
- **Labels:** `venue-analytics`, `feature`, `p2-medium`
- **Cycle:** Phase 1c
- **Estimate:** 4 days

- **Description:**
  Analytics dashboard showing revenue, margin, win/loss, and conversion metrics.

- **Acceptance Criteria:**
  - [ ] Dashboard shows: # proposals sent, # accepted, revenue (sum of total_estimate), margin (if cost data provided)
  - [ ] Breakdown by event type (weddings, corporate, dinners, etc.)
  - [ ] Win/loss analysis: why deals closed vs. declined (booker feedback or inferred)
  - [ ] Month-over-month comparison (this month vs. last month)
  - [ ] CSV export of data
  - [ ] Filter by date range

- **Technical Details:**
  - Create page `app/(dashboard)/[slug]/analytics/page.tsx`
  - Pre-aggregate metrics in `analytics` table (materialized view or scheduled job):
    - schema: venue_id, month (YYYY-MM), proposals_sent, proposals_accepted, revenue, margin, event_type_breakdown
  - Query logic:
    - proposals_sent = count(*) from proposals where created_at in month
    - proposals_accepted = count(*) from proposals where status='accepted' AND created_at in month
    - revenue = sum(total_estimate) from proposals where status='accepted' AND created_at in month
    - margin = revenue - cost (if cost data available, else N/A)
  - Win/loss: query decline_reasons if available, else show "No reason provided"
  - Chart library: Recharts or Chart.js
  - CSV export: download month's data as file

---

## Phase 2: Advanced Features (Future)

### KHA-23: SMS Automation & Confirmations
- **Priority:** P3 Backlog
- **Estimate:** Phase 2

### KHA-24: Calendar Sync (Google Calendar / Outlook)
- **Priority:** P3 Backlog
- **Estimate:** Phase 2

### KHA-25: Multi-Venue Coordination
- **Priority:** P3 Backlog
- **Estimate:** Phase 2

### KHA-26: Payment Processing Integration
- **Priority:** P3 Backlog
- **Estimate:** Phase 2

### KHA-27: External CRM Integrations (HubSpot, Pipedrive)
- **Priority:** P3 Backlog
- **Estimate:** Phase 2

---

## Import Instructions

1. **Create all labels** in Linear project settings first
2. **Create cycles** for each phase (Phase 1a, Phase 1b, Phase 1c, Phase 2)
3. **Create tickets** using this document (KHA-1 to KHA-27)
   - Copy title + description + acceptance criteria
   - Assign appropriate labels, priority, cycle, estimate
4. **Set up dependencies** in Linear (KHA-1 blocks KHA-2, etc.)
5. **Start Phase 1a** immediately (infrastructure is critical path)
6. **Parallelize Phase 1b + 1c** once Phase 1a is halfway done

---

**Last Updated:** 2026-04-16  
**Status:** Ready for Linear creation
