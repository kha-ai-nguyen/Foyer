# Fete – Multi-Phase Product Requirements Document

---

## 1\. TL;DR

Fete is a warm, visual-first marketplace and directory for large-scale private event venues in London, powered by the AI agent Felicity. Across three phases, Fete evolves from a structured directory with automated PDF-to-listing extraction (Phase 1), to a verified marketplace with live venue availability and price transparency (Phase 2), to an automated messaging platform where Felicity handles the first contact between bookers and venues (Phase 3). The platform replaces manual PDF/email back-and-forth with structured listings, visual search, and AI-powered workflows, setting the stage for expansion beyond London.

---

## 2\. Product Vision & Strategy

## 2\. Product Vision & Strategy

Fete aims to reimagine private event booking for groups of 20–150 by eliminating manual, slow, and error-prone PDF/email loops. The core product vision is a visual, structured marketplace unburdened by sterile SaaS design, centered on booker needs and frictionless venue onboarding.

Phased Build Approach:

## ategy

Fete aims to reimagine private event booking for groups of 20–150 by eliminating manual, slow, and error-prone PDF/email loops. The core product vision is a visual, structured marketplace unburdened by sterile SaaS design, centered on booker needs and frictionless venue onboarding.

Phased Build Approach:

* Phase 1: A high-quality, searchable directory of London venues, combining founder-seeded listings and self-serve onboarding with automated PDF-to-listing extraction. The MVP focuses on easy discovery, clear comparison, and fast enquiries, optimized for both AI-powered and human discovery (GEO/SEO).
* Phase 2: Adds live availability indicators, a verified pricing model based on historical proposals, and dashboards for both sides. The architecture shifts from static listings to transactional proposals, with calendars and pricing history tightly integrated.
* Phase 3: Evolves into a messaging-first product where Felicity—now an LLM agent—automatically handles the first three to five messages between booker and venue, capturing requirements, qualifying leads, and driving venue efficiency. Monetization shifts to per-message billing and subscription analytics.

## Design System & Visual Language

### Colour Palette (from tailwind.config.js — locked)

* **base**: #E0C5DA — warm mauve, page background
* **base-deep**: #C9A4C3 — deeper mauve for hover states / subtle depth
* **card**: #FFFFFF — card and form backgrounds
* **primary**: #CDEA2D — acid yellow-green, primary CTA and active state highlight
* **secondary**: #FF2D9B — hot pink, hover state and accent
* **dark**: #1A1A1A — borders, text, UI strokes
* **text-primary**: #1A1A1A
* **text-muted**: #6B5068 — secondary labels, filter headings, supporting copy

### Typography

* **Display**: Syne, weight 700/800, uppercase, tight tracking — used for all headings, venue names, CTAs, counts
* **Body**: Inter, weight 400/500/600 — used for descriptions, labels, form inputs, supporting text
* Font imports are already in index.css — do not re-import or modify

### Core Design Language

