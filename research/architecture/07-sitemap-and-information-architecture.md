# Cursor India — Sitemap & Information Architecture

> Phase 6 deliverable.
> Inputs: brand audit (§1), template audit (§2), comparison matrix (§3), strategy (§5).
> This document is the **canonical IA reference** for both the design phase and the implementation phase.

---

## 1. Sitemap (visual tree)

```
cursorindia.dev
│
├── /                                  Home
│
├── /events                            Events index (filterable)
│   ├── /events/[slug]                 Event detail page (canonical URL)
│   ├── /events.ics                    iCal subscription
│   └── /events/rss.xml                RSS
│
├── /chapters                          Chapters index (city grid + map)
│   ├── /chapters/bengaluru            Per-city page
│   ├── /chapters/hyderabad
│   ├── /chapters/delhi
│   ├── /chapters/mumbai
│   ├── /chapters/pune
│   ├── /chapters/chennai
│   ├── /chapters/kolkata
│   ├── /chapters/ahmedabad
│   ├── /chapters/jaipur
│   ├── /chapters/indore
│   ├── /chapters/bhubaneswar
│   ├── /chapters/coimbatore
│   ├── /chapters/chandigarh
│   └── /chapters/start-a-chapter      "Bring Cursor to your city" CTA
│
├── /ambassadors                       Ambassador directory
│   ├── /ambassadors/[handle]          Per-ambassador profile
│   ├── /ambassadors/apply             Application form
│   └── /ambassadors/playbook          Internal-but-public ambassador playbook
│
├── /campus                            Campus Leads hub
│   ├── /campus/[college-slug]         Per-college club page
│   ├── /campus/apply                  Campus Lead application
│   └── /campus/playbook               Campus Lead playbook
│
├── /showcase                          Project showcase
│   ├── /showcase/[project-slug]       Per-project page
│   └── /showcase/submit               Submission form / PR instructions
│
├── /founders                          Startup founders / engineering leaders track
│   ├── /founders/roundtables          Closed-door event index
│   └── /founders/partners             Investor & accelerator partners
│
├── /resources                         Learn & resources
│   ├── /resources/getting-started     Cursor 101 for Indian devs
│   ├── /resources/workflows           Curated advanced workflows
│   ├── /resources/students            Student-specific (links cursor.com/students)
│   ├── /resources/startups            Startup-specific
│   ├── /resources/vernacular          Hindi / Tamil / Bengali / Telugu / Marathi guides
│   ├── /resources/hackathon-kit       Downloadable hackathon-in-a-box
│   └── /resources/talks               Featured talks / video hub
│
├── /blog                              Blog (longform + monthly roundups)
│   ├── /blog/[slug]                   Per-post
│   ├── /blog/roundups                 Monthly roundup index
│   ├── /blog/rss.xml                  RSS
│   └── /blog/tags/[tag]               Tag pages
│
├── /partners                          Partner ecosystem
│   ├── /partners/venues               Venue partners by city
│   ├── /partners/investors            Investor partners
│   ├── /partners/sponsors             Sponsor tier breakdown
│   ├── /partners/colleges             College partners
│   └── /partners/become-a-partner     Inbound form
│
├── /join                              Single join landing
│   (links to Discord, WhatsApp, Telegram, Newsletter, Forum, Reddit)
│
├── /about                             Lightweight about page
│   ├── (positioning, manifesto, founding ambassadors, FAQ)
│   └── /about/disambiguation          "We are not Cursor Inc." standalone
│
├── /code-of-conduct
├── /privacy
├── /terms
├── /press                             (logos, founder bios, contact)
├── /contact
│
└── /api                               Internal endpoints
    ├── /api/events                    JSON event feed (consumed by site + 3rd parties)
    ├── /api/og                        Dynamic OG image generation
    └── /api/luma-sync                 Luma → MDX sync (cron)
```

---

## 2. URL & Naming Conventions

