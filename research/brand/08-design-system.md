# Cursor India — Design System

> Phase 7 deliverable.
> Inputs: brand audit (§1), template audit (§2), comparison matrix (§3), external inspiration (§4), strategy (§5), IA (§6).

This document is the **design contract** for implementation. It is opinionated by design.

---

## 1. Design Principles

1. **Calm over clever.** No effect for its own sake.
2. **Specific over slick.** Real photos, real venues, real numbers.
3. **Type-led, image-supported.** Words carry the brand; images carry the proof.
4. **Restraint is the brand.** One accent, one motion language, one type stack.
5. **Mobile parity is non-negotiable.** A meetup poster lives in WhatsApp; the link opens our site.
6. **Accessibility is not a feature.** WCAG 2.2 AA baseline, always.
7. **Performance is part of design.** A slow site is a low-trust site.

---

## 2. Brand Foundations

### 2.1 Wordmark

- **"Cursor India"** in primary type, with a small **"community"** eyebrow in monospace below.
- The Cursor logomark is *not* re-used (avoid brand confusion). A custom monogram **`⌘ CI`** or simply the wordmark is used.
- Logomark proposal: an outlined arrow-pointer cursor with a subtle India-coastline glyph integrated into the negative space. Reserve for future iteration; not a launch blocker.

### 2.2 Naming usage

- "Cursor India" — full name, in titles and copy.
- "cursorindia" — handle on socials, lowercase.
- "the community" — informal reference in body copy.
- Never "Cursor®" with the registered mark — that's Anysphere's mark.

---

## 3. Color System

### 3.1 Tokens

| Token | Value (dark) | Value (light) | Purpose |
|---|---|---|---|
| `--bg-base` | `#0A0A0B` | `#FAFAFA` | Page background |
| `--bg-surface` | `#101012` | `#FFFFFF` | Card / surface |
| `--bg-elevated` | `#16161A` | `#F4F4F5` | Hover / elevated card |
| `--bg-inverse` | `#FAFAFA` | `#0A0A0B` | Reverse-callout |
| `--text-primary` | `#F5F5F5` | `#0A0A0B` | Body |
| `--text-secondary` | `#A1A1AA` | `#52525B` | Muted body |
| `--text-tertiary` | `#71717A` | `#71717A` | Captions, eyebrows |
| `--text-inverse` | `#0A0A0B` | `#FAFAFA` | On inverse surfaces |
| `--border-subtle` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.06)` | 1-px hairlines |
| `--border-strong` | `rgba(255,255,255,0.16)` | `rgba(0,0,0,0.12)` | Focused borders |
| `--accent` | `#E68A2E` (warm marigold) | `#C26F12` | Single accent |
| `--accent-soft` | `rgba(230,138,46,0.12)` | `rgba(194,111,18,0.10)` | Accent surface tint |
| `--success` | `#22C55E` | `#16A34A` | Status: live / open |
| `--warning` | `#EAB308` | `#CA8A04` | Status: capacity warning |
| `--danger` | `#EF4444` | `#DC2626` | Status: cancelled |

### 3.2 Accent rationale

A **single warm marigold** (`#E68A2E`) is the only color outside the neutral system. Reasoning:

- Reads as **Indian** without being a flag color (saffron is too literal and politically loaded).
- Pairs cleanly with both dark and light themes.
- High contrast against dark backgrounds — good for the primary CTA.
- Distinct from Cursor's own product UI (which leans toward cooler accents) — *we are clearly Cursor India, not Cursor*.

