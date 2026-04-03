# Fete - Project Guidelines

## What we're building
A venue and creative marketplace for large-scale private events in London.
Think Fresha/Treatwell but for alumni dinners, weddings, workshops, birthdays.
Expanding to US cities after London is proven.

## Current phase: 1 - Directory
Populate a searchable venue database manually. Users browse and enquire.
No booking, no payments, no AI yet.

- Scrape venue data via Firecrawl
- Process venue PDFs via pdf-reading + firecrawl-scrape skills
- Store in Supabase venues table
- Public-facing listings live on Vercel

## Tech stack
- Frontend: Next.js (App Router), Tailwind, shadcn/ui
- Database: Supabase (PostgreSQL)
- Hosting: Vercel (frontend), Railway (backend if needed)
- Analytics: PostHog
- Scraping: Firecrawl

## File structure
fete/
├── app/
│   ├── (public)/           # Directory, venue listings, search
│   ├── (dashboard)/        # Venue manager dashboard
│   ├── api/                # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn base components
│   ├── venue/              # Venue card, listing, calendar
│   └── search/             # Filters, search bar, map
├── lib/
│   ├── supabase/           # DB client and queries
│   └── utils/              # Shared helpers
├── scripts/                # Scraping and DB seeding scripts
├── docs/                   # BRIEF.md, STATUS.md, geo-strategy.md,
│                           # content-strategy.md
└── public/

cd C:\Users\khaai\Projects\Fete
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"## Database schema (Supabase)
- **venues**: id, name, slug, address, capacity_min, capacity_max,
  price_estimate, photos, description, website, last_confirmed_at
- **availability**: venue_id, date, status (available/unavailable/unconfirmed)
- **proposals**: venue_id, price_per_head, event_date, created_at
  (rolling average of last 10 = displayed price)
- **enquiries**: id, venue_id, user_email, event_date, headcount,
  status, created_at

## Environment variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
```

## Deployment
- Vercel auto-deploys from main branch
- Run `npm run build` before pushing
- Remind owner to deploy after meaningful changes
- Check Google Search Console after deploying new pages

## Design principles
- Warm, crafty, visual-first - not sterile or SaaS-looking
- References: Fresha, Treatwell, Are.na
- shadcn/ui as base, extended with custom Tailwind
- Skills to use on any UI task: ui-ux-pro-max, web-design-guidelines,
  taste-skill, frontend-design

## Product principles
- Deterministic first: calendar + pricing before any AI
- Anti-gaming pricing: displayed price = rolling average of last 10 proposals
- Freshness enforced: unconfirmed venues de-prioritised in search
- No payment processing in v1 (embed third-party widgets only)
- Scope: everything upstream of proposal acceptance only

## Roadmap
| Phase | Focus |
|-------|-------|
| 1 (now) | Venue directory, scraped and manually populated |
| 2 | Live availability calendar + verified rolling-average pricing |
| 3 | LLM-assisted first contact, per-message venue pricing |

## MCPs for this project
- Linear → ticket before every feature
- Firecrawl → scrape venue sites and PDFs
- Google Search Console → monitor indexing
- Gmail, Google Calendar → owner comms

## Working rules
- Owner is non-technical: plain English always
- Create a Linear ticket before starting any feature
- Flag build vs buy decisions explicitly
- Remind to deploy to Vercel after meaningful changes

## Task Completion Contract
A task is NOT complete until:
- The code runs without errors
- The feature works (verified in browser)
- `npm run build` passes
- Changes are committed and pushed to main: 
  `git add . && git commit -m "[description]" && git push origin main`
- Project CLAUDE.md is updated if anything significant changed