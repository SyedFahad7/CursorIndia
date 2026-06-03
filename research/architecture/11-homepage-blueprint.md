# Cursor India — Homepage Blueprint

> Deliverable #8. Section-by-section blueprint for the homepage, derived from `/research/wireframes/10-wireframes.md` and `/research/brand/08-design-system.md`.
>
> This document is the **implementation contract** for the homepage. Every section here has: purpose, content model, components used, accessibility notes, performance notes, and copy seed.

---

## Global Layout

- **Container:** `--container-wide` (1440 px max).
- **Section spacing:** 96 px vertical (desktop), 64 px (mobile).
- **Background:** `--bg-base` (dark).
- **Above-the-fold target:** Hero + StatStrip fit within 100 vh on a 1440×900 display.
- **CLS target:** 0.
- **LCP target:** ≤ 2.0 s.

---

## Section 01 — Hero

**Purpose:** Establish identity in <1 second. Drive primary action (events) or secondary (join).

**Components used:** `Container`, `Heading`, `Text`, `Button` (primary + secondary), `BentoGrid`, eyebrow `Text`.

**Layout:**
- Two-column on `lg+`: left 60% text, right 40% bento.
- One-column on `<lg`: text above, 2×N bento below.

**Content model:**
```ts
type HeroContent = {
  eyebrow: string;            // "COMMUNITY"
  heading: string;            // "Build with Cursor in India."
  subhead: string;            // 2-line description
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  bento: BentoTile[];         // 6–8 tiles
};
```

**Copy seed:**
- Eyebrow: `COMMUNITY`
- Heading: `Build with Cursor in India.`
- Subhead: `The community of developers, students, founders, and OSS contributors across India who build with AI every day.`
- Primary CTA: `Explore events →` → `/events`
- Secondary CTA: `Join the community →` → `/join`

**Accessibility:**
- `<h1>` is the heading (one per page).
- Bento tiles are `<ul role="list">` with `<li>` items, each with `<img alt>` mandatory.
- CTAs are `<a>` with descriptive text (not "click here").

**Performance:**
- Bento images served as AVIF, eager-load (above the fold), `next/image` with explicit width/height to prevent CLS.
- Total weight of hero images ≤ 250 KB combined.

---

## Section 02 — Stat Strip

**Purpose:** Empirical social proof. Anchor the community's real scale.

**Components used:** `Container`, `Stack`, custom `StatItem` (number + label).

**Content model:**
```ts
type StatStripContent = {
  items: { value: string; label: string; }[];
};
```

**Copy seed (replace with real numbers at launch):**
```
12 chapters    ·    30 ambassadors    ·    150 events    ·    12k members
```

**Rules:**
- Use real numbers only. If a number is < 5, omit that stat.
- Tabular numerals (`font-variant-numeric: tabular-nums`).
- Mid-dots as separators on desktop; vertical stack on mobile.

**Accessibility:**
- Section role: `region` with `aria-label="Community statistics"`.

---

## Section 03 — Next Event (with Countdown)

**Purpose:** Drive the primary RSVP. The single most important CTA on the page.

**Components used:** `Container`, `Card` (elevated), `Badge` (archetype), `CountdownTimer`, `Heading`, `Text`, `Button`, `Link`.

**Content model:**
```ts
type NextEventContent = {
  event: Event;  // typed event entity
};
```

**Behavior:**
- Pulls the next chronological event with `status === 'upcoming'`.
- If no upcoming event: section hides entirely (anti-pattern: never show "No upcoming events").
- Countdown updates client-side after hydration (initial render shows formatted "Sat, 12 Jul 2026 · 4 pm IST" as fallback).
- After event starts, countdown becomes "Happening now" badge (server-revalidated every 60s via ISR).
- After event ends, this section is replaced with the next upcoming event.

**Copy seed:**
- Badge: `[WORKSHOP]`
- Title: `Cursor for Production Teams`
- Meta: `Sat, 12 Jul 2026 · 4 pm IST · ATL Workspace, Indiranagar, Bengaluru`
- Primary CTA: `Register on Luma →`
- Secondary CTA: `Event details →` (links to `/events/[slug]`)

**Accessibility:**
- Countdown has `aria-live="polite"` and announces only when significant time elapses (every minute, not every second).
- Reduced-motion users see a static formatted date.

---

## Section 04 — Upcoming Events

**Purpose:** Show that the community has consistent rhythm and breadth across India.

**Components used:** `Container`, `SectionHeader`, `EventCard` (compact) × 3, `Link` (footer link).

**Content model:**
- Next 3 events (excluding the one in Section 03), sorted by date asc.

**Layout:**
- 3-column grid on `lg+`, 2 on `md`, 1 on `<md`.
- Section ends with `[All events →]` link.

**Copy seed:**
- Eyebrow: `WHAT'S NEXT`
- Heading: `Upcoming events across India`
- Subhead: `Cafe Cursor, workshops, meetups, and hackathons in your city.`

**Performance:**
- Event card photos lazy-loaded (below fold).

---

## Section 05 — Chapters Map

**Purpose:** Make Cursor India's geographic scale tangible. Drive cross-city discovery.