* 2px dark (#1A1A1A) borders on all cards, buttons, inputs, and containers — this is a defining feature of the aesthetic; never use lighter borders
* rounded-md corners throughout
* generous whitespace; cards breathe
* photo-forward: images always take the dominant space on venue cards (60% of card height minimum)
* warm, crafty, NOT SaaS — references: Fresha, Treatwell, Are.na
* Uppercase tracking on labels, filter chips, event type tags, and CTAs

### Venue Card Component (implementation notes)

Component: `components/VenueCard.tsx` (already present in codebase). Build-ready behaviour and required conventions:

* 3D flip mechanic on hover (desktop): front shows venue photo (60% height) + event type strip (dark bg, primary text) + venue name + neighbourhood. Back shows capacity, price range, description, and "View Venue →" CTA button.
* On mobile: no hover state — on tap the card flips and shows the back face. Tap outside or on a second card flips back. Replace CSS hover with a React useState toggle per card: `const [flipped, setFlipped] = useState(false)` and `onClick={() => setFlipped(!flipped)}` on the card wrapper. Ensure only one card is flipped at a time (lift state to parent or use a selectedCard ID pattern).
* The "View Venue →" CTA on the back face uses: `bg-primary border-2 border-dark text-dark font-bold uppercase tracking-widest py-3.5 rounded-md hover:bg-secondary hover:text-white`

### FilterBar Component (implementation notes)

Component: `components/FilterBar.tsx` (already present). Styling and behaviour conventions:

* Event type chips: pill buttons, `border-2 border-dark`; selected state = `bg-primary text-dark`, unselected = `bg-white text-dark`; hover = `bg-secondary text-white border-secondary`.
* Capacity and Price filters: native `<select>` elements styled with `bg-white border-2 border-dark`; focus state = `bg-primary`; use a custom SVG chevron.
* Clear filters: `text-secondary` hover `text-dark`, uppercase, tracking-widest.

### Implementation notes

All components must adhere to the locked tailwind.config.js colour tokens and font families. Use 2px dark borders and rounded-md consistently. Keep the design warm and tactile; avoid neutral SaaS grey palettes.

### Hero / Marketing (Framer)

The marketing homepage (Framer-native) uses a keyhole/peephole animation as the hero's primary surprise-and-delight interaction. Implementation notes (Framer component only):

* The page opens with a dark overlay and a keyhole-shaped cutout in the centre.
* As the visitor moves their cursor (desktop) or scrolls (mobile), the keyhole moves to follow — revealing a looping reel of venue photography underneath.
* Desktop: keyhole tracks mouse position using Framer cursor-following motion primitives.
* Mobile: keyhole moves vertically in response to scroll position.
* Keyhole shape is an SVG mask: circular top + narrow rectangular stem (classic keyhole silhouette).
* Behind the mask: a slow-panning or cross-fading carousel of high-quality venue photos.
* Above the keyhole: headline in Syne bold, white, uppercase — e.g. "Can you keep a secret?"
* Below/after the interaction: CTA transitions into the directory (links to the Next.js app).
* This is a Framer-native component — do not attempt to replicate in Next.js. Reference: the physical peephole installation where visitors look through a circular cutout to see inside; translate that interaction to the web.

### Felicity Upload Widget — Branded Component

Design and interaction spec for onboarding PDF upload widget. Implement as `components/FelicityUpload.tsx` (standalone React component):

* Visual design inspired by the Felicity mark (bold, graphic, angular) — pink / yellow-green / black palette consistent with primary/secondary colours.
* Widget must feel branded and native: 2px dark border, rounded-md, Syne for headings/labels where appropriate.
* Accepted formats: PDF only.
* Widget states:
  * **Idle**: displays Felicity avatar/mark + label "Drop your events brochure here, or click to upload" + accepted formats note.
  * **Drag-over**: border animates to secondary (#FF2D9B), background shifts to base-deep (#C9A4C3), label updates to "Drop it!".
  * **Processing**: Felicity avatar animates (subtle pulse/spin), label reads "Felicity is reading your brochure…" with an indeterminate progress indicator.
  * **Success**: primary (#CDEA2D) fill, label reads "Done! Here's what Felicity found:" and transitions to extracted listing preview.
  * **Error**: label reads "Felicity couldn't read that PDF — try another file or fill in manually" with manual entry fallback CTA.

Use existing design tokens and 2px dark borders; present extracted preview in the same card system used elsewhere.

### Notes

All design system details above are build-ready and reference the locked tailwind config and existing utility classes in index.css. Provide copy and token names exactly as specified when implementing components.

## 3\. Goals

### Business Goals

* Prove demand via sustained booker search and enquiry activity pre-revenue.
* Validate "PDF-to-listing" extraction as a viable onboarding wedge for venues.
* Build structured, AI-friendly listing data to drive discovery via emerging GEO/AI-powered search channels.
* Lay groundwork for programmatic expansion to further geographies, verticals, and creative suppliers.

### User Goals

* Give bookers maximum confidence and minimal friction in finding, comparing, and enquiring to the best-fit venues.
* Make event venue onboarding frictionless—just upload a PDF, let Felicity do the work, then confirm.
* Help venues receive highly qualified, structured leads with minimal manual effort, reducing wasted time and miscommunication.
* Transition the market from unstructured PDFs/emails into a transparent, sortable, visual platform.

### Non-Goals

* No self-managed payment or proposal acceptance flows in early phases (third-party widgets only).
* No public reviews or rating features.
* No bookings, contracts, or post-proposal flows until the core marketplace mechanics are validated.

---

## 4\. User Stories

### Booker (28–45, London-based organiser for 20–150 person events)

* As a booker, I want to search and filter venues instantly by location, budget, and capacity so only truly relevant spaces appear.
* As a booker, I want venues to display real, comparable details—photos, price-per-head, description—so I can shortlist confidently.
* As a booker, I want to send a structured enquiry in seconds and get clear, instant confirmation, so the process feels professional.
* *PHASE 2+*: As a booker, I want to see live availability and receive visual proposal carousels so I can plan my outreach.
* *PHASE 3*: I want standard venue questions answered immediately, without waiting for a human reply.

### Venue Manager (London restaurant/private dining)

* As a venue, I want to see my space listed on Fete as soon as possible, with minimal setup effort on my part.
* As a venue, I want Felicity to extract my listing from my existing events brochure so I don’t waste time.
* As a venue, I want to receive only qualified, structured enquiries, reducing repetitive admin.
* *PHASE 2*: As a venue, I want to control and sync my live availability and have pricing calculated automatically from recent proposals.
* *PHASE 3*: I want Felicity to handle the first, repetitive messages with bookers and see how much time/money this is saving me.

---

## 5\. Phase 1 – The Directory (Fully Specced)

### Functional Requirements

**A. Booker-Facing**

* Structured directory of London venues (grid/map, photo-driven cards).
* Filters: capacity, location/area, price-per-head, event type.
* Search with auto-suggest and fuzzy logic on venue/neighbourhood.
* Individual venue listing page: photo carousel, capacity, price, description, menu/website/social links.
* Enquiry form (booker name, email, event type, date, guest count, budget, message).
* Enquiries email venue directly (via Postmark/Resend), Fete-branded footer drives venue claims and site traffic.

**B. Venue-Facing**

* “Claim/List your venue” CTA (homepage, footer, enquiry emails).
* Self-serve onboarding (email auth, PDF upload interface).
* Felicity-powered extraction: auto-extracts and populates all listing fields (name, address, capacity, pricing, photos, event types, contact details, description) from brochure PDF.
* Draft listing review/confirmation UI (flag missing fields; venue edits before submit).
* Listings routed to founder queue for approval before public launch.
* Founder seeds first 100 venues using Exa + Firecrawl export into the same schema.

**C. Data & Admin**

* Listing, user, venue, enquiry tables in Supabase.
* File storage for PDFs and extracted images.
* Enquiry table to track all submissions (for analytics, Phase 2 handoffs).

### User Experience

**Booker Journey**

* Arrives on a welcoming homepage, with search/filters featured up front.
* Browses directory/grid for relevant venues, toggles to map as needed.
* Clicks through visually-rich listing, reviews photos and details, sends a structured enquiry.
* Sees immediate confirmation.

**Venue Journey**

* Arrives via site, marketing, or Fete-branded email link.
* Authenticates by email, uploads their current event brochure.
* Felicity extracts all relevant data; venue reviews/edits any flagged fields.
* Listing enters "pending review" for founder approval, then is published.
* Receives structured booker enquiries, with Fete branding and CTA to claim/enrich listing.

**Edge Cases**

* If Felicity fails to extract images/details, clear flag is shown and venue must manually complete.
* All forms and UIs are fully mobile-friendly.

### Technical Considerations

* **Stack**: Next.js (frontend/API), Supabase (DB/Auth/Storage), Tailwind + shadcn/ui (design system), LLM API (PDF parsing/extraction).
* **Felicity extraction**: API to orchestrate PDF upload → LLM extraction → schema mapping → preview/edit UI.
* **Email**: Resend or Postmark for high-deliverability transactional email; Fete-branded templates include “Claim your venue” link.
* **Admin tools**: Founder's review queue manages all new/updated listings; ability to approve/publish.
* **Data model**: Venue, VenueListing, User(Venue/User), Enquiry, PDFAsset, ImageAsset.

### Milestones & Sequencing

**Total Time: 5 weeks (solo founder, AI-assisted)**

1. **Week 1–2:** Data model, Supabase setup, Exa/Firecrawl seeds, basic public site
2. **Week 2–3:** Search/filter UI, Map view, Enquiry form, Email delivery
3. **Week 3–4:** Felicity agent pipeline, Venue auth/onboarding, Admin review queue
4. **Week 4–5:** Visual/UX polish, GEO/SEO optimization, load up to 100 live listings, soft launch

---

## 6\. Phase 2 – Live Availability & Verified Pricing (\~60% Detail)

### What & Why

Phase 2 moves Fete from a static directory to a *marketplace*. Venues manage their listings, sync up-to-date availability, and reveal *verified* pricing—calculated as the rolling average of real proposals, not subjective self-reporting. This phase enables transparent comparison for bookers and dramatically reduces wasted venue admin time.

### Key Functional Additions

* **Calendar Sync:** Venues connect Google Calendar or iCal feed; interface for confirming current and future dates.
* **Verified Pricing:** Each venue’s “price-per-head” is the rolling average of their last 10 proposal quotes, auto-updated (cannot be set manually).
* **Availability Freshness:** Venues that don’t confirm/sync get a ranking penalty in search.
* **Dashboards:**
  * *Venue dashboard*: Pipeline of inbound enquiries, proposal status, time-saved meter.
  * *Booker dashboard*: Visual map of outreach, proposal carousel, shortlist feed.
* **Proposal Tracking:** New “proposal” concept—each venue reply creates/updates a row tied to enquiry, supports status changes (submitted, accepted, declined).

### Data Model Additions (must future-proof in Phase 1 build)

* **Proposals Table**: `proposal_id, venue_id, enquiry_id, price_per_head, date_submitted, status`
* **Pricing History Table**: `venue_id, price_per_head, date`
* **Calendar Events Table**: `venue_id, date, is_booked, last_confirmed`
* **Availability Status**: Per date/range with automatic ranking penalty logic in search algorithm

### Rough Sequencing

* 4–6 week build, after Phase 1 traffic validates demand
* Priority: Calendar sync → proposals/pricing → dashboards → penalty logic

---

## 7\. Phase 3 – Felicity Messaging Layer (\~40% Detail)

### What & Why

In Phase 3, Fete becomes a *fully automated introduction engine.* Felicity, now a conversational LLM agent, handles the first few messages after any enquiry: answering questions about availability, pricing, dietary, and logistics; collecting booker requirements; and only handing off to a human once specifics are needed. This is the revenue engine (venues pay per automated message).

### Felicity's Expanded Role

* Auto-responds to new booker enquiries with high-confidence, structured answers
* Detects when enquiries become bespoke (handoff triggers: ambiguous questions, custom requests)
* “Conversation thread” UX for both booker and venue

### Key Functional Additions

* **Messaging Layer:** Threaded view (web & email); supports both agent and human messages
* **Handoff Logic:** Rules for when to hand to a human (edge cases, requests outside structured schema)
* **Billing Events:** Venue is charged per automated Felicity message, tracked in platform
* **Analytics Dashboard:** Venue sees message count, time saved, cost, and performance metrics

### Data Model Additions (should be anticipated in Phase 1)

* **Conversations Table**: `conversation_id, venue_id, booker_id, status (open/closed/handed_off)`
* **Messages Table**: `message_id, conversation_id, from_agent:boolean, message_text, sent_at, billing_event_id`
* **Handoff State/Events**: For detecting and recording handoff transitions
* **Billing Events Table**: Linked to automated agent messages

### Revenue Model Mechanics

* Per-message automated billing (via Stripe/third-party widget only)
* Subscription tiers for venues: priority listing, dashboard analytics

### Rough Sequencing

* 6–8 week build, post-Phase 2, with Alpha/Beta pilots

---

## 8\. Success Metrics

| Metric | Phase | Target |
| --- | --- | --- |
| Live, complete venue listings | 1 | 100+ at launch (seed+organic) |
| Enquiry submission rate (listing→enquiry CTA) | 1 | 8%+ of page views |
| Extraction accuracy (Felicity auto-listing fields) | 1 | 85% of fields extracted |
| Booker return rate (30-day window) | 1–2 | 30%+ |
| Venue onboarding from email CTA | 1–2 | 10+ claims/mo |
| Venue active calendar sync | 2 | 75% of claimed venues |
| Enquiry-to-proposal rate | 2 | 50%+ |
| Automated message volume per venue | 3 | 5+ per week (venue avg.) |
| Venue NPS (self-serve/claim flow) | 1–3 | 50+ |
| Per-message conversion (Felicity) | 3 | 10% reply → proposal |

---

## 9\. Narrative

Sophie, planning her alumni dinner for 60 in London, lands on Fete’s homepage and is instantly greeted by a crafted, photo-rich search bar. She searches Shoreditch venues, filters by "private dining" and £80/head, and browses visual grids—no sterile listings, only inviting spaces. Each venue page brings the ambiance to life.

She shortlists three venues after reviewing photo carousels and real pricing guidance, and submits one quick structured enquiry—immediately receiving confirmation. Her details land directly in the right venue manager’s inbox (with a gentle nudge to claim and upgrade their listing).

After booker demand grows, the venues Sophie loves claim their listings and, in Phase 2, connect their calendars. Sophie can see which dates are actually available, compare verified price-per-head, and track which venues have replied to her proposals via her dashboard. All listings stay fresh—venues that ignore their calendars quietly drop down in search.

In Phase 3, as Sophie submits an enquiry, Felicity replies within seconds—“Yes, we’re open 22 May, 60 guests fits perfectly. Here’s the sample menu link and dietary info.” Routine Q&A is done instantly; only when Sophie asks about a specific band setup or rare menu is she handed to a human.

On the venue side, the Shoreditch dining room manager first discovers Fete when Sophie’s structured enquiry lands in their inbox. Claiming their listing is a breeze—their PDF is extracted by Felicity, generating a beautiful, editable online profile. As Fete matures, the venue connects their calendars, ensures pricing is always up to date, and eventually watches as Felicity cuts out repetitive Q&A, tracks every automated message, and lets them pay for only the value delivered. All with a crafted, warm, and highly visual experience—never SaaS grey.

---

**This PRD is architecturally aware across all three phases; Phase 1 is build-ready, and later phases are scoped for extensibility. Visual references and further design annotation to follow.**