---
brand: Foyer
last_updated: 2026-05-03
version: 1.0
source: Synthesized from docs/design.md + docs/brand.md + eBay Playbook (Evo Design System)
---

# Foyer Design System

> This is the canonical design system for Foyer. It covers foundations, tokens, components, and patterns. For implementation details (Tailwind config, CSS variables, file structure) see `docs/design.md`. For voice, copy, and brand personality, see `docs/brand.md`.
>
> Sections marked **[Foyer native]** are defined from Foyer's own spec. Sections marked **[Adapted from eBay Playbook]** adopt eBay's structural guidance with Foyer's brand values applied throughout.

---

## Design principles

**Calm, not cold.** Foyer serves venue managers who deal with chaos. The interface is the still point. Space, restraint, warmth through specificity.

**Operational over decorative.** Every component exists to help someone get work done. No flourishes that don't carry meaning.

**Hospitality-native.** The aesthetic is architectural and editorial, not SaaS-grey. Think Cereal magazine, not Salesforce.

**Consistent over novel.** Use the system. Don't invent new patterns when existing ones work. Familiarity is a feature.

---

## Quick reference: the 10 design rules

Non-negotiable. Every UI must pass these.

1. **Cream is the canvas.** All backgrounds default to `#F4EDE4`. Never pure white. Never grey.
2. **Clementine is for moments.** Hero sections, primary CTAs, brand marks, Clem's avatar. Used boldly but not everywhere.
3. **Plum is for depth.** Navigation, footer, editorial moments. The gravitas partner to clementine.
4. **Borders are 1px and quiet.** Never 2px graphic borders. Use soft `#E8DFD2` (oat) for dividers and card edges.
5. **Corners are 8px.** Default `rounded-md`. Larger surfaces (cards, modals) use 12px. Hero blocks 16px.
6. **Shadows are soft, low, warm.** No harsh drop shadows. Use the three-level shadow system.
7. **Fraunces is for the wordmark.** Geist for all headlines, UI, and body copy.
8. **Geist is for everything readable.** Body, UI labels, buttons, form fields, messages.
9. **Whitespace is the feature.** Cards breathe. Sections have room. Don't pack.
10. **Photography is architectural.** Empty spaces, texture, detail. No people-as-hero, no generic stock.

---

## 1. Foundations

### 1.1 Accessibility

**Focus states** [Foyer native]

```css
:focus-visible {
  outline: 2px solid #4A1F3F; /* plum */
  outline-offset: 2px;
  border-radius: 4px;
}

.on-brand-bg :focus-visible {
  outline: 2px solid #F4EDE4; /* cream on coloured backgrounds */
  outline-offset: 2px;
}
```

Never remove focus rings for keyboard navigation. Apply `outline: none` only to `:focus` (mouse), never `:focus-visible`.

**Touch targets** [Foyer native]

Minimum 44×44px for all interactive elements (WCAG 2.5.5). Small visual elements extend their hit area with invisible padding.

**Colour contrast** [Foyer native]

| Pair | Ratio | Pass |
|---|---|---|
| Ink on Cream | ~15:1 | AAA |
| Plum on Cream | ~12:1 | AAA |
| Mauve-grey on Cream | ~5:1 | AA (body) |
| Cream on Plum | ~12:1 | AAA |
| Cream on Clementine | ~3.5:1 | AA (large text only) |
| Ink on Clementine | ~7:1 | AAA |

Clementine fails contrast for body text on cream. Only use for display headings 18px+, CTAs (with ink text on top), brand marks.

**Colour + non-colour status** [Foyer native]

Never use colour as the only indicator. Always pair with text, icon, or pattern:
- Error: rust border + rust helper text + `AlertCircle` icon
- Success: sage colour + `Check` icon + confirmation text
- Warning: oat background + `AlertTriangle` icon + warning text

**ARIA patterns** [Foyer native]

| Component | Required attributes |
|---|---|
| Modal / dialog | `role="dialog"` `aria-modal="true"` `aria-labelledby="[heading-id]"` |
| Form field | `<label for="[field-id]">` always — never placeholder-as-label |
| Error message | `aria-describedby="[error-id]"` on field + `aria-invalid="true"` |
| Success toast | `role="status"` (non-disruptive) |
| Error toast | `role="alert"` (announces immediately) |
| Loading container | `aria-busy="true"` + `aria-live="polite"` |
| Decorative icon | `aria-hidden="true"` |
| Meaningful icon (no label) | `aria-label="[description]"` |
| Navigation | `<nav aria-label="Main">` |
| Skip link | First focusable element → `#main-content` |
| Tab list | `role="tablist"`, each tab `role="tab"`, panel `role="tabpanel"` |
| Accordion | Each header button `aria-expanded`, content `aria-hidden` |
| Breadcrumb | `<nav aria-label="Breadcrumb">` + `aria-current="page"` on last item |

**Reduced motion** [Foyer native]

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 1.2 Content guidelines

See `docs/brand.md` for the complete voice and tone system, Clem's character, copy patterns, and evaluation rubric.

**Summary rules for UI strings:**
- Verb + object, sentence case, no exclamation: "Send enquiry" not "Submit Now!"
- Error messages: what happened + what to do. No blame, no over-apology.
- Empty states: what's empty + what's coming + a forward action.
- Confirmations: action confirmed + what's next (short).
- Never use: em dashes, emoji, "reach out", "seamless", "unlock", "journey" (metaphorical).

---

## 2. Tokens

### 2.1 Colour tokens [Foyer native]

| Token | Hex | Semantic use |
|---|---|---|
| `cream` | `#F4EDE4` | Page background, canvas, primary surface |
| `clementine` | `#D97942` | Primary hero accent, CTAs, brand marks, Clem avatar |
| `plum` | `#4A1F3F` | Depth, navigation, footer, dark surfaces, editorial |
| `dusty-rose` | `#C49097` | Hover states, decorative accents, subtle highlights |
| `ink` | `#1F1419` | Primary text, headings, high-contrast UI |
| `mauve-grey` | `#6B5C63` | Secondary text, labels, captions, muted UI |
| `oat` | `#E8DFD2` | Card borders, dividers, disabled states |
| `sage` | `#7A8A6F` | Success, confirmations |
| `rust` | `#A94A3A` | Errors, destructive actions |
| `slate` | `#6B7A88` | Informational callouts |