**Components used:** `Container`, `ChapterMap` (lazy-loaded), `ChapterList`.

**Content model:**
```ts
type ChapterContent = {
  chapters: { city: string; lead: string; slug: string; status: 'active' | 'forming'; coords: [number, number] }[];
};
```

**Behavior:**
- Map is lazy-loaded on visibility (IntersectionObserver, 200 px margin).
- Active chapters: filled marker. Forming chapters: outlined marker.
- Hover a marker: chapter name pill appears.
- Click a marker: navigate to `/chapters/[city]`.
- Mobile: map collapses to a vertical city list with marker dots; the map asset is not loaded on `<md`.

**Copy seed:**
- Eyebrow: `CITIES`
- Heading: `Cursor India is in 12 cities. Yours next.`
- Subhead: `Each chapter is community-led, by builders who live there.`
- Sidebar CTA: `[Start a chapter in your city →]` → `/chapters/start-a-chapter`

**Accessibility:**
- Map has a text-equivalent (the chapter list is rendered as `<ul>` always; on `<md` it replaces the map entirely).
- Markers are keyboard-focusable in tab order with `aria-label="Chapter: [city]"`.

**Performance:**
- India outline SVG inlined (small).
- Map JS module loaded only when visible.

---

## Section 06 — Featured Projects

**Purpose:** Surface community *output*, not just events. Magnet for builders.

**Components used:** `Container`, `SectionHeader`, `ProjectCard` × 3.

**Content model:**
- Up to 6 featured projects (Featured by editor), pick 3 randomly per render OR rotate weekly.

**Layout:**
- 3-column grid on `lg+`.

**Copy seed:**
- Eyebrow: `BUILT IN INDIA`
- Heading: `Projects from the community`
- Subhead: `Things our members built with Cursor — open-sourced, shipped, and showcased.`
- Section footer link: `[Open the showcase →]`

---

## Section 07 — Ambassadors Strip

**Purpose:** Real faces, real cities. Trust by association.

**Components used:** `Container`, `SectionHeader`, `AmbassadorCard` (compact) × 8, horizontal scroll on mobile.

**Layout:**
- 8 cards in a row on `xl`, 6 on `lg`, 4 on `md`, horizontal-scroll snap on `<md`.

**Copy seed:**
- Eyebrow: `THE TEAM`
- Heading: `Volunteer-led, city by city`
- Subhead: `Cursor India is run by ambassadors who build with Cursor every day. Some of them are here.`
- Section footer link: `[Meet all ambassadors →]` → `/ambassadors`

---

## Section 08 — Audience Self-Select Panel

**Purpose:** Route each persona to their journey within 5 seconds of arriving.

**Components used:** `Container`, `SectionHeader`, `AudienceCard` × 6.

**Content model:**
```ts
type AudienceCard = {
  persona: 'working-devs' | 'students' | 'indie-hackers' | 'founders' | 'oss-contributors' | 'organizers';
  heading: string;
  subhead: string;
  href: string;
};
```

**Layout:**
- 6-up on `xl`, 3×2 on `lg`, 2×3 on `md`, 1×6 vertical on `<md`.

**Copy seed (one card example):**
- Heading: `Working developers`
- Subhead: `Join a meetup in your city. Bring what you're shipping.`
- Href: `/audiences/working-devs` (or anchor to `/events?audience=working-devs`)

(Repeat for Students → `/campus`, Indie hackers → `/showcase`, Founders → `/founders`, OSS contributors → `/showcase?category=oss`, Organizers → `/ambassadors/apply`.)

**Accessibility:**
- Each card is a single `<a>` link (block-level anchor); icon + heading + subhead nested.

---

## Section 09 — Latest Roundup

**Purpose:** Showcase content rhythm. The monthly digest is the community's heartbeat.

**Components used:** `Container`, `RoundupCard` (compact).

**Content model:**
- Most recent roundup post.

**Behavior:**
- If no roundup yet (pre-launch + first 30 days), this section is hidden.

**Copy seed:**
- Title: `[Month] [Year] roundup`
- Stats line: `14 events · 380 attendees · 6 new ambassadors · 8 new projects`
- CTA: `[Read the roundup →]`

---

## Section 10 — Talks & Videos

**Purpose:** Long-tail SEO and onboarding. Talks are evergreen.

**Components used:** `Container`, `SectionHeader`, `VideoEmbed` (placeholder) × 3.

**Behavior:**
- Each video is rendered as a YouTube **placeholder image** (a clickable thumbnail). The YouTube iframe loads only on click (saves ~500 KB per embed in initial payload).
- Each card shows: thumbnail, play overlay, talk title, speaker name, city.

**Copy seed:**
- Eyebrow: `FROM THE COMMUNITY`
- Heading: `Recent talks`
- Subhead: `From hackathons, workshops, and meetups across India.`
- Section footer link: `[All talks →]` → `/resources/talks`

---

## Section 11 — Resources Teaser

**Purpose:** Onboarding ramp. The "I'm new here, how do I start?" lane.

**Components used:** `Container`, `SectionHeader`, `ResourceTile` × 4.

