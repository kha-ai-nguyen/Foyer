# Fete - Project Guidelines

## What we're building
**Fete is the AI-powered workflow engine for private event coordination.** It automates the back-and-forth between event organizers (bookers) and venues, turning what would normally take weeks of emails and phone calls into a streamlined, agentic experience. Inspired by Lemonade's approach to insurance, Fete makes event planning fast, transparent, and delightful on both sides.

## Current phase: 1 - Workflow Automation + Agent Infrastructure

Bookers create events and Fete automatically reaches out to venues via voice agents + email. Venues get a CRM with a task inbox, lead scoring, email automation, and profitability analytics. No marketplace discovery focus—just pure workflow automation for both sides.

**Phase 1 focus:**
- Booker workflow: Create event → source venues (API/import) → blast outreach (voice + email) → compare proposals → accept
- Venue CRM: Task inbox, email parsing/auto-response, lead scoring, proactive follow-ups, contract integration
- AI agents: 11 Labs for outbound voice calls, Claude for email reasoning and automation
- Analytics: Revenue tracking, profitability analysis, win/loss insights

## Tech stack
- **Frontend**: Next.js 16 (App Router), Tailwind 4, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (frontend)
- **AI/Agents**: Anthropic Claude API (email reasoning, content generation), 11 Labs (outbound voice calls)
- **Analytics**: PostHog
- **External integrations**: Google Maps API, Yelp API (venue sourcing), Docusign/Ironclad (contracts)

## File structure
```
fete/
├── app/
│   ├── (booker)/
│   │   ├── create-event/        # Event creation flow
│   │   ├── my-events/           # Living event dashboard
│   │   └── explore/             # Venue sourcing/search
│   ├── (dashboard)/             # Venue manager dashboard
│   │   ├── [slug]/
│   │   │   ├── task-inbox/      # Primary view: unified next actions
│   │   │   ├── pipeline/        # Kanban by lead status
│   │   │   ├── calendar/        # Event calendar
│   │   │   ├── analytics/       # Revenue, profitability, win/loss
│   │   │   └── settings/
│   ├── api/
│   │   ├── agent/               # 11 Labs, email parsing endpoints
│   │   ├── venues/              # Google Maps, Yelp sync
│   │   └── conversations/       # Thread, proposal, automation logic
│   └── layout.tsx
├── components/
│   ├── ui/                      # shadcn base components
│   ├── booker/
│   │   ├── event-creation/
│   │   ├── venue-search/
│   │   └── proposal-comparison/
│   ├── venue/
│   │   ├── task-inbox/
│   │   ├── kanban/
│   │   └── email-thread/
│   └── analytics/
├── lib/
│   ├── supabase/               # DB client and queries
│   ├── agent/                  # 11 Labs, email parsing utilities
│   ├── ai/                     # Claude API, prompts, reasoning
│   └── utils/
├── scripts/                     # One-off scripts, migrations
├── docs/
│   ├── prd.md                  # Product Requirements (this is your north star)
│   ├── agent-architecture.md   # AI agent flows, integrations
│   ├── crmDesign.md            # Venue CRM design, automation logic
│   └── status.md               # Current phase, sprint status
└── public/
```

## Database schema (Supabase)

**events** (booker-created events)
- id, booker_id, event_type, headcount, budget, date, location, created_at

**event_venues** (venues targeted by a booker for an event)
- id, event_id, venue_id, status (invited/proposed/accepted/declined), created_at

**conversations** (all communication)
- id, event_id, venue_id, status (new/contacted/proposal_sent/confirmed/declined)
- last_message_at, created_at

**conversation_messages** (email/in-app messages in a thread)
- id, conversation_id, sender (booker/venue/fete_agent), body, message_type (email/in_app)
- email_from, email_to (for email threading)
- created_at

**proposals** (formal proposals from venues)
- id, conversation_id, price_per_head, total_estimate, status (draft/sent/accepted/declined)
- docusign_url (for contract integration)
- created_at, accepted_at

**venues** (all venues, from APIs + manual imports)
- id, name, slug, address, capacity_min, capacity_max, phone, email
- source (google_maps/yelp/imported), source_id
- created_at, last_updated_at

**venue_profiles** (venue settings + automation config)
- venue_id, user_email, user_phone
- email_parsing_enabled, auto_response_template
- lead_scoring_weights (event_value, responsiveness, etc.)
- created_at

**analytics** (pre-aggregated metrics for quick dashboard queries)
- venue_id, month, revenue, margin, proposal_count, win_count
- created_at

## Environment variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_POSTHOG_KEY=

# AI & Agents
ANTHROPIC_API_KEY=
ELEVEN_LABS_API_KEY=

# Venue sourcing
GOOGLE_MAPS_API_KEY=
YELP_API_KEY=

# Contract integration
DOCUSIGN_API_KEY=
IRONCLAD_API_KEY=

# Email parsing
GMAIL_SERVICE_ACCOUNT_KEY=
```

## Deployment
- Vercel auto-deploys from `main` branch
- Run `npm run build` before pushing
- Staging: Deploy to staging environment from feature branches to test agent flows
- Production: After meaningful feature work, remind owner to deploy to Vercel

## Design principles
- **Warm, crafty, visual-first** — not sterile or SaaS-looking
- **Inspired by Lemonade** — fast, delightful, agentic UX where humans only intervene when needed
- **References**: Lemonade, HubSpot (venue CRM simplicity), Fresha (warm aesthetic)
- **shadcn/ui as base**, extended with custom Tailwind
- **Design skills to use**: ui-ux-pro-max, web-design-guidelines, taste-skill

## Product principles
- **Workflow automation first** — remove manual work from both bookers and venues
- **Deterministic pricing** — no guessing; proposals show real, structured pricing
- **Lead intelligence** — AI scores leads so venues focus on high-value opportunities
- **Privacy & consent** — all conversation recording/parsing is transparent and opt-in
- **No payment processing in Phase 1** — focus on workflow, not transactions
- **Single-user per venue** — no team collaboration complexity in v1

## Roadmap
| Phase | Focus |
|-------|-------|
| 1 (now) | Booker event creation + agent outreach; Venue CRM + email automation + lead scoring |
| 2 | Advanced venue sourcing (API integrations), calendar sync, SMS automation |
| 3 | Payment processing, external CRM integrations, multi-venue coordination |

## MCPs for this project
- **Linear** → Create a ticket before every feature
- **Google Maps API** → Venue sourcing integration
- **Yelp API** → Venue sourcing integration
- **Anthropic API / SDK** → Claude reasoning, content generation
- **11 Labs** → Outbound voice agent calls
- **Docusign / Ironclad** → Contract management

## Working rules
- **Owner is non-technical**: Plain English always; explain trade-offs clearly
- **Create a Linear ticket before starting any feature** — link it in commit messages
- **Flag build vs. buy decisions explicitly** — e.g., "Should we build email parsing or use a third-party service?"
- **Test agent flows before merging** — test outbound call, email response, lead scoring in staging
- **Commit message format**: `[Feature/Fix/Refactor] Description — references Linear ticket`
- **Remind to deploy** after Phase 1 milestones (agent infrastructure, booker workflow, venue CRM)

## Task Completion Contract
A task is NOT complete until:
- The code runs without errors
- The feature works end-to-end (tested in browser or via API)
- `npm run build` passes with no TypeScript errors
- Changes are committed and pushed to the feature branch (`claude/[task-name]`)
- For agent/automation features: tested with realistic data (e.g., test voice call, email parsing, lead scoring)
- Project CLAUDE.md is updated if anything significant changed