Usage rules: see `docs/design.md` → Colour system.

### 2.2 Typography tokens [Foyer native]

| Level | Size | Line height | Font | Weight | Use |
|---|---|---|---|---|---|
| Display 1 | 64–96px | 1.0 | Geist | 800 | Marketing hero headlines |
| Display 2 | 48px | 1.1 | Geist | 700 | Section headlines |
| Heading 1 | 32px | 1.2 | Geist | 700 | Page titles |
| Heading 2 | 24px | 1.3 | Geist | 600 | Section headings |
| Heading 3 | 20px | 1.4 | Geist | 600 | Card titles, subsections |
| Heading 4 | 16px | 1.4 | Geist | 600 | UI section labels |
| Body Large | 18px | 1.6 | Geist | 400 | Lead paragraphs |
| Body | 16px | 1.6 | Geist | 400 | Default body, messages |
| Body Small | 14px | 1.5 | Geist | 400 | Secondary body, dense UI |
| Caption | 12px | 1.4 | Geist | 500 | Labels, metadata |
| Eyebrow | 11px | 1.3 | Geist | 600 | Uppercase tracked labels |

Fonts: Fraunces (wordmark, pullquotes only) + Geist (everything else). See `docs/design.md` → Typography.

### 2.3 Spacing tokens [Foyer native]

Built on a 4px base. All spacing snaps to this scale.

| Token | Value | Tailwind |
|---|---|---|
| `space-0` | 0px | `p-0` |
| `space-1` | 4px | `p-1` |
| `space-2` | 8px | `p-2` |
| `space-3` | 12px | `p-3` |
| `space-4` | 16px | `p-4` |
| `space-5` | 20px | `p-5` |
| `space-6` | 24px | `p-6` |
| `space-8` | 32px | `p-8` |
| `space-10` | 40px | `p-10` |
| `space-12` | 48px | `p-12` |
| `space-16` | 64px | `p-16` |
| `space-24` | 96px | `p-24` |

### 2.4 Shape / border radius tokens [Foyer native]

| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 4px | Skeleton elements, tags |
| `rounded-md` | 8px | Buttons, inputs, chips, small components |
| `rounded-lg` | 12px | Cards, containers |
| `rounded-xl` | 16px | Modals, hero sections, large surfaces |
| `rounded-full` | 9999px | Avatars, pill chips, badges |

Never use sharp corners (0px). Never use pills except for chips, badges, and avatars.

### 2.5 Shadow tokens [Foyer native]

```css
/* Resting — cards on cream */
box-shadow: 0 1px 2px rgba(31, 20, 25, 0.04);

/* Raised — modals, dropdowns */
box-shadow: 0 4px 16px rgba(31, 20, 25, 0.08);

/* Floating — toasts, popovers, tooltips */
box-shadow: 0 8px 32px rgba(31, 20, 25, 0.12);
```

Shadows are warm and soft. Never harsh black. Never coloured.

### 2.6 Motion tokens [Foyer native]

```css
:root {
  --duration-micro: 100ms;      /* hover colour, focus ring */
  --duration-quick: 150ms;      /* button press, toggle */
  --duration-standard: 200ms;   /* modal open, dropdown, toast */
  --duration-deliberate: 300ms; /* sidebar slide, section reveal */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Never exceed 350ms for UI interactions.

### 2.7 Z-index tokens [Foyer native]

| Layer | Value | Use |
|---|---|---|
| Base | 0 | Default stacking |
| Raised | 10 | Cards on hover, date pickers |
| Dropdown | 100 | Select menus, comboboxes, autocomplete |
| Sticky | 200 | Sticky headers, pinned elements |
| Sidebar | 300 | Fixed navigation sidebar |
| Modal overlay | 400 | Modal backdrop |
| Modal | 500 | Modal dialog |
| Toast | 600 | Notifications, toasts |
| Tooltip | 700 | Hover tooltips |
| Dev / emergency | 9999 | Debug overlays |

### 2.8 Breakpoint tokens [Foyer native]

| Breakpoint | Min-width | Columns | Tailwind prefix |
|---|---|---|---|
| Mobile | < 640px | 4 | (default) |
| Tablet | 640px | 8 | `sm:` |
| Desktop | 1024px | 12 | `lg:` |
| Wide | 1280px+ | 12 | `xl:` |

---

## 3. Components

Components are listed A–Z. Each entry covers: purpose, anatomy, variants, specs, do/don't, and Foyer-specific notes.

---

### 3.1 Accordion [Adapted from eBay Playbook]

**Purpose:** Hides and reveals content for progressive disclosure. Reduces information density. Use when users decide what they want to see.

**Use for:** FAQ sections, venue detail page (description, specifications, policy), pipeline card expanded details.
**Do not use for:** single expandable row (use Expansion instead), nested accordions.

**Anatomy:**
1. Title — describes the content of the row
2. Icon button — ChevronDown / ChevronUp to toggle
3. Content — text, images, or other components
4. Divider — 1px oat between rows

**Behaviour:**
- Tapping any part of the header row (title or icon) expands or collapses the row
- Rows remain open until manually closed unless auto-collapse is configured
- Requires 2+ rows. Single expandable → use Expansion component
- Titles wrap to multiple lines, never truncate
- Content area height flexes to fit content

**Specs (Foyer):**
- Closed row (small title): 48px height
- Closed row (large title): 52px height
- Title padding: 12px top/bottom, 16px left/right
- Gap between title and expanded content: 12px
- Gap below content before next divider: 8px
- Divider: 1px oat `#E8DFD2`
- Max content width: 40–75 characters (line length for paragraph text)

**States:**
- Default: collapsed
- Hover: subtle oat background overlay on row
- Focus: plum focus ring (`:focus-visible`)
- Expanded: ChevronUp, content visible below

**Do:** Keep titles short and concise. Use clear sub-sections inside rows.
**Don't:** Use long or wordy titles. Nest accordions.

---

### 3.2 Avatar [Foyer native + Adapted from eBay Playbook]

**Purpose:** Represents a user or Clem within the interface. Always circular.

**Foyer variants:**
- **Clem avatar:** Uppercase italic "C" in Fraunces 700, cream on clementine circle. Used in message bubbles, email sign-offs, "sent by Clem" attribution.
- **User avatar:** Initials (1–2 characters) or fallback icon (`User` from Lucide), plum background, cream text.
- **Venue avatar:** Venue logo or building icon `Building2`, oat background.

