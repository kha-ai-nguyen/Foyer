# Fete – Product Requirements Document

_Last updated: 2026-04-10_

---

## 1. TL;DR

Fete is a venue event CRM and AI-powered marketplace for private events in London. Venues can use Fete as a standalone event management tool (like SevenRooms) or list on the Fete marketplace to attract bookers (like OpenTable). Neither side requires the other — but it works better when both are on the platform.

Felicity, Fete's AI agent, handles the first response to every enquiry and moves leads toward proposals. She's not a Phase 3 luxury — she's on the critical path from day one.

The central problem Fete solves that no one else has: the bidirectional data gap between reservation systems and event CRMs. Tripleseat pushes data to OpenTable/SevenRooms but guest profiles, availability, and proposal history don't flow back. Fete unifies the full event lifecycle — from first enquiry to accepted proposal — in one place, across all verticals (restaurants, hotels, wedding venues, gallery spaces, private members clubs). **Space is space.**

---

## 2. Product Vision & Strategy

### What Fete is

A hybrid event CRM + marketplace:

- **CRM layer** (venue-side): Lead pipeline, proposal creation, Felicity AI responses, availability calendar, payment tracking, BEO generation. Venues use this whether or not they list on the marketplace.
- **Marketplace layer** (booker-side): Searchable directory of spaces with verified pricing, availability indicators, and structured enquiry flows. Bookers use this to find venues they might not discover otherwise.
- **The Felicity layer**: AI agent that handles the first 3–5 messages on every enquiry — qualifying leads, answering standard questions, and driving toward a proposal — using the venue's structured data and knowledge base.

### Architecture principle

Either side can use either side's modules without being required to be on the platform. A venue can embed Fete's enquiry form on their own website (like SevenRooms). A booker can enquire to any venue without an account (like OpenTable). But when both sides are on the platform, Felicity has richer context and the data gap closes.

### Who it's for

Cross-vertical from day one. The product intuition: **space is space**. A 60-person seated dinner works the same in a restaurant private dining room, a hotel ballroom, a gallery, or a members club. Tripleseat built for restaurants and hotels. Perfect Venue built for restaurants. Fete doesn't pick a vertical — it picks a problem (the event lifecycle) and solves it everywhere.

### The unsolved industry problem we crack

Tripleseat is the market leader (19,000+ venues, $10B+ in event leads). Its known gap: data doesn't flow bidirectionally between Tripleseat and OpenTable/SevenRooms. A VIP regular in SevenRooms is a blank slate in Tripleseat. Fete owns both sides and solves this — guest profile continuity, availability sync, and proposal history all live in one place.

### Competitive context

- **Tripleseat**: Market leader for restaurants/hotels. Full workflow but no AI, steep pricing ($149–$500/mo), and the data gap problem.
- **Perfect Venue**: Simpler UX, free plan, just launched AI responses. Primary challenger in small restaurant market.
- **Momentus Technologies**: Enterprise (stadiums, convention centres). Not a threat in our target market.
- **Hostie AI**: Middleware layer integrating 6+ platforms. Signals that AI integration is now table stakes.
- **New entrants** (last 6 weeks): Wiktis, Eventrise, Occuro, Cenvi, Vendoir, Party Central, Swoogo, Celevend. Market is heating fast.

### Fete's moat

Felicity is the moat. A knowledge-base-backed AI agent that handles first responses, using unified guest + proposal data that no two-system architecture can match. The marketplace is the distribution. The CRM is the retention.

---

## 3. Goals

### Business goals

- Prove demand via sustained booker enquiry and proposal activity pre-revenue
- Onboard 20+ venues in London by end of Phase 1
- Show Felicity saves venue managers meaningful time per week (target: 2+ hours)
- Establish cross-vertical positioning (not just restaurants)

### User goals

**Booker**: Find the right space fast, get an instant first response from Felicity, receive a clear proposal, and accept it without chasing anyone.

**Venue manager**: Receive qualified, structured leads, have Felicity handle the repetitive Q&A, send proposals from a template builder, and see their full pipeline in one view.

### Non-goals (Phase 1)

- No Stripe / payment processing (payment terms visible, no charge)
- No external calendar sync (Google Calendar / iCal) — venue-managed date blocking only
- No public reviews or ratings
- No BEO generation (Phase 2)
- No VAT invoicing (Phase 2)
- No seating plan canvas (Phase 2)
- No OpenTable / SevenRooms integration (Phase 3)

---

## 4. User Stories

### Booker (28–45, London-based event organiser, 20–150 guests)

