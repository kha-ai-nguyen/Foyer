# Fete – Product Requirements Document

_Last updated: 2026-04-16_

---

## 1. TL;DR

Fete is the **AI-powered workflow engine for private event coordination**. It automates the back-and-forth between event organizers (bookers) and venues—what normally takes weeks of emails and phone calls now happens in hours via AI agents that call venues, collect data, and surface proposals for comparison.

**Booker side:** Create event → Fete automatically contacts all matching venues (voice calls + email) → compare proposals side-by-side → accept one.

**Venue side:** Unified CRM with task inbox showing all next steps, email parsing that auto-logs and suggests responses, lead scoring that surfaces hot opportunities, and contract generation one click away.

The moat: **AI agents (voice + email) + unified workflow automation on both sides.** No one else is automating the entire event-to-booking cycle with this level of intelligence.

---

## 2. Product Vision & Strategy

### What Fete is

An AI-powered workflow platform with two equal sides:

**Booker side:** Event creation, venue sourcing (API + manual import), blast outreach via voice + email agents, proposal comparison, and acceptance.

**Venue side:** CRM with task inbox (unified next actions), email automation (parsing + auto-response), lead scoring (hot/warm/cold), proactive follow-ups, and contract integration.

**The AI agent layer:** 11 Labs voice agents make outbound calls to venues and collect proposals. Claude API drafts emails, parses inbound responses, scores leads, and generates custom content.

### Architecture principle

The platform is **not a marketplace**—it's a tool for coordinating event logistics at scale. Venues don't have to be on Fete to be contacted. Bookers can search APIs, import CSV, or browse a directory to find venues; Fete's job is to automate the boring parts (emailing 50 venues, tracking responses, comparing proposals).

### Who it's for

**Event organizers** planning anything from intimate dinners to large corporate events (50–500+ people).  
**Venue managers** at restaurants, hotels, wedding spaces, galleries, clubs, outdoor spaces—anyone who takes private events.

### The unsolved industry problem we crack

Event coordinators waste 40+ hours per event on outreach: calling venues, comparing quotes via email, tracking who said what. Venues waste hours answering the same questions (availability, capacity, price, included services) and manually building quotes.

Fete automates this:
- Booker time saved: 40 hours → 2 hours (create event, review proposals, decide)
- Venue time saved: 8 hours/week → 1 hour/week (task inbox + email automation + lead scoring)

### Competitive context

- **Tripleseat** (market leader): Full CRM for events, but no AI agents, expensive ($149–$500/mo), no marketplace
- **Perfect Venue** (rising challenger): Simpler CRM, free tier, just launched basic AI; no voice agents or email automation
- **Airtable/Notion** (DIY CRM): Cheap, flexible, but no automation or intelligence
- **Lemonade (inspiration)**: Not in events, but proves that agentic AI can create a 10x better UX than incumbents

### Fete's moat

1. **Voice agents for outbound calls** — calling 50 venues in parallel, collecting structured info instantly
2. **Unified workflow automation** — both sides on one platform with real-time sync (booker sees responses as they come in; venue sees all tasks in one place)
3. **Email parsing + auto-response** — venues' #1 pain (email overload) solved
4. **Lead scoring** — surfaces hot opportunities so venues focus on high-value deals
5. **Proposalcomparison UX** — see 10 venues side-by-side with price, capacity, photos, response time

---

## 3. Goals

### Business goals

- Prove demand: 100+ events created by bookers in first 3 months
- Onboard 20+ venues in London by end of Phase 1
- Show Fete saves venues 5+ hours/week on email + follow-ups
- Establish that AI agents (voice calls) work for this use case
- 30%+ proposal acceptance rate (booker creates event → accepts a proposal)

### User goals

**Booker:** Create an event once, have Fete contact all relevant venues in parallel, get proposals back within 48 hours, compare them easily, and accept one without chasing anyone.

**Venue:** See all inbound leads in one task inbox, have AI draft responses to common questions, get alerted when a lead is going cold, one-click contract generation, and clear revenue/profitability visibility.

### Non-goals (Phase 1)