**Sizes:**
| Size | Diameter | Use |
|---|---|---|
| XS | 20px | Dense lists, inline |
| SM | 24px | Compact UI |
| MD | 32px | Default (message bubbles) |
| LG | 48px | Profile headers |
| XL | 64–80px | Clem email signature |
| 2XL | 96–128px | Profile pages |

**Rules:**
- Always `border-radius: 9999px`
- Characters always uppercased
- Valid characters: A–Z, 0–9
- Maximum 2 characters displayed (first name initial + last name initial)
- If no initials: use the relevant Lucide icon in mauve-grey

**Clem avatar placement:**
- Message bubbles (32px circle, left-aligned)
- Email signature blocks
- "Sent by Clem" attribution lines
- NOT in nav, footer, or hero — those are Foyer brand, not Clem brand

**Badge on avatar:** Unread count badge sits top-right. See Badge component.

---

### 3.3 Badge [Adapted from eBay Playbook]

**Purpose:** Visual indicator of numeric notification count. Used on icon buttons and inline next to text labels.

**Anatomy:**
1. Label — numeric count
2. Container — pill or circle, colour-coded

**Foyer colours:**
- Primary notifications (new messages, unread items): clementine `#D97942` background, ink `#1F1419` text
- Urgent / error counts: rust `#A94A3A` background, cream `#F4EDE4` text
- Informational: slate `#6B7A88` background, cream text

**Sizes:**
| Label | Size | Container |
|---|---|---|
| Single digit (1–9) | 16px Geist 600 | 24×24px circle |
| Double digit (10–99) | 12px Geist 600 | 24px height, pill shape |
| Max (99+) | 12px Geist 600 | 40px width, pill shape |

**Placement:**
- On icon buttons: top-right quadrant of the button, positioned to not obscure the icon
- Inline text: right of the label, vertically aligned to text cap height, 6px gap
- Never customise placement

**Specs:**
- Maximum shown: 99. Use "99+" for counts above 99.
- White (cream) outline 2px around badge when placed on coloured backgrounds
- Badge size consistent across all screen sizes

**ARIA:** `aria-label="[count] unread messages"` on the icon button container.

---

### 3.4 Breadcrumb [Adapted from eBay Playbook]

**Purpose:** Shows navigational hierarchy. Helps users understand where they are relative to the information architecture. Use in addition to main navigation, not as a replacement.

**Where to use:** Venue detail pages (Directory > London > Morchella), nested settings pages, deep pipeline flows.
**Don't use on:** Mobile (web collapses to overflow + last item only; native uses back button). Never as sole wayfinding.

**Anatomy:**
1. Page link — each ancestor as a clickable link
2. Separator — `ChevronRight` icon (12px, mauve-grey)
3. Overflow — ellipsis icon when 4+ items

**Behaviour:**
- Default: first item = root, last item = immediate parent
- Optional: last item = current page (static, not interactive, ink colour not plum)
- Max 4 visible labels. Collapse extras into overflow control.
- Single long label: truncate at 24 characters
- Multiple long labels: collapse all but first and last into overflow
- Separator gaps: 6px on each side of ChevronRight

**Specs:**
- Overall height: 24px
- Page title height: 16px (Geist 400, plum for links, ink for current)
- Overflow icon: 24×24px
- ChevronRight icon: 12px
- Active (current page) link: not interactive, ink `#1F1419`

**ARIA:**
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Directory</a></li>
    <li aria-hidden="true">›</li>
    <li><a href="/london">London</a></li>
    <li aria-hidden="true">›</li>
    <li aria-current="page">Morchella</li>
  </ol>
</nav>
```

---

### 3.5 Button [Foyer native]

See `docs/design.md` → Component patterns → Buttons for full spec.

**Quick reference:**
- **Primary:** Clementine bg, ink text. One per screen.
- **Secondary:** Cream bg, plum border + text. Hover: plum bg, cream text.
- **Tertiary:** No bg/border, plum text, underline on hover.
- **Borderless:** No bg/border, mauve-grey text. For within-component use.
- **Destructive:** Rust bg, cream text. Always paired with confirm step.

**Sizes:** Large (48px), Medium (40px), Small (32px). All extend tap target to 48×48px.

**Copy pattern:** Verb + object, sentence case. "Send enquiry" not "Submit."

---

### 3.6 Card [Foyer native]

See `docs/design.md` → Component patterns → Cards for full spec.

**Quick reference:** 12px border radius, 1px oat border, cream background, resting shadow. Vertical or horizontal orientation. Featured cards use clementine or plum background. Hover: translateY -2px.

---

### 3.7 Combobox [Adapted from eBay Playbook]

**Purpose:** Combines a text field with a popover menu. Allows filtering and choosing from a list, or entering a custom value. Faster than a dropdown for long lists.

**When to use:** Venue search (with autocomplete), tag/label assignment, bulk selection from a known list, any field where users might need to search before selecting.
**When not to use:** Short lists of 5 or fewer known options (use Dropdown/Select instead).

**Anatomy:**
1. Label — required, above field
2. Field container — 8px border radius, 1px oat border, cream bg
3. Value — typed or selected text
4. Menu — popover with matching options

**Variants:**
- **Single-select:** One value. Selecting from menu collapses it and fills field.
- **Multi-select:** Multiple values. Each selected value becomes a chip inside the field. Field height grows to wrap chips.
- **Autocomplete:** Fills in predicted value as user types. Accepted on blur.

**Sizes:**
| Size | Height | Use |
|---|---|---|
| Large | 48px | Default, all mobile contexts |
| Small | 40px | Compact, inline within filters |

**Label layout:** Stacked (above field, always visible) — use stacked as default. Floating only in very constrained layouts. Never mix within a single form.

**Menu trigger:**
- On focus: appropriate when list is complex or unfamiliar
- On character entry: appropriate when content is familiar to user
- "Create new" option appears if 3 or fewer matches for user's entry

**Specs:**
- Min width: 192px. Max width: 480px.
- Horizontal padding: 16px left and right
- Label to field gap: 4px
- Field to helper text gap: 8px
- Field to menu gap: 4px
- Error state: 1px rust border, error message replaces helper text, AlertCircle icon

**Do:** Use autocomplete to speed up entry. Show a "create new" option for tags and labels.
**Don't:** Use for short known lists. Use dropdown/select instead.

---

### 3.8 Date picker [Adapted from eBay Playbook]

**Purpose:** Allows users to choose a single date or date range. Critical for event date selection in enquiry forms and pipeline.

**Variants:**
- **Default (single):** One date selection. Current date always visible.
- **Date range:** First tap sets start, second tap sets end. Third tap resets.
- **Double picker:** Two months shown side-by-side on large screens.
- **Date input:** Text field with calendar icon. Simple memorable dates accept text input; icon reveals calendar popover.

**Foyer date input field:**
- Same styling as standard text input (48px height, 8px radius, 1px oat border)
- Placeholder: "DD/MM/YYYY" (UK format for London-first product)
- Error: "Enter a valid date" with rust border + AlertCircle
- Calendar icon: `Calendar` from Lucide, 20px, mauve-grey, trailing position

**Calendar popover:**
- Background: cream `#F4EDE4`
- Border: 1px oat
- Border radius: 12px
- Shadow: raised shadow
- Z-index: 100 (Dropdown layer)
- Padding: 16px all around