- I want to search and filter spaces by capacity, budget, date, and area so only relevant results show
- I want to send an enquiry in one click and hear back within seconds
- I want a unified view of all my outreach so I know what's pending, what has proposals, and what's confirmed
- I want to view a proposal from a venue and accept it in the same place
- _Phase 2_: I want to collect dietary info from guests via a structured form so I don't have to manually ask

### Venue manager (restaurant, hotel, gallery, members club)

- I want a Kanban pipeline showing all my inbound leads by status
- I want Felicity to reply to new enquiries automatically so I'm not answering emails at 11pm
- I want to create and send proposals from a template builder
- I want to see when a booker has accepted a proposal
- I want to block off dates on a simple calendar to prevent double-booking
- _Phase 2_: I want Felicity to answer long-tail questions using my venue knowledge base
- _Phase 3_: I want Stripe payment collection so bookers can pay the deposit without an invoice email

---

## 5. Phase 1 — Event CRM + Felicity (Build Now)

### Build order (RICE-ordered)

1. **Venue event dashboard** — Kanban pipeline (New Lead → Contacted → Proposal Sent → Confirmed → Declined) wired to real conversation data. Score: 540.
2. **Proposal creation** — Wire existing proposal builder to conversations. Venue can send a proposal from within the thread. Score: 255.
3. **Booker proposal view + accept** — Booker views the proposal sent and accepts it. Pipeline updates to Confirmed. Score: 510.
4. **Living event summary** — Booker's unified view showing all conversations for their event, each with status badge and last message preview. Score: 612.
5. **Felicity agentic messaging** — Claude API auto-responds to every new enquiry using venue + space data. Shows in conversation thread with distinct Felicity styling. Score: 672.
6. **Availability calendar** — Venue-managed date blocking. No external sync yet. Score: 150 (moved to Phase 1 from Later due to operational necessity).

### Functional requirements

**A. Booker-facing**

- Searchable directory (`/explore`) with filters: capacity, budget, event type, neighbourhood
- Create-event flow (`/create-event`) capturing: event type, headcount, budget, dates, postcode
- Results page matching spaces to event requirements
- One-click enquiry to any space from results or space card
- Felicity auto-reply on every enquiry (within seconds, using Claude API)
- Living event summary (`/events/[id]`) showing all outreach with status badges
- Conversation view with full message thread
- Proposal view (`/events/[id]/proposals/[id]`) with Accept CTA

**B. Venue-facing**

- Kanban pipeline (`/dashboard/[slug]/pipeline`) with real data, 5 stages
- Conversation thread view with ability to send messages
- Proposal builder (existing) wired to conversation — "Send proposal" button
- Availability calendar with date blocking
- Space management (edit name, capacity, price, photos)
- Venue profile editor

**C. Data & admin**

- `conversations.status` column: `incoming | awaiting_response | in_negotiation | confirmed | declined`
- `conversations.last_message_at` column for pipeline sorting
- Proposals table: `id, conversation_id, status (draft/sent/accepted), price_per_head, total_estimate, created_at`

### Technical stack

- **Frontend**: Next.js 16 App Router, Tailwind 4, shadcn/ui, Framer Motion
- **DB**: Supabase PostgreSQL
- **AI**: Anthropic Claude API (`claude-haiku-4-5-20251001` for Felicity responses — fast, cheap)
- **Hosting**: Vercel

---

## 6. Phase 2 — Intelligence Layer + Quick Wins (Build Next)

1. **Venue knowledge base** (490): Free-text field in venue profile. Claude API summarises at save time into structured snippets. Felicity queries this for long-tail questions (menus, accessibility, parking, AV). Without it, Felicity can only answer structured questions. With it, she handles the long-tail queries that kill conversions. Build as a two-sprint unit with Felicity: agent first, knowledge base immediately after.

2. **AI search for booker**: Natural language search — "somewhere in East London for 60 people, under £80/head, outdoor space, birthday." Felicity interprets intent and returns ranked matching spaces. Differentiates from every Tripleseat/Perfect Venue filter-chip experience. Requires knowledge base to be live for best results.

3. **Guest dietary collection** (448): Structured dietary field in enquiry form. Surfaced clearly in venue pipeline and conversation. Saves a round-trip message for every booking.

4. **Proposal templates**: Venue saves standard packages (e.g. "Seated dinner 40–60, £75/head, 3-course menu, AV included") and recalls in one click. Builds on existing ProposalBuilder — adds a saved templates layer.