- Stripe / payment processing (Phase 3)
- Calendar sync / availability intelligence (Phase 2)
- Multi-venue coordination (Phase 3)
- Team collaboration / delegation (out of scope; single user per venue)
- AI voice answering for venues (venues answer their own calls; we log the conversation)
- Custom proposal builder (use Docusign/Ironclad integrations instead)

---

## 4. User Stories

### Booker (28–45, event organizer, 20–500 guests)

- I want to create an event in 2 minutes (type, date, headcount, budget, location) so I don't spend time on admin
- I want to search venues via API (Google Maps, Yelp) or import a CSV so I can target specific spaces
- I want one "Blast" button that contacts all 50 venues in parallel so I don't have to email/call each one
- I want to see all responses logged in one living dashboard so I know status at a glance
- I want to compare proposals side-by-side (price, capacity, included services, photos) so I can decide fast
- I want to accept a proposal in one click and have both sides notified immediately

### Venue manager (restaurant, hotel, wedding venue, gallery, club)

- I want all inbound leads in one task inbox showing my next actions so I don't lose track of anyone
- I want emails auto-parsed and logged in my CRM so I don't copy/paste or lose context
- I want AI to suggest responses to common questions so I don't write the same email 10 times
- I want leads scored (hot/warm/cold) so I know which ones are worth my time
- I want a nudge when a lead is going cold so I follow up before it's too late
- I want one-click contract generation so I'm not manually building proposals
- I want to see my revenue, margins, and win/loss stats so I understand my business
- I want custom welcome emails and run-of-shows auto-generated for each event

---

## 5. Phase 1 — Workflow Automation + Agent Infrastructure (Build Now)

### Core features (RICE-ordered priority)

1. **Booker event creation** (Score: 650)
   - Simple form: event type, headcount, date, budget, location, guest list (optional)
   - Store in events table; wire to booker dashboard

2. **Venue sourcing + import** (Score: 640)
   - Google Maps API search (restaurants, event spaces, etc.)
   - Yelp API search
   - CSV/Google Sheets import for custom lists
   - Cache results in Supabase for fast search

3. **Agent outreach (voice + email)** (Score: 720)
   - 11 Labs outbound voice calls to venues (configurable time window, e.g., 9am–5pm)
   - Claude API drafts initial email to venues in parallel
   - Schedule both to start same time for impact
   - Track call success/failure + email delivery

4. **Conversation thread + proposal logging** (Score: 680)
   - All communication logged (calls, emails, in-app messages) in conversation_messages table
   - Proposals auto-extracted and logged with pricing, date, decision timeline
   - Linked to conversation so booker sees full context

5. **Booker proposal comparison** (Score: 670)
   - Side-by-side comparison table: price, capacity, included services, photos, response time
   - Filter + sort by price, capacity, response speed
   - Click through to full proposal or conversation thread

6. **Venue task inbox** (Score: 630)
   - Unified next-actions view across all leads
   - Show lead name, event type, headcount, date, budget
   - Lead score badge (hot/warm/cold)
   - Sort by priority (due date, lead value)
   - Link to full conversation thread

7. **Email parsing + auto-logging** (Score: 620)
   - Capture inbound emails (via Gmail API or email forwarding)
   - Auto-extract key data: availability, price, contact name, decision timeline
   - Log in conversation thread + structured fields
   - AI-draft response suggestion or auto-send if common question

8. **Lead scoring** (Score: 610)
   - AI scores each lead hot/warm/cold based on: event value (budget × headcount), responsiveness, decision timeline
   - Visible in task inbox + kanban as badge
   - Used for task sorting + notifications

9. **Proactive follow-up nudges** (Score: 600)
   - Alert venue manager: "This lead is going cold—respond to Sarah in 24h or escalate"
   - In-app notification + optional email
   - Trigger if no communication in 2+ days

10. **Kanban pipeline** (Score: 590)
    - 5 stages: New Lead → Contacted → Proposal Sent → Confirmed → Declined
    - Drag-to-update status
    - Color-coded by temperature (hot/warm/cold)
    - Secondary view to task inbox (both show same data, different layouts)