**Date cell states:**
| State | Style |
|---|---|
| Default enabled | Ink text, no background |
| Current date | Plum border ring (1px) |
| Hover | Oat background |
| Selected (single) | Clementine circle, ink text |
| Range start / end | Clementine circle, ink text |
| Range interior | Dusty-rose background, ink text |
| Disabled | Mauve-grey text, no interaction |

**Specs:**
- Container padding: 16px
- Month/year header: 24px height
- Day row (labels): 20px height
- Date cells: 48px height
- Selection circle: 32px diameter (centred in 48px cell, 8px above/below)
- Month navigation: ChevronLeft / ChevronRight, 16px icons

**Month navigation:** Horizontal swipe or nav buttons. On small screens, full-screen modal version stacks months vertically.

**Best practice:** Use text input for simple dates (event year, credit card expiry). Use date picker calendar only when the visual calendar adds genuine value (comparing days of week, selecting date ranges).

---

### 3.9 Dialog / Modal [Foyer native]

See `docs/design.md` → Component patterns → Modals / dialogs for full spec.

**Quick reference:** Three types (Alert / Confirm / Task). Three widths (480px / 616px / 896px). Plum overlay 40%. Cream background. 16px padding. Close via ✕ on Task type only.

---

### 3.10 Divider [Adapted from eBay Playbook]

**Purpose:** Separates list groups and content sections. Not for separating individual list items.

**Style:**
- Colour: oat `#E8DFD2`
- Weight: 1px
- Full width of parent container
- No margin on the divider element itself — spacing is controlled by the surrounding components

**When to use:** Between accordion rows, between list groups (not individual items), between sections in a panel or modal.
**Don't use:** As a design element for visual interest. As an individual list item separator.

---

### 3.11 Filter chip / Tag [Foyer native]

**Purpose:** Quick access to filter/sort options. Also used as input tags in multi-value fields.

**Styles:**
- Background: cream
- Border: 1px solid oat
- Border radius: 9999px (full pill)
- Padding: 6px 14px
- Font: Geist 500, 13px, ink
- **Selected:** clementine bg, ink text, clementine border
- **Hover:** dusty-rose bg, ink text, dusty-rose border
- **Disabled:** oat bg, mauve-grey text, no interaction

**With remove button (input chip variant):**
- Chip + `✕` icon (12px) inside the chip on the trailing side
- `✕` appears when chip is in a multi-value input field
- Removing a chip un-selects that value and re-adds it to the menu

---

### 3.12 Form fields [Foyer native]

See `docs/design.md` → Component patterns → Form fields for full spec.

**Quick reference:** 48px height (large), 40px (small). 1px oat default border, plum focus, rust error. Stacked labels default. Helper text below (mauve-grey, 13px). Error replaces helper text, never shown simultaneously.

---

### 3.13 Icon [Foyer native]

**Library:** Lucide React (ships as shadcn dependency).

**Sizes:** 12px (inline), 16px (secondary controls), 20px (default UI), 24px (prominent), 48px (decorative/empty state).

**Colours:** mauve-grey default, ink active, clementine brand moments, cream on coloured backgrounds.

**Preferred icons for Foyer surfaces:**

| Purpose | Icon |
|---|---|
| Calendar / date | `Calendar` |
| Guest count | `Users` |
| Budget / price | `PoundSterling` |
| Enquiry / message | `Mail` or `MessageSquare` |
| Pipeline / stages | `LayoutKanban` |
| Search | `Search` |
| Settings | `Settings` |
| Close / dismiss | `X` |
| Venue / building | `Building2` |
| Confirmation | `Check` |
| Error | `AlertCircle` |
| Info | `Info` |
| Warning | `AlertTriangle` |
| Add / create | `Plus` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Navigation / menu | `Menu` |
| Chevron | `ChevronRight` or `ChevronDown` |
| Clem / AI (use sparingly) | `Sparkles` |

---

### 3.14 Icon button [Foyer native]

Icon-only interactive element. Always includes tooltip on hover.

| Size | Container | Icon | Tap target |
|---|---|---|---|
| Large | 48px | 24px | 48×48px |
| Medium | 40px | 20px | 48×48px (extended) |
| Small | 32px | 16px | 48×48px (extended) |

Never use without a tooltip unless the icon is universally unambiguous in context (e.g., ✕ to close).

---

### 3.15 Loading / Skeleton [Foyer native]

See `docs/design.md` → Loading and skeleton states for full spec.

**Quick reference:** Skeletons (not spinners) for data fetching. Oat base colour, shimmer optional. 150ms delay before showing. Skeleton shapes match the component they represent.

---

### 3.16 Navigation [Foyer native]

See `docs/design.md` → Component patterns → Navigation for full spec.

**Quick reference:** Plum top nav, 64px height, cream links. Fixed sidebar 240px (collapsed 64px icon-only). Mobile: hamburger → full-width plum overlay.

---

### 3.17 Notice system [Adapted from eBay Playbook]

**Purpose:** Communicates system status and feedback. Three levels based on scope and priority.

**Decision guide:**
| Notice type | Scope | Priority | Dismissable |
|---|---|---|---|
| Page notice | Full page | High | Optional |
| Section notice | Section of content | Medium | No |
| Inline notice | Single element | Low | No |

