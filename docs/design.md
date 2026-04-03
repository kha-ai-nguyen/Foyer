# Fete – Design System & Component Reference

## Design Tokens (locked – never deviate)

### Colour Palette
| Token | Hex | Usage |
|-------|-----|-------|
| base | #E0C5DA | Page background, warm mauve |
| base-deep | #C9A4C3 | Hover states, subtle depth |
| card | #FFFFFF | Card and form backgrounds |
| primary | #CDEA2D | Acid yellow-green, CTAs, active states |
| secondary | #FF2D9B | Hot pink, hover accents |
| dark | #1A1A1A | Borders, text, UI strokes |
| text-primary | #1A1A1A | Primary text |
| text-muted | #6B5068 | Labels, filter headings, supporting copy |

### Typography
| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | Syne | 700/800 | Headings, venue names, CTAs, counts |
| Body | Inter | 400/500/600 | Descriptions, labels, inputs, supporting text |

Font imports live in `src/app/globals.css` only. Never re-import elsewhere.

### Core Design Rules
- 2px dark (#1A1A1A) borders on ALL cards, buttons, inputs, and containers
- `rounded-md` corners throughout — no sharp or fully-rounded edges
- Generous whitespace — cards breathe
- Photo-forward: images take minimum 60% of card height on VenueCard
- Uppercase + tracking on: labels, filter chips, event type tags, CTAs
- Interactive hover: `bg-secondary text-white` as the default hover state
- Aesthetic: warm, crafty, editorial — NOT SaaS, NOT sterile
- References: Fresha, Treatwell, Are.na

---

## tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
      },
      colors: {
        base: '#E0C5DA',
        'base-deep': '#C9A4C3',
        card: '#FFFFFF',
        primary: '#CDEA2D',
        secondary: '#FF2D9B',
        dark: '#1A1A1A',
        text: {
          primary: '#1A1A1A',
          muted: '#6B5068',
        },
      },
      borderWidth: {
        '2': '2px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## src/app/globals.css

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #E0C5DA;
  color: #1A1A1A;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 3D flip utilities — required for VenueCard */
.preserve-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }
```

---

## src/types/index.ts

```typescript
export type EventType =
  | 'Workshop'
  | 'Wedding'
  | 'Corporate'
  | 'Party'
  | 'Exhibition'