11. **Docusign/Ironclad integration** (Score: 550)
    - One-click contract generation from proposal data
    - Pre-fill: event date, headcount, price, venue details
    - Send to booker, track signature status

12. **Post-acceptance automation** (Score: 520)
    - When booker accepts a proposal, auto-generate task timeline:
      - "T-4 weeks: Collect dietary restrictions"
      - "T-2 weeks: Confirm final headcount"
      - "T-1 week: Send setup guide + parking info"
    - Trigger templated emails at each milestone
    - Store responses (dietary, guest list, etc.) in event data

### Technical stack

- **Frontend**: Next.js 16, Tailwind 4, shadcn/ui, React Query
- **Database**: Supabase PostgreSQL (conversations, messages, proposals, venues, analytics)
- **AI**: Anthropic Claude API (email drafting, response suggestions, lead scoring, content generation)
- **Voice agents**: 11 Labs API (outbound calls, success tracking)
- **Integrations**: Google Maps API, Yelp API (venue sourcing), Docusign/Ironclad (contracts), Gmail API (email parsing)
- **Hosting**: Vercel (frontend)

### Success metrics (Phase 1)

| Metric | Target | Rationale |
|--------|--------|-----------|
| Events created | 100+ in 3 months | Proof of demand from bookers |
| Venues onboarded | 20+ in London | Proof that CRM is useful |
| Outbound call success rate | 60%+ | Voice agent dial-through + connection |
| Proposal → accepted rate | 30%+ | Booker creates event → accepts proposal |
| Email parsing accuracy | 90%+ | Key data (date, price, timeline) captured correctly |
| Lead score agreement | 80%+ | Venue manager agrees with hot/warm/cold scoring |
| Venue time saved | 5+ hours/week | Email automation + task inbox + nudges |
| Feature adoption | 70%+ of venue features used | Task inbox, email parsing, lead scoring all adopted |

---

## 6. Phase 2 — Enhanced Automation + Analytics (Build Next)

1. **Advanced venue sourcing** — More API integrations (OpenTable, Airbnb Events, LinkedIn)
2. **Calendar sync** — Google Calendar / iCal two-way sync for venue availability (manual blocking + AI conflict detection)
3. **SMS automation** — Confirmations, reminders, quick follow-ups
4. **Profitability analytics** — Revenue, margin, cost tracking per event; win/loss analysis; pricing recommendations
5. **Attendee management** — Dietary collection, guest list, seating preferences
6. **Custom content generation** — Run-of-shows, welcome emails, event timelines (already in Phase 1 post-acceptance; expand to pre-acceptance)

---

## 7. Phase 3 — Payments, Integrations, Monetisation (Build Later)

1. **Stripe deposit collection** — Embed in proposal; venue receives deposit confirmation
2. **External CRM sync** — Push confirmed events to HubSpot, Salesforce, Tripleseat
3. **Multi-venue coordination** — For large corporate events, coordinate across 3–5 venues
4. **Reporting dashboard** — Conversion rates, time-to-response, revenue per event, agent utilization
5. **Per-message agent billing** — Venues pay per automated email/response (instead of flat fee)

---

## 8. User Experience — Narrative

### Booker perspective

Emma is planning a 60-person wedding rehearsal dinner for May 15. She lands on Fete, clicks "Create Event", fills in basics: wedding rehearsal, 60 guests, £75/head budget, Shoreditch, London. She has a list of 12 restaurants she's researched; she imports them as CSV.

She clicks "Blast Outreach". Fete immediately:
- Calls all 12 restaurants (in parallel, 9am–5pm window)
- Emails each one simultaneously with structured event details
- Logs all responses in real-time

Within 24 hours, Emma sees 8 proposals come back. She opens her proposal comparison table:

| Restaurant | Price/Head | Capacity | Included | Response Time | Photos |
|---|---|---|---|---|---|
| Morchella | £78 | 50–80 | Menu, wine, AV | 2h | [photos] |
| Hedone | £85 | 40–60 | Menu, wine, setup | 6h | [photos] |
| Lacryma Christi | £72 | 60–100 | Menu, wine, bar | 8h | [photos] |