**Semantic variants:**
| Variant | Foyer colour | Use |
|---|---|---|
| Information / neutral | Slate `#6B7A88` | General info, no action needed |
| Guidance / attention | Clementine `#D97942` | Prompts user toward an action |
| Success / confirmation | Sage `#7A8A6F` | Confirms action completed |
| Error / attention | Rust `#A94A3A` | Something went wrong, action required |

**Page notice:**
- Appears at the top of the page content area, below navigation
- Background: semantic colour at 10% opacity, with 3px left border in full semantic colour
- Padding: 16px
- Border radius: 8px
- Always includes icon (16px, semantic colour) + heading + optional body text
- Optional: dismiss button (icon-only ✕, 32px) when dismissable

**Section notice:**
- Appears within a content section, between other content elements
- Same styling as page notice but without the full-page prominence
- Used for: proposal status updates, pipeline stage alerts, form section warnings

**Inline notice:**
- Low-priority note about a single element (a tile, a row, a form field group)
- Same styling but smaller — 12px border-left, 12px padding
- Used for: "This venue's minimum is higher than your budget", "Date not confirmed yet"

**ARIA:**
- Information notices: `role="note"`
- Error/attention: `role="alert"` (announces immediately)
- Success: `role="status"` (non-disruptive)

---

### 3.18 Pagination [Adapted from eBay Playbook]

**Purpose:** Breaks large data sets into pages. Use for venue directory listings, pipeline views, conversation archives.

**When to use:** More than 20 items. Desktop/tablet web.
**When not to use:** Mobile (use infinite scroll / load more instead). When all items fit on one page.

**Anatomy:**
1. Back navigation (ChevronLeft arrow)
2. Page number buttons
3. Overflow control (ellipsis) — appears when pages are truncated
4. Active page indicator (filled circle)
5. Forward navigation (ChevronRight arrow)

**Behaviour:**
- Maximum 7 visible slots (including overflow if truncated)
- Minimum 5 visible slots on narrower screens
- Leading overflow: appears when 2+ pages between current position and start
- Trailing overflow: appears when navigating within last 4 pages
- Clicking overflow reveals a popover with additional page numbers
- Optional: inline results-per-page dropdown alongside pagination

**Foyer specs:**
- Back/forward buttons: 32px width, 40px height
- Page number buttons: 44px width, 40px height
- Active page: clementine bg circle (32px), ink text
- Inactive pages: no background, ink text
- Overflow button: 44px width (same as page buttons)
- Gap between buttons: 8px

**ARIA:** `<nav aria-label="Pagination">` with `aria-current="page"` on active page.

---

### 3.19 Popover [Adapted from eBay Playbook]

**Purpose:** Non-modal transient container that appears above other content. Discloses lists of choices or supplemental information. Always triggered by an explicit user action (button press), never on hover.

**When to use:** Filter menus, action menus, overflow lists, supplemental information tied to a specific element.
**When not to use:** High-priority information (use a modal instead). Complex multi-step flows.

**Anatomy:**
1. Header — optional, for multi-level navigation within the popover
2. Body — primary content (radio groups, checkboxes, option lists)
3. Footer — optional, contains a CTA button for explicit submission
4. Tip — optional arrow pointing to trigger element

**Behaviour:**
- Opens on press/click of trigger element. Never on hover.
- Only one popover open at a time. Close existing before opening a new one.
- Dismissed by: re-pressing trigger button, making a selection, clicking outside, pressing Escape
- Scrolls vertically when content exceeds popover height
- On mobile: transitions to bottom sheet instead of popover

**Foyer specs:**
- Background: cream `#F4EDE4`
- Border: 1px solid oat `#E8DFD2`
- Border radius: 12px
- Shadow: floating shadow
- Padding: 16px all sides
- Footer height: 40px
- Body-to-footer gap: 8px
- Z-index: 100 (Dropdown layer)
- Max width: 320px (menu-style), 480px (complex content)

**Tip (pointer):**
- Use when the trigger element may be ambiguous
- 8px triangle pointing toward trigger
- Colour matches container background (cream) with oat border

---

### 3.20 Progress stepper [Adapted from eBay Playbook]

**Purpose:** Shows progression through a multi-step process. Use for event status tracking (enquiry → proposal → deposit → confirmed → executed), onboarding flows, multi-step forms.

**When to use:** 3–7 distinct milestones with clear sequencing.
**When not to use:** 1–2 steps (use headings + body text instead). More than 7 steps.

**Anatomy:**
1. Icon — 24px circle indicating step state
2. Leading line — connects to previous step
3. Trailing line — connects to next step
4. Primary label — past-tense milestone name
5. Secondary label — optional (date completed, additional context)

**States:**
| State | Icon | Label weight |
|---|---|---|
| Incomplete | Empty circle, oat border | Regular |
| Latest (most recent complete) | Clementine circle, Check icon (cream) | Bold |
| Completed (older steps) | Sage circle, Check icon (cream) | Regular |
| Blocked | Rust circle, AlertCircle icon | Bold |

**Orientations:**
- **Horizontal:** Use when saving vertical space. Minimum 104px between icons. Scrollable if exceeds screen.
- **Vertical:** Use on mobile with many steps. Minimum 24px gap between icons. Always full width.

**Specs:**
- Step icon: 24px diameter
- Icon-to-line gap: 4px on each side
- Line height/width: 4px (oat colour for incomplete, clementine for completed)
- Label-to-icon gap: 8px
- Minimum horizontal step width: 104px
- Minimum vertical gap: 24px

**Label rules:**
- Always past tense ("Paid", "Confirmed", "Delivered")
- Not present tense ("Paying", "Confirming")
- Not process states ("Processing", "In transit") — lines and icons imply those
- Maximum label length: wrap to new line, never truncate

**Foyer event journey (example):**
Enquiry received → Proposal sent → Deposit paid → Event confirmed → Event complete

**Errors:** Pair blocked state with a section notice explaining the issue and what the user should do.

---

### 3.21 Search field [Adapted from eBay Playbook]

**Purpose:** Filters a list in real time using typed keywords. Distinct from a global search — this filters an existing visible dataset.

**Where to use:** Venue directory filtering, pipeline search, conversation inbox search, table filtering.