| Convention | Rule | Example |
|---|---|---|
| Lowercase, hyphenated | All path segments | `/chapters/delhi-ncr` |
| No trailing slash | Canonical without trailing `/` | `/events/cafe-cursor-bengaluru-2026-07-12` |
| City slugs | Common name, hyphen for multi-word | `delhi`, `mumbai`, `delhi-ncr` |
| Event slugs | `archetype-city-yyyy-mm-dd` | `hackathon-pune-2026-08-23` |
| Recap slugs | `[event-slug]-recap` OR `[event-slug]` (recap is the same canonical URL post-event) | `cafe-cursor-bengaluru-2026-07-12` |
| Ambassador handle | First-name-last-name or chosen handle | `/ambassadors/syed-fahad` |
| College slug | College short name | `/campus/iit-bombay`, `/campus/iiit-hyderabad` |

---

## 3. Navigation Structure

### 3.1 Top navigation (desktop)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⌘ Cursor India   Events  Chapters  Ambassadors  Showcase  Resources  Blog │
│                                                                       Join →│
└─────────────────────────────────────────────────────────────────────────────┘
```

- Left: logo + wordmark "Cursor India" (with a small "community" eyebrow under wordmark).
- Center: 6 primary nav items (no mega-menus).
- Right: "Join →" filled CTA button.

### 3.2 Mobile navigation

- Hamburger → full-screen drawer.
- Order: Events, Chapters, Ambassadors, Showcase, Resources, Blog, Join.
- Footer of the drawer: Discord, WhatsApp, Twitter/X, GitHub icons.

### 3.3 Footer

```
COMMUNITY               BUILD                   ABOUT                   CONNECT
- Events                - Showcase              - About                 - Discord
- Chapters              - Resources             - Manifesto             - WhatsApp
- Ambassadors           - Blog                  - Code of Conduct       - Telegram
- Campus                - Hackathon kit         - Press                 - Twitter / X
- Founders              - Talks                 - Contact               - LinkedIn
- Partners              - Roundups              - FAQ                   - GitHub
                                                - Disambiguation        - Newsletter

We are a volunteer-run community of Cursor users in India. We are not Cursor Inc.
For the official Cursor product, visit cursor.com.