Emma compares, clicks "Accept" on Morchella, and both Emma and the restaurant get notified. Done.

### Venue perspective

Marco manages Morchella's private dining. His Fete dashboard shows a task inbox:

- ⭐ Hot: "Emma's rehearsal dinner – 60 pax – May 15 – £78/head – RESPOND TODAY"
- 🔥 Warm: "Corporate lunch – 40 pax – April 28 – budget unknown – Call them"
- 💤 Cold: "Bridal shower – no response in 3 days – Follow up or archive"

Marco opens Emma's enquiry. An email came in from Fete asking if May 15 is available. Fete has auto-extracted:
- Date: May 15 (confirmed available in calendar)
- Headcount: 60
- Budget: £75/head total

Marco's AI-drafted response appears: *"Great to hear from you! Yes, May 15 is available. Our Private Dining room seats 50–70. For 60 guests, we'd suggest... [auto-generated options]"*

Marco clicks "Send + Generate Proposal" → Docusign contract auto-fills with event details. He clicks "Send to booker". 

Emma receives the proposal, reviews it, and accepts within 2 hours. Marco's lead moves to "Confirmed" in his kanban. He gets an auto-generated task timeline:

- T-4 weeks: "Collect dietary restrictions from Emma" (auto-email sent)
- T-2 weeks: "Confirm final headcount" (auto-email sent)
- T-1 week: "Send finalized BEO + parking info" (auto-email sent)

Marco never writes a cold email. He never copies/pastes. He just reviews, approves, and moves on. Fete did the work.

---

## 9. Design System (Locked)

### Colour Palette (do not change)

- **base**: #E0C5DA — warm mauve, page background
- **base-deep**: #C9A4C3 — deeper mauve for hover states
- **card**: #FFFFFF — card and form backgrounds
- **primary**: #CDEA2D — acid yellow-green, primary CTA
- **secondary**: #FF2D9B — hot pink, hover and accent
- **dark**: #1A1A1A — borders, text, UI strokes
- **text-primary**: #1A1A1A
- **text-muted**: #6B5068

### Typography

- **Display**: Syne, 700/800, uppercase, tight tracking — headings, event types, CTAs
- **Body**: Inter, 400/500/600 — descriptions, labels, inputs, conversation threads

### Core design language

- 2px dark (#1A1A1A) borders on all cards, buttons, inputs, containers
- rounded-md corners throughout
- Generous whitespace; cards breathe
- Photo-forward for venues (60% of card height minimum)
- Warm, crafty, NOT SaaS (references: Lemonade, Fresha, Treatwell, Are.na)
- Uppercase tracking on labels, filter chips, lead scores (hot/warm/cold), CTAs

---

## 10. Out of Scope (Deliberate Omissions)

- **Instant booking** — High-value events require human judgment; no automated booking
- **Menu management** — Low-value feature; venues manage menus elsewhere
- **Multi-user per venue** — Simplicity first; single manager per venue in Phase 1
- **Payment processing** — Phase 3; focus on workflow first
- **Marketplace discovery** — Directory is a sourcing tool, not a shopping experience

---

## 11. Appendix: Frequently Asked Questions

**Q: Why voice agents instead of just email?**  
A: Phone calls are 10x faster to get a response. Venues trust voice more than email from a stranger. Email alone would take 2+ weeks; voice gets answers in hours.

**Q: What if a venue doesn't want to be called?**  
A: We show venue contact preferences on import. Some may prefer email-only; we respect that and adjust agent behavior.

**Q: Who pays for 11 Labs API calls?**  
A: Venues, via a usage model (Phase 3). For Phase 1, we absorb cost to prove the value.

**Q: Can venues turn off email parsing?**  
A: Yes. It's opt-in. They control what data we extract and auto-respond to.

**Q: What about GDPR / privacy?**  
A: All call recording and email parsing is transparent and compliant. Booker and venue both consent to conversation logging.

---

_This PRD is complete for Phase 1 and architecturally extensible for Phases 2–3. Ready to build._