**Anatomy:**
1. Lead Search icon — static, always visible (Lucide `Search`, 20px, mauve-grey)
2. Placeholder text — describes what is being filtered: "Search venues", "Search conversations"
3. Field container — same styling as text input
4. Clear button (✕) — appears when field is focused and has content; replaces trailing accessory

**Sizes:**
| Size | Height | Default | Use |
|---|---|---|---|
| Large | 48px | ✓ | Standalone search bars |
| Medium | 40px | | Inline with other elements in filter bars |
| Small | 32px | | Dense/compact contexts |

All sizes: tap target 48px minimum (extended hit area on smaller sizes).

**Behaviour:**
- Lead search icon: always visible, static
- Filters list in real time as characters are typed (preferred)
- Clear button: replaces trailing accessory when field has content; clears on press
- Width: 200–480px. Full width on mobile.
- On mobile: place near top of page; screen scrolls to keep field visible on keyboard open

**When to include a search button:** Large datasets where real-time filtering would cause performance issues (server-side filtering). Use Lucide `Search` as button icon.

**Foyer specs:**
- Background: cream
- Border: 1px oat default, 1px plum focused
- Border radius: 8px
- Padding: 12px 16px (large), with 8px gap between search icon and text
- Placeholder: mauve-grey
- Clear button: 20px ✕ icon, mauve-grey

---

### 3.22 Segmented button [Adapted from eBay Playbook]

**Purpose:** Compact way to switch between mutually exclusive views or sort options. Similar to tabs but more compact, suitable for inline use.

**When to use:** Toggling between views (List / Grid / Map), switching between data ranges (Week / Month / Year), sorting options in a filter bar.
**When not to use:** Navigation between pages or major content sections (use Tabs). More than 4–5 options.

**Anatomy:**
- Horizontal group of 2–5 buttons with shared border
- Each segment: label only, or icon + label

**Foyer specs:**
- Height: 40px (default), 32px (compact)
- Border: 1px oat on group container, shared between segments
- Border radius: 8px on group container (not individual segments)
- Background (inactive): cream
- Background (active): plum, cream text
- Hover (inactive): oat background
- Padding: 0 16px per segment
- Font: Geist 500, 14px

**ARIA:** `role="group"`, each button `aria-pressed="true/false"`.

---

### 3.23 Tab [Adapted from eBay Playbook]

**Purpose:** Organises content within an interface. Allows switching between sections without leaving the page. Content only changes below the tabs — not the page itself.

**When to use:** Venue dashboard sections (Pipeline / Conversations / Calendar), venue detail page sections (Overview / Spaces / Reviews), settings sections.
**When not to use:** Navigation between pages. More than 7 tabs. Nested tabs.

**Anatomy:**
1. Label — concise, 1–2 words, max 32 characters
2. Active indicator — 2px clementine underline spanning the text width

**Behaviour:**
- Minimum 2 tabs; aim for no more than 7
- Default spacing between tabs: 40px (auto-adjusts on smaller screens)
- Tabs extending beyond screen: horizontally scrollable with peek of next tab
- States: active (clementine indicator, ink bold), hover (dusty-rose underline), inactive (mauve-grey text)
- Active indicator: 2px, clementine, 4px below text

**Optional divider:** 1px oat line below entire tab set for stronger separation from content.

**Foyer specs:**
- Label: Geist 600, 14px when active; Geist 400, 14px when inactive
- Active indicator: 2px clementine, full text width
- Label hover: dusty-rose 1px underline
- Indicator-to-text gap: 4px
- Between-tab spacing: 40px
- Optional divider: 1px oat, full width

**ARIA:** `role="tablist"` on container, `role="tab"` + `aria-selected` on each, `role="tabpanel"` + `aria-labelledby` on content.

---

### 3.24 Table [Adapted from eBay Playbook]

**Purpose:** Displays and organises data efficiently. Use for: pipeline list view, guest lists, financial reconciliation, BEO line items.

**When to use:** Structured data with 4+ columns and 10+ rows where comparison is important.
**When not to use:** Simple lists (use cards or list items). Data that needs storytelling (use metrics/charts). Mobile primary (tables scroll horizontally; not ideal).

**Anatomy:**
1. Title — identifies the table contents
2. Filter/search bar — optional, above table
3. Toolbar — column controls, density selector
4. Table content — header + rows
5. Pagination — for 60+ rows

**Density:**
| Density | Row height | Padding T/B | Use |
|---|---|---|---|
| Compact | 64px | 12px | Dense data comparison |
| Default | 80px | 16px | Standard use |
| Relaxed | 112px | 24px | When rows contain media or multi-line content |

All densities: 16px left/right cell padding.

**Cell types:**
- **Simple:** Text string, wrapping at 4 lines max
- **Numeric:** Numbers (currency, percentages, stats). Right-aligned always. Use up/down arrow for trend direction, never colour alone.
- **Field:** Editable inline text field (enabled state)
- **Dropdown:** Select menu for quick per-row selections
- **Status:** Coloured badge or tag indicating row state. Always pair with text label.
- **Actions:** CTA Button, CTA Button + overflow, Icon Button, or Icon Button + overflow. Max 2 primary actions; remainder in overflow.

**Status cells (Foyer semantic colours):**
| State | Background | Text |
|---|---|---|
| Confirmed | Sage bg (10%) | Sage |
| Pending / Tentative | Slate bg (10%) | Slate |
| In Review | Clementine bg (10%) | Clementine |
| Cancelled | Rust bg (10%) | Rust |
| Draft | Oat bg | Mauve-grey |

**Behaviour:**
- Header: sticky on vertical scroll (z-index: Sticky = 200)
- Horizontal scroll when columns exceed viewport
- Max height: 90% viewport
- Sorting: 3 states — unsorted, sorted-up, sorted-down. Sort icon appears on header hover.
- Loading: skeleton rows replace content (same row height as density setting)
- Bulk editing: see Bulk Editing pattern

**Column rules:**
- Min width: 124px. Max width: 400px.
- Selection column (checkbox): fixed 48px
- Single icon action column: fixed 64px
- Numeric columns: right-aligned
- Empty/null cells: use "Pending" or descriptive text. Never "--".

**Specs:**
- Header row: 24px height above first data row
- Selection checkbox: 16px from left edge, 16px from first content column
- Cell content: max 4 lines before truncation

---