**Tiles:**
1. Getting started with Cursor → `/resources/getting-started`
2. Advanced workflows → `/resources/workflows`
3. Hackathon kit → `/resources/hackathon-kit`
4. Vernacular guides → `/resources/vernacular`

---

## Section 12 — Partner Ecosystem Strip

**Purpose:** Credibility. "These places host us, these companies support us."

**Components used:** `Container`, `PartnerLogoGrid` (6–8 logos), `Link`.

**Behavior:**
- Logo strip is monochrome by default, color on hover.
- Click logo: opens `/partners/<slug>` (or external URL with `rel="noopener"`).
- Section footer link: `[See all partners → / Become a partner →]`

---

## Section 13 — Manifesto

**Purpose:** Brand depth. The "why we exist" passage that converts curious visitors into believers.

**Components used:** `Container` (narrow), `Prose` (long-form text), signature.

**Copy seed (final manifesto):**
```
We started Cursor India because Indian developers deserve a place to gather
and build with AI — together. We are volunteer-led. We name our venues, our
partners, and our people, because specificity is the point. We are city-led;
the Bengaluru chapter looks different from the Kolkata chapter, and that is
exactly the idea. We treat our ambassadors as the product. We are
vernacular-friendly because India is multilingual. We document everything,
because the next ambassador starts where we ended. And we do not chase
vanity.

— The founding ambassadors of Cursor India
```

**Layout:**
- Centered, narrow column (720 px max).
- Larger body text size (`text-body-lg` 18 px).
- Signature in eyebrow size.

---

## Section 14 — Newsletter Capture

**Purpose:** Own a direct channel to subscribers. Independent of any platform.

**Components used:** `Container`, `NewsletterForm`.

**Content model:**
```ts
type NewsletterForm = {
  emailLabel: string;        // "Email"
  buttonLabel: string;       // "Subscribe →"
  privacyNote: string;       // "One email a month. The monthly roundup. No spam."
  successMessage: string;    // "Welcome. Check your inbox to confirm."
};
```

**Behavior:**
- Submits to Buttondown (or Resend) via a server action.
- Confirmation page at `/newsletter/confirmed`.
- Honeypot field for spam mitigation.
- No reCAPTCHA (privacy-respecting).

**Copy seed:**
- Heading: `The Cursor India newsletter`
- Subhead: `One email a month. The monthly roundup. No spam.`
- Form: `[Email]  [Subscribe →]`

---

## Section 15 — Disambiguation Note

**Purpose:** Critical brand safety. Avoid confusion with Cursor Inc. and other "Cursor" branded products.

**Components used:** `Container`, `DisambiguationNote`.

**Copy seed:**
```
We are not Cursor Inc. or Anysphere. Cursor India is a volunteer community
of Cursor users in India. For the official Cursor product, visit cursor.com.
```

**Layout:**
- Small, low-contrast, centered. Permanently visible, never hidden.

---

## Section 16 — Global Footer

Per `/research/architecture/07-sitemap-and-information-architecture.md §3.3`.

---

## Page-Level Metadata

```html
<title>Cursor India — Build with Cursor across India</title>
<meta name="description" content="The community of developers, students, founders, and OSS contributors across India who build with Cursor every day. Cafe Cursor, workshops, meetups, and hackathons across 12 cities.">
<meta property="og:title" content="Cursor India — Build with Cursor across India">
<meta property="og:description" content="Cafe Cursor, workshops, meetups, and hackathons across 12 cities.">
<meta property="og:image" content="https://cursorindia.dev/api/og?path=/">
<meta property="og:type" content="website">
<link rel="canonical" href="https://cursorindia.dev/">
<link rel="alternate" type="application/rss+xml" title="Cursor India Blog" href="/blog/rss.xml">
<link rel="alternate" type="text/calendar" title="Cursor India Events" href="/events.ics">
```

Plus `schema.org/Organization` JSON-LD with `sameAs` links to all socials.

---

## Performance Budget for the Homepage

| Metric | Target |
|---|---:|
| LCP | ≤ 2.0 s on 4G mid-tier device |
| FID / INP | INP ≤ 200 ms |
| CLS | 0 |
| Total page weight (initial) | ≤ 800 KB |
| Total page weight (full inc. lazy) | ≤ 2.5 MB |
| JS bundle (initial) | ≤ 120 KB gzipped |
| Image weight above fold | ≤ 250 KB |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | ≥ 100 |
| Lighthouse Best Practices | ≥ 95 |

---

## Build Order Recommendation

Build the homepage in this order to keep the site shippable at each milestone:

1. **MVP-1 (Week 1):** Hero, StatStrip, Upcoming Events, Footer, Disambiguation.
2. **MVP-2 (Week 2):** Next Event with countdown, Ambassadors strip, Manifesto, Newsletter.
3. **MVP-3 (Week 3):** Chapters Map, Audience Self-Select, Resources teaser, Partners.
4. **MVP-4 (Week 4):** Featured Projects, Latest Roundup, Talks & Videos, polish + a11y + perf.

This ordering means the homepage is **launchable at end of MVP-1** with a meaningful, brand-aligned baseline.