5. **Venue side-by-side comparison**: Booker shortlists 2–3 venues and views them in a comparison grid — price, capacity, deposit, photos, event types. Data already structured; lightweight to build.

6. **Calendar sync**: Google Calendar / iCal two-way sync for venues. Keeps availability accurate without manual date blocking.

7. **VAT-compliant invoicing** (204): Auto-generate VAT invoice from accepted proposal. Venue downloads PDF. Unblocks revenue for venues who need it.

8. **BEO generation**: Auto-generate banquet event order from confirmed proposal data. Separate FOH, kitchen, and client versions.

9. **Seating plan** (lightweight): Canvas where venues and bookers collaborate on room layout. Shapes only — squares (tables), circles (rounds), rectangles (long tables). No CAD. Just enough to agree on setup before the event.

---

## 7. Phase 3 — Payments, Integrations, Monetisation (Build Later)

1. **Stripe deposit collection**: Payment terms → Stripe checkout link embedded in proposal. Venue receives deposit confirmation.

2. **OpenTable / SevenRooms integration**: Push confirmed event blocks to reservation system. Eventually pull guest profiles to solve the data gap problem.

3. **External calendar sync**: Google Calendar / iCal feed for venues who want two-way sync.

4. **Reporting and analytics**: Pipeline conversion rates, average time-to-response, Felicity message volume, revenue tracking.

5. **Per-message Felicity billing**: Venues pay per automated Felicity message. Tracked in platform.

6. **Felicity PDF extraction** for onboarding: Auto-populate venue listing from uploaded brochure PDF.

---

## 8. Defer

- **Instant booking**: Removes human judgment from high-value, multi-week sales cycles. Wrong for this market.
- **Menu management**: Low-value admin feature. Not what venues need from software.

---

## 9. Success Metrics

| Metric | Phase | Target |
|--------|-------|--------|
| Live venue listings | 1 | 20+ at soft launch |
| Enquiry → Felicity response time | 1 | < 10 seconds |
| Enquiry → proposal rate | 1 | 30%+ |
| Proposal → accepted rate | 1 | 20%+ |
| Felicity messages per venue/week | 1 | 5+ |
| Booker return rate (30-day) | 1–2 | 30%+ |
| Venue NPS | 1–3 | 50+ |
| Automated message volume | 3 | Revenue-contributing |

---

## 10. Design System (Locked)

### Colour Palette (tailwind.config.js — do not change)

- **base**: #E0C5DA — warm mauve, page background
- **base-deep**: #C9A4C3 — deeper mauve for hover states
- **card**: #FFFFFF — card and form backgrounds
- **primary**: #CDEA2D — acid yellow-green, primary CTA
- **secondary**: #FF2D9B — hot pink, hover and accent
- **dark**: #1A1A1A — borders, text, UI strokes
- **text-primary**: #1A1A1A
- **text-muted**: #6B5068

### Typography

- **Display**: Syne, 700/800, uppercase, tight tracking — all headings, venue names, CTAs
- **Body**: Inter, 400/500/600 — descriptions, labels, inputs

### Core design language

- 2px dark (#1A1A1A) borders on all cards, buttons, inputs, containers — defining feature of the aesthetic
- rounded-md corners throughout
- Generous whitespace; cards breathe
- Photo-forward: images dominate venue cards (60% of card height minimum)
- Warm, crafty, NOT SaaS — references: Fresha, Treatwell, Are.na
- Uppercase tracking on labels, filter chips, event type tags, CTAs

---

## 11. Narrative

Sophie is planning an alumni dinner for 60 in Shoreditch. She lands on Fete, filters by capacity and budget, and shortlists three spaces. She clicks enquire on Morchella's Private Dining Room. Felicity replies in under 10 seconds: "Hi Sophie — yes, we're available on 15 May. The Private Dining Room seats up to 30; for 60 guests I'd suggest the Garden Room at £75/head. 25% deposit to confirm. Want me to put together a formal proposal?"

Sophie says yes. The venue manager sees the conversation in their pipeline — already in "Awaiting Response" — opens it, clicks "Send proposal" on the pre-populated builder, and sends a PDF in two minutes. Sophie views it in her living event summary, sees the price breakdown, and clicks Accept. The card moves to Confirmed in the pipeline.

On the venue side: the manager didn't write a cold response, didn't manually build a quote, and didn't chase a booker. Felicity did the first contact. The builder did the proposal. The pipeline did the tracking. That's the Fete promise.

---

_This PRD is cross-phase and architecturally aware. Phase 1 is build-ready. Later phases are scoped for extensibility._