### 3.25 Toast / Notification [Foyer native]

**Purpose:** Temporary feedback message after a user action. Confirms success or communicates failure without blocking the interface.

**Position:** Bottom-right on desktop. Bottom-center on mobile (full-width minus 16px insets).

**Anatomy:**
1. Icon — semantic, 16px
2. Body text — concise, max 2 lines
3. Optional action — single link button ("Undo", "Try again")

**Variants:**
| Type | Icon | Background | Use |
|---|---|---|---|
| Default | — | Ink `#1F1419` | General confirmations |
| Success | `Check`, sage | Ink | Action completed |
| Error | `AlertCircle`, rust | Ink | Something failed |
| Info | `Info`, slate | Ink | Non-critical information |

**Behaviour:**
- Auto-dismisses after 4 seconds (begins when component loads)
- Dismissed by: timeout, swipe down (mobile), optional ✕ icon button
- Never stack — replace existing toast with newer one if triggered while one is visible
- Use for targeted one-off actions, not for frequent repeated actions
- For high-priority decisions requiring attention: use a dialog instead

**Foyer specs:**
- Background: ink `#1F1419`
- Text: cream `#F4EDE4`, Geist 400, 14px
- Border radius: 8px
- Padding: 12px 16px
- Max width: 448px (desktop), full width minus 32px (mobile)
- Icon: 16px, semantic colour
- Icon-to-text gap: 12px
- Z-index: 600 (Toast layer)
- Shadow: floating shadow

**ARIA:** `role="status"` (success/info), `role="alert"` (error).

---

### 3.26 Tooltip [Adapted from eBay Playbook]

**Purpose:** Reveals an element's label when the label isn't otherwise visible. Used primarily on icon buttons.

**Anatomy:**
1. Label — concise, auto-populated from the anchor element's accessible label
2. Container — cream bg, oat border, floating shadow

**Behaviour:**
- Appears after a 2-second delay on hover or focus
- Fades out 1 second after the anchor loses hover or focus
- Only one tooltip visible at a time
- Default placement: below anchor. Auto-adjusts to the side with open space.
- Never show multiple tooltips simultaneously

**Foyer specs:**
- Background: ink `#1F1419` (inverted, for contrast)
- Text: cream `#F4EDE4`, Geist 400, 12px
- Padding: 8px 12px
- Border radius: 6px
- Shadow: floating shadow
- Z-index: 700 (Tooltip layer)
- Max width: 200px. Wraps to new line when exceeded.
- Placement: below anchor by default; adjusts to above/leading/trailing based on available space

**Label:** Should avoid wrapping where possible. Match the button's `aria-label`. Keep under 5 words.

**Do:** Show one at a time. Use for icon buttons without visible labels.
**Don't:** Show on hover for popovers (popovers require explicit press/click). Show for clearly labelled elements.

---

### 3.27 Text link [Adapted from eBay Playbook]

**Purpose:** Lightweight navigational element. Use for navigation (URL change or new page), not for actions.

**Link vs Button rule:**
- Use a link when navigating: to a page, a venue listing, an anchor on the page, an email address
- Use a button when taking an action: "Send enquiry", "Delete listing", "Accept proposal"

**Behaviour:**
- Underlined by default when inline with paragraph text
- Inherits size and colour from surrounding text
- States: enabled, hover, focused, visited, disabled

**Foyer styling:**
- Colour: plum `#4A1F3F` (matches ink-level text for most contexts)
- On plum or coloured backgrounds: cream `#F4EDE4`
- Underline: always when inline in body copy
- Remove underline only in contexts where links are obviously links (e.g., nav lists, footer links)
- Never use links as headlines or section titles

**Content rules:**
- Aim for fewer than 5 words
- Use descriptive text ("View proposal", "See the space")
- Never use "Click here", "Learn more", "Read more" — no context for screen reader users

**Open in same window** by default. Only open new tab for external links leaving findfoyer.com (confirm with user intent first).

---

### 3.28 Message bubble (Clem chat) [Foyer native]

See `docs/design.md` → Component patterns → Message bubbles for full spec.

**Quick reference:** Clem: cream bubble, oat border, 32px C avatar left-aligned. User: plum bubble, right-aligned, no avatar.

---

### 3.29 Empty states [Foyer native]

See `docs/design.md` → Component patterns → Empty states for full spec. See `docs/brand.md` → Empty states for copy patterns.

**Quick reference:** Centred, 48px line-style icon (optional), Fraunces heading, Geist body, optional CTA. Copy pattern: what's empty + what's coming + a forward action.

---

## 4. Patterns

Patterns are reusable solutions to common multi-component user problems.

---

### 4.1 File uploading [Adapted from eBay Playbook]

**Purpose:** Consistent interface for uploading files across the product. Use for: proposal attachments, BEO documents, venue photos, event briefs.

**Components used:** Text input, Button, Loading/Spinner, Icon button, Snackbar/Toast, Dialog (for preview).

**Anatomy:**

**File input field (web drag-and-drop):**
1. Heading — "Drag and drop files" (required, bold)
2. Description — acceptable formats and max size: "JPG, PNG, or PDF · Max 10MB"
3. Select/drop zone — dashed 1px oat border, cream background, 8px border radius, full-width
4. Complementary CTA — "Or browse files" (tertiary button, below drop zone)

**Add file button (compact / native-style):**
1. Square or rectangle button with `Plus` icon + optional label
2. Use when a full drop zone isn't appropriate (e.g., inline within a form section)

**File preview card:**
- Square cards in a responsive grid
- Min 120px, max 396px per card
- Shows: image thumbnail or file type badge (PDF, CSV, MP4 with play icon)
- Optional file name below card
- Icon button (✕) in top-right corner to remove
- Overflow button for multiple actions (edit, delete)
- Loading state: oat overlay with spinner centered on card

**File list (alternative to grid):**
- Used for document-type files (PDF, CSV) where a thumbnail isn't useful
- Each row: file icon (24px) + file name + upload progress or ✕ button

**Behaviour:**
- Drag and drop: cursor changes to closed hand on hover, pointer on drop
- Multiple files: all show in queue. Drop zone hides when file limit reached; re-appears if files removed.
- Error: red error text above drop zone. "File's too big to upload. Keep it under 10MB or send a link instead." (see brand.md error patterns)
- Preview: opens in lightbox modal (Dialog component, wide 896px) or bottom sheet on mobile
- Cancel mid-upload: ✕ button on the preview card while spinner is visible