export interface Venue {
  id: string
  name: string
  neighbourhood: string
  capacityRange: string
  priceEstimate: string
  eventType: EventType
  imageUrl: string
  description: string
}
```

---

## Component Specs

### VenueCard (`src/components/VenueCard.tsx`)

**Behaviour:**
- Desktop: 3D flip on hover using CSS `preserve-3d` + `rotate-y-180`
- Mobile: flip on tap using `useState(false)` toggle; only one card flipped at a time
- Use `onClick={() => setFlipped(!flipped)}` on the card wrapper
- On mobile, tapping outside or a second card resets the flipped state (lift state to parent or use a `selectedCardId` pattern)

**Front face:**
- Photo: 60% of card height minimum, `object-cover`, `border-b-2 border-dark`
- Event type strip: `bg-dark text-primary`, `text-[10px] font-bold uppercase tracking-widest`, `border-b-2 border-dark`
- Venue name: `font-display font-extrabold text-2xl uppercase text-dark`
- Neighbourhood: `text-text-muted text-sm font-bold uppercase tracking-widest`

**Back face:**
- Capacity and price rows: `border-2 border-dark rounded bg-white p-3 flex justify-between`
- Labels: `text-[10px] text-text-muted uppercase tracking-widest font-bold`
- Values: `text-sm font-bold uppercase text-dark`
- Description: `text-sm text-text-muted font-medium leading-relaxed`
- CTA button: `bg-primary border-2 border-dark text-dark font-bold uppercase tracking-widest py-3.5 rounded-md hover:bg-secondary hover:text-white`

---

### FilterBar (`src/components/FilterBar.tsx`)

Single component with two states: inline bar (always visible) and expanded modal (triggered by "More filters").

**Props:**
```typescript
interface FilterBarProps {
  selectedType: EventType | null
  onTypeSelect: (type: EventType | null) => void
  selectedCapacity: string | null
  onCapacitySelect: (capacity: string | null) => void
  selectedPrice: string | null
  onPriceSelect: (price: string | null) => void
}
```

**Inline bar:**
- Container: `bg-card border-2 border-dark rounded-lg p-6 mb-8`
- Event type chips: `border-2 border-dark`, selected = `bg-primary text-dark`, unselected = `bg-white text-dark hover:bg-secondary hover:text-white hover:border-secondary`
- Capacity + Price: native `<select>` with `bg-white border-2 border-dark`, custom SVG chevron, `focus:bg-primary`
- "More filters" button: `border-2 border-dark`, icon `SlidersHorizontal` from lucide, `hover:bg-primary`
- Divider between event types and dropdowns: `w-[2px] bg-dark self-stretch` (hidden on mobile)

**Expanded modal:**
- Overlay: `fixed inset-0 z-50 bg-dark/50`
- Panel: `max-w-3xl bg-card border-2 border-dark rounded-lg max-h-[90vh]`
- Sections: Amenities (grid of 4 icon buttons), Venue type (segmented control), Price range (with histogram), Capacity (min/max inputs)
- Amenity buttons: `border-2 border-dark`, selected = `border-primary bg-primary/10`
- Histogram bars: active range = `bg-secondary`, inactive = `bg-base-deep`
- Min/max inputs: `border-2 border-dark rounded-lg p-3`
- Footer: Clear all (`hover:text-secondary underline`) + "Show venues" (`bg-dark text-primary hover:bg-secondary hover:text-white`)

**Filter values:**
```
eventTypes: ['Workshop', 'Wedding', 'Corporate', 'Party', 'Exhibition']
capacities: ['Up to 50', '50–150', '150–300', '300+']
prices:     ['£', '££', '£££', '££££']
```

---

### VenueDetail (`src/components/VenueDetail.tsx`)

**Layout:** two-column (content left, booking sidebar right), sticky sidebar

**Left column:**
- Photo gallery: CSS grid, 2-col spanning hero + 4 smaller images, all `border-2 border-dark`
- Venue name: `font-display font-extrabold text-4xl uppercase`
- "Guest Favourite" badge card: `border-2 border-dark rounded-lg`, icon `SparklesIcon text-secondary`
- Host section: avatar, name, "Superhost" label
- Description prose: `text-lg leading-relaxed`

**Right sidebar (sticky):**
- "Rare find" callout: `border-2 border-dark rounded-lg`, icon `DiamondIcon text-secondary`
- Pricing card: `border-2 border-dark rounded-lg shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]`
- Date/guest inputs: `border-2 border-dark rounded-md`, nested grid layout
- Reserve CTA: `bg-primary border-2 border-dark font-display font-extrabold text-lg uppercase hover:bg-secondary hover:text-white`
- Sub-label: "You won't be charged yet" — `text-center text-sm font-bold text-text-muted`

---

### VenueListView (`src/components/VenueListView.tsx`)

**Purpose:** shortlisting flow — browse → shortlist → send enquiries

**Layout:** full-height, split: list area (flex-grow) + filter sidebar (w-80, right)

**Top stepper:** 3 steps (Browse, Shortlist, Send Enquiries), icon + label + description per step, connected by `ChevronRightIcon`, inactive steps at `opacity-50`

**List rows:**
- Container: `bg-card border-2 rounded-lg p-4 flex items-center gap-4`
- Selected state: `border-primary bg-primary/5`
- Checkbox: `border-2 border-dark`, checked = `bg-primary border-primary`
- Thumbnail: `w-16 h-16 object-cover rounded border-2 border-dark`
- Action icons (globe, phone, mail, chevron): `w-8 h-8 border-2 border-dark rounded hover:bg-primary`

**Summary bar (bottom):** total venues, shortlisted count, enquiries sent — `font-display font-extrabold text-2xl`

---

## Phase 1 File Structure

```
src/
├── app/
│   ├── page.tsx              ← venue directory (main page)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── FilterBar.tsx         ← inline + modal, merged
│   ├── VenueCard.tsx         ← 3D flip card
│   ├── VenueDetail.tsx       ← listing page
│   └── VenueListView.tsx     ← shortlist flow
├── data/
│   └── venues.ts             ← seed data, populated from real venues
└── types/
    └── index.ts
```

---

## Phase 2 Components (not yet wired — store in `src/components/_phase2/`)

Add this comment at the top of each file:
```typescript
// PHASE 2 — not yet wired to routing
```

| File | Purpose |
|------|---------|
| BookingPipeline.tsx | Pipeline stage management |
| BookingsBoard.tsx | Kanban board |
| StageSettings.tsx | Pipeline config |
| AppointmentScheduler.tsx | Venue visit booking |
| InquiryDetail.tsx | Full messaging thread |
| ServiceBooking.tsx | Service selection + map |

---

## Deleted / Cut

| Component | Reason |
|-----------|--------|
| MoodboardCreator.tsx | Scope creep, not in any PRD phase |
| FiltersPanel.tsx | Merged into FilterBar.tsx |
| App.tsx | Not used in Next.js App Router |
| index.tsx | Not used in Next.js App Router |
| index.css | Replaced by globals.css |