If the founding team prefers, an alternate is **teal `#14B8A6`** (matches Cursor.com's occasional teal accents). Marigold is the recommendation; teal is the fallback.

### 3.3 Usage rules

- **One accent per page maximum.** Multiple competing accent colors are an anti-pattern.
- **Backgrounds are always neutral.** Accent only on CTAs, badges, links, and a few decorative dots.
- **Status colors** (success/warning/danger) are for status only — never decorative.
- **No gradients in the brand chrome.** Single subtle gradient permitted in the hero (very low contrast, vertical only).

### 3.4 Default theme

Dark by default (matches Cursor canon and the dominant ambassador-template default). Light theme switch in user menu / footer. Theme respects `prefers-color-scheme` initially; user toggle persists in `localStorage`.

---

## 4. Typography

### 4.1 Type stack

```
--font-sans: "Geist", "Inter Variable", ui-sans-serif, system-ui, sans-serif;
--font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, monospace;
--font-display: "Geist", "Inter Variable", sans-serif;  // same as sans, distinct weight axis
```

- **Geist** (Vercel) is the primary recommendation — matches the Cursor visual register, free, well-supported.
- **Inter Variable** is the fallback — universally available, excellent multilingual coverage.
- **Geist Mono** for code blocks, terminal-style CTAs, and tabular data.
- Devanagari, Tamil, Bengali, Telugu fallback: **Noto Sans (variable)** for each script when vernacular launches.

### 4.2 Type scale (16 px base)

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `text-display-2xl` | 96/clamp(64,8vw,96) px | 1.0 | 600 | Marketing hero (rare) |
| `text-display-xl` | 72/clamp(48,6vw,72) px | 1.05 | 600 | Section openers |
| `text-display-lg` | 56/clamp(40,5vw,56) px | 1.1 | 600 | Major sections |
| `text-h1` | 40 px | 1.15 | 600 | Page H1 |
| `text-h2` | 32 px | 1.2 | 600 | Section H2 |
| `text-h3` | 24 px | 1.25 | 600 | Section H3 |
| `text-h4` | 20 px | 1.3 | 600 | Card titles |
| `text-h5` | 18 px | 1.4 | 500 | Sub-card titles |
| `text-body-lg` | 18 px | 1.6 | 400 | Lead paragraphs |
| `text-body` | 16 px | 1.6 | 400 | Default body |
| `text-body-sm` | 14 px | 1.55 | 400 | Secondary body |
| `text-caption` | 12 px | 1.4 | 500 | Captions |
| `text-eyebrow` | 12 px | 1.0 | 600 | Uppercase eyebrow, +0.08em letter-spacing |
| `text-mono-sm` | 13 px | 1.5 | 400 | Code, dates, badges |

### 4.3 Type rules

- **Headings are 600 weight.** Never 700 (too heavy for the calm brand).
- **Body is 400 weight, 16 px, 1.6 line height.** Never tighter than 1.5.
- **Numerals are tabular** in metric strips and event card data (`font-variant-numeric: tabular-nums`).
- **Letter-spacing:** `-0.01em` for display sizes, `0` for body, `+0.08em` for eyebrows.
- **Max measure:** 65ch for body, 30–40ch for headings.

---

## 5. Spacing & Layout

### 5.1 Spacing scale (Tailwind-aligned)

```
0, 1 (4px), 2 (8px), 3 (12px), 4 (16px), 5 (20px), 6 (24px), 8 (32px),
10 (40px), 12 (48px), 16 (64px), 20 (80px), 24 (96px), 32 (128px), 40 (160px)
```

### 5.2 Vertical rhythm

- Between sections: **96 px** desktop, **64 px** mobile.
- Between section heading and content: **40 px** desktop, **24 px** mobile.
- Between cards in a grid: **24 px** desktop, **16 px** mobile.
- Between text blocks: **16 px**.

### 5.3 Grid

- **12-column grid** on `>= md` breakpoint, **4-column** on `sm`, **2-column** on `xs`.
- **Container widths:**
  - `--container-narrow`: 720 px (long-form reading: blog, event detail)
  - `--container-default`: 1152 px (most pages)
  - `--container-wide`: 1440 px (homepage with bento grid)
- **Gutters:** 24 px desktop, 16 px mobile.

### 5.4 Breakpoints

```
xs:   0 – 479 px       (phone portrait)
sm:   480 – 767 px     (phone landscape / small tablet)
md:   768 – 1023 px    (tablet)
lg:   1024 – 1279 px   (laptop)
xl:   1280 – 1535 px   (desktop)
2xl:  1536 px +        (large desktop)
```

### 5.5 Border radii

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6 px | Badges, small chips |
| `--radius-md` | 10 px | Buttons, inputs |
| `--radius-lg` | 14 px | Cards |
| `--radius-xl` | 20 px | Hero panels, featured cards |
| `--radius-full` | 9999 px | Pills, avatars |

---

## 6. Component Inventory

### 6.1 Foundation primitives

- **Box / Stack / Inline** (flex helpers — only if not using Tailwind utilities directly)
- **Heading** (typographic primitive, polymorphic h1–h6)
- **Text** (typographic body primitive)
- **Link** (next/link wrapper with arrow `→` suffix variant)
- **Icon** (Lucide wrapper, default 16 px, accepts size/strokeWidth)
- **Image** (next/image wrapper with default sizes + lazy)
- **Container** (3 variants: narrow / default / wide)

### 6.2 Form primitives

- Button (variants: primary / secondary / ghost / link; sizes: sm / md / lg)
- IconButton
- Input (text, email)
- Textarea
- Select (Radix Select wrapper)
- Combobox (Radix + cmdk)
- Checkbox
- RadioGroup
- Switch
- Field (label + input + helper + error wrapper)
- Form (react-hook-form context wrapper with zod resolver)

### 6.3 Display primitives

- Badge (variants: default / archetype / status; with optional icon)
- Avatar (rounded, with initials fallback)
- AvatarGroup (stacked avatars)
- Card (variants: surface / elevated / outline)
- Skeleton (loading placeholder)
- Tooltip (Radix)
- Popover (Radix)
- DropdownMenu (Radix)
- Dialog (Radix)
- Sheet / Drawer (Radix Dialog with slide animation)
- Tabs (Radix)
- Accordion (Radix)
- Toast (sonner)
- Separator
- KbdShortcut (`⌘K` style)
- CodeBlock (with syntax highlighting via Shiki)

### 6.4 Compound / domain components

- **NavBar** (top nav with mobile drawer)
- **Footer** (4-column, see IA §3.3)
- **Hero** (with bento grid sub-component)
- **BentoGrid** (4×4 deterministic, mirrors ambassador template)
- **StatStrip** (4–6 metric items)
- **CountdownTimer** (event detail + hero — Kenya inspiration)
- **EventCard** (compact + expanded variants)
- **EventCardSkeleton**
- **EventFilters** (city + archetype + audience + date)
- **EventList** (with grouping by date)
- **EventCalendar** (month view, optional)
- **EventMap** (lazy-loaded map of city markers)
- **EventDetailHero** (event detail page hero)
- **ChapterCard**
- **ChapterMap** (interactive India map)
- **CityHero** (chapter detail hero)
- **AmbassadorCard** (compact + expanded variants)
- **AmbassadorGrid**
- **AmbassadorProfile** (full profile composition)
- **VolunteerStrip** (smaller cards for volunteer team)
- **ProjectCard** (with status badge)
- **ProjectGrid**
- **AudienceSelectPanel** (the 6-persona homepage panel)
- **RoundupCard**
- **RoundupHero** (per-month roundup)
- **PartnerLogoGrid** (4–6 column logo strip)
- **PartnerTierCard**
- **CTABanner** (full-width call to action; rare use)
- **JoinPanel** (Discord, WhatsApp, Telegram, Newsletter)
- **NewsletterForm**
- **ApplyForm** (ambassador / campus / partner intake — composed from form primitives)
- **MdxComponents** (set of overrides for MDX rendering — Heading, Text, Image, CodeBlock, Callout)
- **Callout** (info / warning / success variants — used in playbook + recap MDX)
- **Search** (Cmd+K palette, Pagefind-backed)
- **TableOfContents** (sticky right-rail for long-form pages)
- **PhotoGallery** (lazy-loaded image grid with lightbox)
- **VideoEmbed** (lazy-loaded YouTube placeholder)
- **LumaEmbed** (lazy-loaded RSVP iframe)
- **DisambiguationNote** (the canonical "we are not Cursor Inc." block)

### 6.5 Layout components

- **PageHeader** (breadcrumb + title + lede + actions)
- **SectionHeader** (eyebrow + heading + subhead)
- **TwoColumn** (article + sidebar)
- **Prose** (MDX wrapper for long-form)
- **DateChip** (formatted IST date + time)

---

## 7. Component Behavior Specs

### 7.1 Button

- **Primary:** filled accent, white text, 12px Y / 20px X padding, radius-md, font-weight 500, hover slight darken, focus ring 2px accent-soft.
- **Secondary:** transparent fill, border-strong, primary text, hover bg-elevated.
- **Ghost:** no border, transparent fill, hover bg-elevated.
- **Link:** inline, accent text, hover underline. Trailing `→` arrow optional.
- All buttons: 44×44 min hit area on mobile (a11y).

### 7.2 EventCard (compact)

Anatomy:
```
[ Archetype Badge ]   [ Date · IST ]
[ TITLE                          ]
[ City · Venue · Capacity        ]
[ Hosts strip (avatars + names)  ]
[ "Register on Luma →" link      ]
```

Hover: card translates Y -2px, border-strong, no shadow.

### 7.3 AmbassadorCard (compact)

```
[ Avatar 80x80 ]
[ Name                  ]
[ Role · City           ]
[ One-line bio          ]
[ Social icons strip    ]
```

### 7.4 BentoGrid (hero)

- 4×4 deterministic grid (inherits ambassador-template approach).
- Each tile: lazy-loaded image with aspect-ratio container to prevent CLS.
- Mobile: collapses to 2×N stacked grid with `mobile.row/col` override.
- Each tile has alt text mandatory.
- Tile hover: subtle scale 1.02, no overlay text.

### 7.5 ChapterMap

- India outline SVG with state borders subtle.
- City markers: 8 px filled circle, accent color.
- On hover/focus: marker grows to 12 px + chapter name pill appears.
- On click: navigates to `/chapters/<city>`.
- Lazy-loaded (mounted on visibility).
- Mobile fallback: vertical list of cities with marker icons.

### 7.6 CountdownTimer

- Format: `02d 14h 32m 11s` on desktop, `2d 14h 32m` on mobile.
- IST-labelled below.
- Updates every 1s with `requestAnimationFrame` throttle.
- After event start: replaced by "Happening now" badge.
- After event end: replaced by "Recap coming soon" link.

### 7.7 Search (Cmd+K)

- Triggered by `Cmd+K` / `Ctrl+K` from anywhere.
- Modal dialog, focus-trapped, escape closes.
- Pagefind-backed index.
- Results grouped by entity (Events / Chapters / Ambassadors / Projects / Resources / Blog).
- Recent searches stored locally.

---

## 8. Motion

### 8.1 Motion principles

1. Motion **signals interactivity** (hover, focus, state change). Not decoration.
2. **Sub-300ms** for any UI animation.
3. **Easing:** `cubic-bezier(0.2, 0.8, 0.2, 1)` (Apple-ish "ease-out-expo-like").
4. **Reduced-motion**: all animations replaced with instant transitions when `prefers-reduced-motion: reduce`.

### 8.2 Motion tokens

| Token | Value | Use |
|---|---|---|
| `--motion-instant` | 0ms | When reduced motion |
| `--motion-fast` | 120ms | Hovers, focus |
| `--motion-base` | 200ms | Most transitions |
| `--motion-slow` | 320ms | Modal/drawer enter |
| `--ease-default` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Default |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exits |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enters |

### 8.3 Specific motion patterns

- **Card hover:** translate-Y -2 px in 120 ms.
- **Page enter:** fade + 8 px translate-Y in 200 ms.
- **Modal:** fade + 8 px scale-up from 0.98 in 320 ms.
- **Drawer:** translate-X 100% to 0 in 280 ms.
- **Toast:** slide-up from bottom in 200 ms.
- **Skeleton:** subtle shimmer at 1.6s cycle.

No parallax. No marquee. No autoplay video.

---

## 9. Iconography

- **Lucide** is the icon library (open, MIT, free).
- Default stroke 1.5, size 16 px in dense contexts, 20 px in buttons, 24 px in feature blocks.
- Limited custom icon set for:
  - Cursor mark (cursor pointer) — used in disambiguation notes only.
  - India outline (used in `ChapterMap` only).
  - Cafe / Workshop / Meetup / Hackathon — Lucide picks: `coffee`, `presentation`, `users`, `code-2` (consistent set).

---

## 10. Accessibility Tokens & Rules

- **Focus ring:** 2 px solid `--accent`, 2 px offset, on any focusable element. Always visible.
- **Skip link:** `Skip to content` link as first child of `<body>`, becomes visible on focus.
- **Contrast minimums:**
  - Body text: 7:1 against background (AAA).
  - Large text: 4.5:1.
  - UI components: 3:1.
- **Touch targets:** 44×44 px minimum.
- **Lang attributes:** `<html lang="en">`; per-locale switch updates `lang`.
- **Alt text:** mandatory on all `Image` components — build fails if missing.
- **ARIA on bento grid:** `role="list"` on grid, `role="listitem"` on tiles.
- **Heading order:** h1 once per page; no level skips.

---

## 11. Tokens (final summary, copy-paste ready)

### CSS variables (dark default)

```css
:root {
  --bg-base: #0A0A0B;
  --bg-surface: #101012;
  --bg-elevated: #16161A;
  --bg-inverse: #FAFAFA;

  --text-primary: #F5F5F5;
  --text-secondary: #A1A1AA;
  --text-tertiary: #71717A;
  --text-inverse: #0A0A0B;

  --border-subtle: rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.16);

  --accent: #E68A2E;
  --accent-soft: rgba(230,138,46,0.12);

  --success: #22C55E;
  --warning: #EAB308;
  --danger: #EF4444;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  --container-narrow: 720px;
  --container-default: 1152px;
  --container-wide: 1440px;

  --motion-instant: 0ms;
  --motion-fast: 120ms;
  --motion-base: 200ms;
  --motion-slow: 320ms;
  --ease-default: cubic-bezier(0.2, 0.8, 0.2, 1);
}

[data-theme="light"] {
  --bg-base: #FAFAFA;
  --bg-surface: #FFFFFF;
  --bg-elevated: #F4F4F5;
  --bg-inverse: #0A0A0B;

  --text-primary: #0A0A0B;
  --text-secondary: #52525B;
  --text-tertiary: #71717A;
  --text-inverse: #FAFAFA;

  --border-subtle: rgba(0,0,0,0.06);
  --border-strong: rgba(0,0,0,0.12);

  --accent: #C26F12;
  --accent-soft: rgba(194,111,18,0.10);

  --success: #16A34A;
  --warning: #CA8A04;
  --danger: #DC2626;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-base: 0ms;
    --motion-slow: 0ms;
  }
}
```

---

## 12. Mobile Responsiveness — Per-Component Rules

| Component | Mobile (xs–sm) | Tablet (md) | Desktop (lg+) |
|---|---|---|---|
| NavBar | Hamburger; sticky | Horizontal | Horizontal |
| Hero | Stacked text + 2×N bento | 2-col | Full bento 4×4 |
| StatStrip | 2×2 grid | 4 in row | 4 in row |
| EventCard | Full-width stacked | 2-col | 3-col |
| ChapterMap | Vertical list fallback | Map + list | Map + list side-by-side |
| AmbassadorGrid | 2-col | 3-col | 4-col |
| AudienceSelectPanel | Vertical accordion | 2×3 grid | 6-col strip |
| RoundupCard | Full | 2-col | 3-col |
| PartnerLogoGrid | 3-col | 4-col | 6-col |
| Footer | Stacked sections | 2-col | 4-col |
| Search | Full-screen modal | Centered modal | Centered modal |

---

## 13. Photography & Imagery Guidelines

- **Real event photos only.** No stock.
- **Authorized people only.** Get consent for ambassador photos (default: shoulder-up, smiling, neutral background).
- **Photo style:**
  - Warm color grading (slightly).
  - Wide angle preferred for "scene of the room".
  - Close-up preferred for "person speaking".
  - Avoid: stiff posed group shots; selfie-quality phone shots in hero (acceptable in galleries, not hero).
- **Aspect ratios:**
  - Hero photos: 4:3 or 1:1.
  - Recap thumbnails: 16:9.
  - Ambassador portraits: 1:1.
- **Image processing:** AVIF + WebP via `next/image`; max 200 KB above-the-fold; lazy below.
- **OG images:** Dynamic generation via `@vercel/og`. Template: title + city + date + Cursor India wordmark. 1200×630.

---

## 14. Design System Implementation Priority

For the build phase, components should be implemented in this order (P0 = launch blocker):

| Priority | Components |
|---|---|
| P0 | Box, Stack, Heading, Text, Link, Icon, Image, Container, Button, NavBar, Footer, Hero (with BentoGrid), StatStrip, EventCard, EventList, AmbassadorCard, AmbassadorGrid, ChapterCard, ProjectCard, NewsletterForm, JoinPanel, DisambiguationNote, AudienceSelectPanel |
| P1 | EventDetailHero, EventFilters, EventMap (basic), ChapterMap, CityHero, AmbassadorProfile, ProjectGrid, RoundupCard, PartnerLogoGrid, Form (with all primitives), ApplyForm, MdxComponents, Prose, Search (Cmd+K), VideoEmbed, LumaEmbed |
| P2 | CountdownTimer, EventCalendar, VolunteerStrip, RoundupHero, PartnerTierCard, PhotoGallery, TableOfContents, Tooltip, Popover, Dialog, Sheet, Tabs, Accordion, Toast, KbdShortcut, CodeBlock, Callout, DateChip |
| P3 | Theme switcher, language switcher, advanced search filters, project submission flow UI, partner intake form UI |

---

## 15. Design Hand-off Artifacts

The design phase should produce:
1. **Figma file** with all P0 + P1 components in light and dark themes.
2. **Component documentation site** (Storybook) once components are built.
3. **OG image Figma template** for `@vercel/og` rendering.
4. **Photography brief** for ambassador photographers (1 page).
5. **Brand assets pack**: wordmark SVG, color tokens JSON, type spec PDF.
6. **Code of Conduct** PDF + on-site page.