**Responsive grid:**
| Viewport | Columns |
|---|---|
| < 512px | 2 |
| 512px | 4 |
| 768px | 5 |
| 1024px | 7 |
| 1280px | 9 |
| 1440px | 10 |

**Foyer brand adaptations:**
- Drop zone border: 1px dashed oat (not default grey)
- Background: cream
- Border radius: 12px (card-level)
- "Drag and drop files" heading: Geist 600, 16px, ink
- Description: Geist 400, 14px, mauve-grey
- File type badges: slate background, cream text

---

### 4.2 Bulk editing [Adapted from eBay Playbook]

**Purpose:** Enables actions on multiple selected items in a table or list. Appears when at least one item is selected. Use for: bulk delete leads, bulk status update, bulk export.

**Components used:** Checkbox, Table, Button (tertiary), Icon button, Dropdown/overflow menu.

**Anatomy:**
1. Selector + counter — "Select all" checkbox + "[N] selected" label
2. Actions — tertiary buttons or icon buttons for available bulk actions
3. Close — ✕ icon button to exit bulk edit mode

**Behaviour:**
- Bar appears at top of table/section when first checkbox is selected
- Bar replaces or overlays the filter bar
- Bar is sticky — stays fixed at top as user scrolls through list
- Counter updates in real time as selections change
- Close button or deselecting all items exits bulk edit mode
- On responsive/narrow screens: action buttons collapse into "Actions" dropdown or overflow menu

**Actions:**
- Use tertiary button style for all actions in the bar
- Destructive actions (delete): rust text, confirm step required
- Non-destructive: ink text
- Never use primary or secondary button styles in bulk edit bar
- Icon-only buttons acceptable when icon alone is clear; always include tooltip

**Foyer specs:**
- Bar background: cream `#F4EDE4`
- Border: 1px solid oat `#E8DFD2`
- Border radius: 12px (matches card corners)
- Padding: 8px top/bottom, 16px left/right
- Gap between checkbox and counter: 16px
- Gap between action buttons: 8px
- Gap between last action and close button: 8px

**ARIA:** `aria-label="Bulk actions"` on bar. `aria-live="polite"` on counter.

---

### 4.3 Search and filter [Adapted from eBay Playbook + Foyer]

**Purpose:** Helps users refine a list of venues, leads, conversations, or pipeline items. Combines search field with filter chips and optional sort controls.

**Component composition:**
1. Search field (left-aligned, 40px height for inline use)
2. Filter chips (pill chips, horizontally scrollable on mobile)
3. Active filter count badge on filter trigger button
4. Sort/view toggle (segmented button or dropdown)

**Behaviour:**
- Search filters in real time where possible
- Applied filters show as selected filter chips below the search bar
- Each applied filter has a ✕ to remove it individually
- "Clear all" tertiary button appears when any filters are active
- Filter state persists during the session (not across refreshes unless saved)

**Foyer filter bar for venue directory:**
- Row 1: Search field (full width on mobile, 320px on desktop) + optional sort button
- Row 2: Scrollable filter chips (date, capacity, budget, event type)
- Selected chips: clementine background

**Pipeline filter bar:**
- Row 1: Search field + Stage dropdown + Sort
- Row 2: Active filter chips with remove buttons

---

### 4.4 Error handling [Foyer native + Adapted from eBay Playbook]

**Decision guide:**

| Error type | Component |
|---|---|
| Field-level validation | Error helper text below field + rust border |
| Form submission failure | Section notice (error variant) above form |
| Page-level system error | Page notice (error variant) |
| Action failure (non-blocking) | Toast (error variant) |
| High-priority blocking error | Dialog (Alert type) |
| Multi-step flow blocked | Progress stepper blocked state + section notice |

**Copy rules (from brand.md):** Pattern is "what happened + what to do". No blame, no jargon, no over-apology.

| Error | Copy |
|---|---|
| Form didn't submit | "That didn't go through. Try again, or send the details to clem@findfoyer.com." |
| Network error | "Lost the connection. Refresh and we'll pick up where we left off." |
| File too large | "File's too big to upload. Keep it under 10MB or send a link instead." |
| Authentication failed | "Couldn't sign you in. Check the email and try again." |
| Venue unavailable | "That space is booked for [date]. Want to see similar options, or pick a different date?" |

---

### 4.5 Empty states [Foyer native]

**Copy:** See `docs/brand.md` → Empty states for all copy patterns.

**Pattern:** What's empty + what's coming + one forward action.

**Visual pattern:**
- Centred vertically and horizontally in the available space
- Optional: 48px line-style icon, mauve-grey (don't use filled icons for empty states)
- Heading: Geist 600, 20px, ink
- Body: Geist 400, 16px, mauve-grey
- CTA: one primary or secondary button if there's a useful forward action

**Do not:** Animate empty states. Use emoji or illustrations. Put multiple CTAs.

---

### 4.6 Loading states [Foyer native]

See `docs/design.md` → Loading and skeleton states for full spec.

**Decision guide:**

| Situation | Pattern |
|---|---|
| Page data fetching | Skeleton (150ms delay before showing) |
| Action-triggered operation | Spinner inside button (1000ms delay) |
| Long-running operation (5s+) | Full spinner with progress messaging |
| Page navigation | Thin progress bar at top of viewport (clementine, 2px) |

---

## 5. Email design system [Foyer native]

See `docs/design.md` → Email design system for full spec (inline styles, colour application, CTA template, typography fallbacks, Clem sign-off block).

---

## 6. Print styles [Foyer native]

See `docs/design.md` → Print styles for full spec (proposals, BEOs, @media print rules).

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-05-03 | Initial Foyer Design System. Synthesized from docs/design.md + docs/brand.md + eBay Playbook (Evo). Added: Accordion, Avatar (extended), Badge, Breadcrumb, Combobox, Date picker, Divider, Notice system (page/section/inline), Pagination, Popover, Progress stepper, Search field, Segmented button, Tab, Text link, Tooltip, Table (full spec with density + cell types + bulk editing). Added patterns: File uploading, Bulk editing, Search and filter, Error handling (decision guide). All eBay colours replaced with Foyer palette throughout. eBay corporate tone replaced with Foyer warm editorial voice. |