MIT-licensed source: github.com/cursor-india/website
```

### 3.4 Breadcrumbs

- Events: `Events › <Event Title>`
- Chapters: `Chapters › Bengaluru`
- Ambassadors: `Ambassadors › <Name>`
- Showcase: `Showcase › <Project>`
- Resources: `Resources › Workflows › <Item>`

---

## 4. Homepage Sections (vertical order)

This is the **definitive homepage section order**. Each section is justified.

| # | Section | Justification |
|---|---|---|
| 1 | **Hero** — wordmark + tagline + 2 CTAs (Events, Join) + bento photo grid | Sets identity in 1 second. Bento proves activity. |
| 2 | **Stat strip** — chapters · cities · ambassadors · events held · members | Empirical social proof. Mirror Cursor's `/community` stat strip. |
| 3 | **Next event** — single, prominent, with countdown | Drives the primary conversion (RSVP). |
| 4 | **Upcoming events** — next 6, with city + archetype + date filter | Calendar-feel; covers all four event types. |
| 5 | **Chapters map** — interactive India map with markers | Tangible scale; cross-city discovery. |
| 6 | **Featured projects** — 3–6 builds from the showcase | Surfaces the *output* of the community, not just events. |
| 7 | **Ambassadors strip** — 8 cards, scrollable | Real people, real cities. |
| 8 | **Audience self-select panel** — Students / Devs / Founders / OSS / Organizers / Educators | Mirrors Build Club; routes each visitor to their journey. |
| 9 | **Latest roundup** — most recent monthly digest | Always-fresh content; signals consistency. |
| 10 | **Talks / videos** — featured 3 recordings | YouTube cross-link; long-tail SEO. |
| 11 | **Resources teaser** — 4 cards (getting started, workflows, hackathon kit, vernacular) | Surfaces learn content for SEO and onboarding. |
| 12 | **Partner ecosystem strip** — venue + investor + college logos | Credibility, partner value. |
| 13 | **Manifesto** — 3–4 short paragraphs, signed by India lead | Brand depth; humanizes the community. |
| 14 | **Newsletter capture** — single field, on-domain | Owned channel. |
| 15 | **Disambiguation footer note** — "We are not Cursor Inc." short paragraph | Critical for trust. |
| 16 | **Global footer** | Per §3.3. |

Rejected from the homepage:
- "Why join" listicle (Italy Milano antipattern).
- "Sponsor us" CTA (in footer or `/partners` only).
- Auto-playing hero video.
- Press logos at the top (we are pre-press; once real, sub-page only).

---

## 5. Events Architecture

### 5.1 Events index page (`/events`)

- **Filters:** city, archetype (Cafe / Workshop / Meetup / Hackathon), date (upcoming / past), audience (students / founders / open).
- **View toggle:** list / calendar / map.
- **Default view:** upcoming, list, sorted by date asc.
- **Per-event card:**
  - Date (with IST), city, venue
  - Archetype badge (Cafe / Workshop / Meetup / Hackathon)
  - Title
  - Capacity + attendees registered (if available)
  - "Register on Luma →" + "Details →"

### 5.2 Event detail page (`/events/[slug]`)

Canonical URL owned by us. Luma is the registration backend.

Sections:
1. Title + archetype badge + date/time/IST + city/venue (with map embed lazy-load)
2. Hero photo (or chapter banner)
3. Description
4. Agenda (timeline)
5. Speakers / hosts
6. Partners / sponsors
7. Capacity + RSVP CTA (Luma embed lazy-load)
8. Photos (added post-event)
9. Recap content (after the event — overwrites pre-event description as the canonical post-event page)
10. "Add to calendar" (`.ics`)
11. Related events (same city or same archetype)
12. `schema.org/Event` JSON-LD for SEO

### 5.3 Event lifecycle

```
[Draft (in MDX)] → [Published / Upcoming] → [Live] → [Past + Recap] → [Archived]
```

All transitions happen via the MDX frontmatter `status` field + `date` field. No CMS needed.

---

## 6. Ambassador Architecture

### 6.1 `/ambassadors` (index)

- Grid of ambassador cards (8 per row on desktop, 2 on mobile).
- Filter by city.
- Volunteer Team sub-section below.
- "Apply to be an ambassador →" CTA at the bottom.

### 6.2 `/ambassadors/[handle]` (profile)

Sections:
1. Avatar + name + city + role (Ambassador / Lead Ambassador / Campus Lead / Co-organizer / Volunteer)
2. One-line bio
3. Long bio
4. What they're currently building
5. Events hosted (auto-aggregated from events index where `hosts` includes them)
6. Recaps written
7. Projects in showcase (if any)
8. Social links (X, GitHub, LinkedIn, website)
9. "Contact for collaboration" CTA (optional, depending on ambassador preference)

### 6.3 `/ambassadors/apply`

Form fields:
- Name, email, city
- Role applying for (Ambassador / Campus Lead / Co-organizer / Volunteer)
- Why you (paragraph)
- What you'd organize in the next 90 days (paragraph)
- Portfolio links (X, GitHub, LinkedIn)
- Existing communities you run / are part of
- Anything else

Submission stored in private repo + email to `apply@cursorindia.dev`.

### 6.4 `/ambassadors/playbook`

Public playbook for ambassadors (mirror of internal handbook). Sections:
- Code of Conduct (link to canonical)
- How to plan a Cafe Cursor
- How to plan a Workshop
- How to plan a Meetup
- How to plan a Hackathon
- Sponsorship guidelines
- Budget guidelines
- Brand assets
- Reporting & recap requirements

---

## 7. Chapters Architecture

### 7.1 `/chapters` (index)

- India map (interactive, lazy-loaded).
- Grid of chapter cards (one per city).
- Each card: city name, lead ambassador, member count (if real), next event, "Open chapter →".
- At the bottom: "Don't see your city? Start a chapter →" CTA → `/chapters/start-a-chapter`.

### 7.2 `/chapters/[city]` (per chapter)

Sections:
1. City hero (city wordmark + landmark photo + lead's photo + tagline)
2. Stat strip (chapter members, events held, ambassadors, projects)
3. Next event (chapter-scoped)
4. Upcoming events (chapter-scoped)
5. Past events / recaps (chapter-scoped)
6. Chapter ambassadors + volunteers
7. Featured projects (chapter-scoped)
8. Local partners (venues, sponsors)
9. Join chapter CTAs (chapter-specific Discord/WhatsApp/Telegram channels)
10. Chapter blog / roundup (if exists)

### 7.3 `/chapters/start-a-chapter`

- Why chapters exist
- What being a Chapter Lead involves
- Application form (similar to ambassador apply, with extra "host your first event in 30 days" commitment)
- FAQ
- "Or volunteer with an existing chapter →" alternate path

---

## 8. Partner Ecosystem Architecture

### 8.1 `/partners` (index)

Four sub-categories visible:
- **Venues** — coffee shops, coworking spaces, college campuses
- **Investors & accelerators** — YC, Peak XV, etc.
- **Sponsors** — companies funding hackathons / event credits
- **Colleges** — institutional partners

### 8.2 Partner tiers (for sponsors specifically)

| Tier | What partner gives | What partner gets |
|---|---|---|
| **Title** | Funding for a major event series | Top-of-page logo + named series + post-event report |
| **Hosting** | Venue + drinks for an event | Logo on event page + recap + social mention |
| **Community** | Cursor credits / swag for event | Logo on `/partners` |
| **Media** | Promotion across their channels | Reciprocal cross-promotion |

### 8.3 `/partners/become-a-partner`

Form fields:
- Company name, contact name, email
- Type of partnership interested in
- Cities of interest
- Budget range (Optional, hidden tooltip explaining tiers)
- Anything specific

---

## 9. Resource Architecture

### 9.1 `/resources` (index)

Sub-page tiles:
1. Getting started with Cursor
2. Advanced workflows
3. Cursor for students
4. Cursor for startups
5. Vernacular guides (Hindi, Tamil, Bengali, Telugu, Marathi)
6. Hackathon kit
7. Talks & videos

### 9.2 `/resources/hackathon-kit`

Downloadable runbook (PDF + MDX source):
- Sponsorship email template
- Venue checklist
- Judging rubric
- Prize structure
- Day-of schedule
- Post-event recap template

This is high-leverage content. Every aspiring ambassador downloads this.

### 9.3 `/resources/vernacular`

Vernacular language hub. Launch policy: English-only at launch; vernacular tiles are visible but route to "Coming soon — contribute" pages so we capture interest. Q2 fill in: Hindi. Q3: Tamil, Bengali, Telugu. Q4: Marathi.

---

## 10. Blog & Roundup Architecture

### 10.1 `/blog`

Filter by tag: `roundup`, `recap`, `interview`, `tutorial`, `event-news`, `community`.

### 10.2 `/blog/roundups`

Monthly roundup is a special post type. Structure:
- Cover photo
- Editor's letter (signed by India lead or rotating ambassador)
- Events this month
- Featured projects
- New ambassadors / chapters
- Cursor product highlights (Composer 2.5 etc.)
- Photo gallery
- Next month preview

---

## 11. Newsletter Architecture

- Single capture component used in 3 places: homepage, `/blog`, footer.
- Provider: **Buttondown** (developer-friendly, supports Markdown), fallback **Resend** (more dev control, BYO templates).
- Confirmation page: `/newsletter/confirmed` with a friendly "what to expect" message.
- Frequency: 1 email per month (the monthly roundup), plus optional per-event reminders for the user's city.

---

## 12. Internationalization (i18n) Architecture

- Pattern inherited from the ambassador template: dot-path keys, JSON dictionaries, opt-in toggle.
- Languages at launch: English only.
- Q2: Hindi added — only the homepage, /about, /events index, and /resources/vernacular are translated.
- Q3: Tamil + Bengali + Telugu added — same scope.
- Q4: Marathi added.
- **Language switcher** lives in the top-right of nav once `locales.length > 1`.
- **URL pattern:** `cursorindia.dev/hi/...`, `cursorindia.dev/ta/...` (path prefix, not subdomain).
- **Default locale:** `en`. Hreflang tags emitted.

---

## 13. Search Architecture

- **Pagefind** (static, free, privacy-respecting) indexes all events, recaps, blog posts, ambassadors, projects, resources.
- Search opens on `Cmd+K` / `Ctrl+K` (mirrors Cursor's own search UX patterns).
- Results grouped by entity type (Events / Ambassadors / Projects / Resources / Blog).

---

## 14. Data Model (summary)

```
Chapter      → has many Events, Ambassadors, Projects
Ambassador   → belongs to 1 Chapter (or N for Lead Ambassador)
Event        → belongs to 1 Chapter; has many Hosts (Ambassadors), Partners
Recap        → belongs to 1 Event (1:1, post-event)
Project      → belongs to 1+ Ambassadors and 0–1 Chapter
Roundup      → spans all Chapters; tagged month
Partner      → has many Events (sponsorships)
College      → has many Campus Leads; belongs to 1 city
CampusLead   → belongs to 1 College
```

All entities are MDX files with typed frontmatter (zod schema validated at build time).

---

## 15. Accessibility & Performance (architectural decisions)

- **Static-first.** Every page (except `/api/og` and `/api/events`) is statically generated. ISR for events index (revalidate every 60 seconds — same as cursorkenya.com).
- **Lazy-loaded heavy widgets:** Luma embeds, India map, YouTube videos, photo galleries.
- **Image discipline:** `next/image` with AVIF + WebP fallback; no images > 200 KB above the fold.
- **a11y baseline:** WCAG 2.2 AA. Skip-to-content. Focus-visible. Color contrast tokens. Keyboard nav fully functional.
- **Reduced motion:** all animations respect `prefers-reduced-motion`.

---

## 16. Diagram — High-Level System

```
┌───────────────────────────────────────────────────────────────────┐
│                            Visitor                                │
└───────────────────────────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────────────┐
│                       cursorindia.dev (Next.js)                   │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Pages: Home, Events, Chapters, Ambassadors, Showcase,       │ │
│  │         Founders, Resources, Blog, Partners, About, Join     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Content (MDX): /content/{chapters,ambassadors,events,...}   │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  API: /api/og, /api/events, /api/luma-sync                   │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
            │                          │                       │
            ▼                          ▼                       ▼
   ┌─────────────────┐       ┌─────────────────┐     ┌─────────────────┐
   │     Luma        │       │  Plausible      │     │ Buttondown/Resend│
   │   (RSVP)        │       │  (analytics)    │     │  (newsletter)    │
   └─────────────────┘       └─────────────────┘     └─────────────────┘
            │
            ▼
   ┌─────────────────┐
   │  Discord/WhatsApp│
   │   /Telegram      │
   └─────────────────┘
```

---

## 17. Open IA Decisions to Validate with Team

These are deliberate questions worth confirming with the founding ambassadors before commit:

1. **Domain.** `cursorindia.dev` (recommended) vs `cursorindia.com` vs `cursor.in` vs `cursor-india.com`. The `.dev` TLD is on-brand for developers; `.com` is more discoverable; `.in` is the most "Indian" but slightly less premium feel. Recommended: `cursorindia.dev` with `cursorindia.com` redirect.
2. **Discord vs WhatsApp primacy.** Recommended: WhatsApp is the **first-line chat** (lowest friction, ubiquitous), Discord is the **deep-engagement chat** (channels, voice, ambassadors).
3. **Newsletter cadence.** Recommended: monthly only. Per-event reminders are opt-in by city subscription.
4. **Should `/showcase` and `/founders` be top-nav at launch or post-MVP?** Recommended: `/showcase` at launch (high signal), `/founders` after first roundtable held (avoid empty section).
5. **Single page vs subdomain for Chapters.** Recommended: single page per chapter at `/chapters/<city>`. Subdomains (`bengaluru.cursorindia.dev`) only if a chapter genuinely outgrows the path-based structure.
6. **Press page.** Recommended: only when we have real press. Footer link only at launch.
