# Cursor India — SEO, Accessibility & Performance Recommendations

> Deliverables #10, #11, #12 (consolidated for cross-reference).
> Inputs: all prior research docs.

These three disciplines are inseparable in practice (a slow inaccessible page hurts SEO; well-structured HTML helps all three). They are documented together.

---

# Part A — SEO Recommendations

## 1. Strategic Positioning

Cursor India will own these search intents over 12 months:

| Intent | Example query | Target page |
|---|---|---|
| **Branded** | "cursor india", "cursor india community" | `/` |
| **City-specific** | "cursor meetup bengaluru", "cursor hackathon mumbai" | `/chapters/[city]`, `/events?city=...` |
| **Archetype** | "cafe cursor bengaluru", "cursor hackathon india" | `/events?type=...` |
| **Learning** | "how to use cursor", "cursor for students india" | `/resources/*` |
| **Career / community** | "cursor ambassador india", "become cursor ambassador" | `/ambassadors/apply` |
| **Vernacular** | "cursor कैसे इस्तेमाल करें", "cursor tutorial in hindi" | `/hi/resources/*` (post Q2) |
| **Vendor-comparison long-tail** | "cursor vs github copilot india", "cursor pricing india" | one blog post; refer to cursor.com for canonical |

## 2. Technical SEO Baseline

| Requirement | Implementation |
|---|---|
| **Sitemap** | `next-sitemap` generates `/sitemap.xml` at build time (includes all events, recaps, ambassadors, projects, chapters, blog posts, resources). |
| **Robots.txt** | Permissive crawl; explicit `Disallow: /api/` and `/newsletter/confirmed`. |
| **Canonical URLs** | Every page emits `<link rel="canonical">` to its own absolute URL. |
| **Structured data (JSON-LD)** | `Organization` on every page; `Event` on every event page; `Person` on ambassador profiles; `Article` on blog posts; `BreadcrumbList` on all detail pages. |
| **OpenGraph + Twitter Card** | `og:type`, `og:title`, `og:description`, `og:image` per page. Twitter card: `summary_large_image`. |
| **Dynamic OG images** | `/api/og` route using `@vercel/og` — generates per-page OG with title, eyebrow, city, date, wordmark. |
| **hreflang** | Per-locale `<link rel="alternate" hreflang>` when i18n active. |
| **Semantic HTML** | One `<h1>` per page; logical h-level nesting; `<main>`, `<nav>`, `<aside>`, `<footer>` landmarks. |
| **HTTP status codes** | Use `notFound()` in Next.js for missing slugs to emit correct 404. |
| **No client-side-only content** | Event lists, ambassador grids, blog index — all SSG/ISR. |
| **Trailing-slash policy** | No trailing slashes; 301-redirect any inbound. |
| **HTTPS** | Always; HSTS header. |
| **Pagination** | `rel="next"` / `rel="prev"` on paginated indexes. |

## 3. Event-Page Structured Data Example

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Cafe Cursor Bengaluru",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "startDate": "2026-07-12T16:00:00+05:30",
  "endDate": "2026-07-12T20:00:00+05:30",
  "location": {
    "@type": "Place",
    "name": "Third Wave Coffee, Indiranagar",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "100 Feet Road, Indiranagar",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560038",
      "addressCountry": "IN"
    }
  },
  "image": ["https://cursorindia.dev/images/events/cafe-cursor-bengaluru-2026-07-12/hero.jpg"],
  "description": "A relaxed 4-hour Saturday afternoon at Third Wave Coffee Indiranagar...",
  "organizer": {
    "@type": "Organization",
    "name": "Cursor India",
    "url": "https://cursorindia.dev"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "url": "https://lu.ma/event-id"
  },
  "performer": [
    { "@type": "Person", "name": "Tanvi Sharma" }
  ]
}
```

## 4. Content SEO Strategy

- **Event pages are the SEO engine.** Each event = one indexable URL with date, city, structured data, photos, recap. At 150 events/year, we generate 150 high-quality long-tail URLs annually.
- **Chapter pages are city-anchor pages.** Each `/chapters/<city>` ranks for "cursor [city]" queries.
- **Ambassador profiles** rank for personal-brand searches and provide expertise signals (E-E-A-T).
- **Blog posts** target *how-to* and *opinion* intents.
- **Resource pages** target *tutorial* intents.
- **Showcase pages** rank for project names.

## 5. SEO Anti-Patterns to Avoid

1. Loading event content via client-side fetch (kills indexability).
2. Same `<title>` across multiple pages.
3. Generic OG images.
4. Missing alt text on images.
5. Broken internal links (verify via `next-sitemap` validate).
6. Infinite-scroll without pagination URLs.
7. Heavy JS that delays first paint (Google penalizes).
8. Cloaking / hiding text.
9. Duplicate content across chapter pages (must localize per §3.2 of comparison matrix).
10. No `lang` attribute updates on i18n switch.

## 6. SEO Tracking

- **Google Search Console** verified on launch.
- **Bing Webmaster Tools** verified.
- **Plausible Analytics** for traffic + referrer.
- **Lighthouse CI** on every PR (SEO score ≥ 100).
- **Quarterly content audit**: review which pages get organic traffic, double down.

---

# Part B — Accessibility Recommendations

## 1. Baseline Commitment

**Cursor India is WCAG 2.2 AA compliant on launch and every release thereafter.** This is a non-negotiable.

We also commit to:
- Working with keyboard alone.
- Working with screen reader (NVDA on Windows, VoiceOver on macOS).
- Working with `prefers-reduced-motion`.
- Working at 200% zoom without horizontal scroll.
- Working with color-vision deficiencies (verified via Stark / Sim Daltonism).

## 2. Specific Requirements

### 2.1 Color & contrast
- Body text: contrast ratio ≥ 7:1 (AAA target).
- Large text: ≥ 4.5:1.
- UI components and graphical objects: ≥ 3:1.
- Accent color (`#E68A2E`) on dark background tested at 6.2:1 — passes AAA for large text.
- **Never** use color as the only conveyor of information (e.g. status badges always have icon + label, not just color).

### 2.2 Typography
- Minimum body text: 16 px.
- Line height: ≥ 1.5 for body, ≥ 1.25 for headings.
- Letter spacing: ≥ 0.12× font size for body (we use ~0.16× via `tracking-normal`).
- Paragraph max width: ≤ 80ch (we use 65ch).

### 2.3 Keyboard
- All interactive elements reachable via Tab.
- Visible focus indicator (`outline: 2px solid var(--accent); outline-offset: 2px;`).
- Logical tab order matching visual order.
- Skip-to-content link as first focusable element on every page.
- Cmd+K search has trap-focus when open, Esc to close.
- Dialogs trap focus; return focus to trigger on close.

### 2.4 Screen reader
- Landmarks: `<main>`, `<nav>`, `<aside>`, `<footer>`, `<header>` used correctly.
- Heading levels logical (no skipping).
- All images have `alt` text — build fails if missing.
- Decorative images use `alt=""`.
- Icons have `aria-label` if standalone, `aria-hidden="true"` if accompanied by text.
- Form fields have associated `<label>`.
- Error messages associated via `aria-describedby`.
- Loading states announced via `aria-live="polite"`.
- Countdown timer uses `aria-live="polite"` updating once per minute (not every second).

### 2.5 Motion & animation
- All animations respect `prefers-reduced-motion: reduce` (durations → 0).
- No auto-playing videos.
- No infinite-loop animations except subtle skeleton shimmer (acceptable).
- Carousels (if used) have pause control.

### 2.6 Forms
- Labels visible (no placeholder-only labels).
- Error messages in plain text below the field.
- `required` fields marked visually and via `aria-required="true"`.
- Submit buttons clearly labeled (not "Submit" generic).

### 2.7 Interactive components
- Touch targets ≥ 44×44 px.
- `Tooltip` text repeated as `aria-label` for the trigger.
- `Modal/Dialog` uses Radix (focus trap, ESC, return-focus by default).
- `Tabs` use `role="tablist"` / `role="tab"` / `role="tabpanel"` correctly.
- `Accordion` uses `aria-expanded`.

### 2.8 i18n
- `<html lang="en">` at load; updates to `lang="hi"` etc. on locale switch.
- Right-to-left support not required (no RTL languages in India scope).
- Translation strings preserve placeholder semantics.

### 2.9 Inclusive language
- Avoid gendered defaults ("guys", "manhours").
- Use "they/them" generically.
- Avoid ableist metaphors ("crazy good", "insane speed").
- Avoid idioms that don't translate.

## 3. Testing Strategy

| Tool | Frequency |
|---|---|
| `axe-core` (via `@axe-core/react` in dev) | Continuous during dev |
| Lighthouse a11y audit | Every PR (CI gate ≥ 95) |
| NVDA + Chrome smoke test | Weekly |
| VoiceOver + Safari smoke test | Weekly |
| Keyboard-only walkthrough | Every release |
| External a11y audit | Annually |
| Color-blind simulation (Sim Daltonism) | On design changes |
| 200% zoom test | Every release |

## 4. Public Accessibility Statement

Publish at `/accessibility` (or in `/about`):
- Our commitment (WCAG 2.2 AA).
- Known issues (transparent list).
- How to report a barrier (`a11y@cursorindia.dev`).
- Date of last audit.

---

# Part C — Performance Recommendations

## 1. Performance Budget

| Metric | Home | Event detail | Chapter | Blog post |
|---|---:|---:|---:|---:|
| **LCP** | ≤ 2.0 s | ≤ 2.5 s | ≤ 2.5 s | ≤ 2.0 s |
| **INP** | ≤ 200 ms | ≤ 200 ms | ≤ 200 ms | ≤ 200 ms |
| **CLS** | 0 | 0 | 0 | 0 |
| **TTFB** | ≤ 400 ms | ≤ 500 ms | ≤ 500 ms | ≤ 500 ms |
| **JS initial (gzipped)** | ≤ 120 KB | ≤ 150 KB | ≤ 130 KB | ≤ 100 KB |
| **Page weight initial** | ≤ 800 KB | ≤ 1 MB | ≤ 900 KB | ≤ 600 KB |
| **Lighthouse Performance** | ≥ 95 | ≥ 90 | ≥ 90 | ≥ 95 |

Targets are for mid-tier 4G device (Moto G Power class) — realistic for Tier-2/3 city India.

## 2. Rendering Strategy

| Page | Strategy | Revalidation |
|---|---|---|
| `/` | SSG + ISR | 5 min |
| `/events` | SSG + ISR | 1 min |
| `/events/[slug]` | SSG + ISR | 5 min |
| `/chapters/[city]` | SSG + ISR | 5 min |
| `/ambassadors/[handle]` | SSG | Build only |
| `/blog/[slug]` | SSG | Build only |
| `/showcase` | SSG + ISR | 5 min |
| `/api/og` | Dynamic (cached at edge) | 1 day |
| `/api/events` (JSON feed) | Dynamic (cached) | 1 min |
| Form submission pages | RSC + server actions | n/a |

## 3. Asset Strategy

### 3.1 Images
- `next/image` mandatory; AVIF and WebP fallback.
- Per-image budget: ≤ 100 KB above the fold, ≤ 250 KB below.
- Bento hero tiles served at multiple sizes via `sizes` attribute.
- `priority={true}` only on the LCP image (the largest above-the-fold image).
- All other images lazy-loaded.
- Photo galleries use intersection-observer-based lazy load.

### 3.2 Fonts
- Geist Sans + Mono via `next/font/local`.
- Subset to Latin only at launch.
- Devanagari / Tamil / Bengali / Telugu subsets added when vernacular launches.
- `font-display: swap` to prevent FOIT.
- Preload only the variable axes used above the fold.

### 3.3 JavaScript
- All marketing pages are React Server Components by default.
- `'use client'` only where interactivity is required.
- No third-party JS in initial bundle. (Map library, Luma embed, YouTube embed, analytics — all lazy.)
- Plausible analytics: ≤ 1 KB script.
- No `framer-motion` in critical path (or use lightweight `motion/react` subset).
- Bundle analyzed on every PR (`@next/bundle-analyzer`).

### 3.4 CSS
- Tailwind v4 with the new compiler.
- Critical CSS inlined automatically by Next.js.
- No global CSS beyond resets and tokens.
- Theme switching uses CSS variables (no second stylesheet).

### 3.5 Third-party embeds
- **Luma:** placeholder image + "Open RSVP" link by default; iframe loads only on click or explicit expand. (Pattern from cursorcolombia.com.)
- **YouTube:** placeholder thumbnail with play overlay; iframe loads only on click.
- **Maps:** static fallback image OR vector India SVG; interactive map lazy-loads on visibility (`>= md` only).
- **Discord widget:** if used, lazy-loaded.

## 4. Caching & Delivery

- Static assets cached aggressively via Vercel CDN (default Next.js behavior).
- ISR for dynamic-ish pages with revalidation per §2.
- Image cache TTL ≥ 1 year (immutable via hash).
- HTML cache headers per Next.js defaults.
- API responses cache for 60s with `s-maxage` and `stale-while-revalidate`.

## 5. India-Specific Performance Realities

Many users will visit on:
- **Mid-tier Android** (Snapdragon 6-series): single-thread limited.
- **3G/4G unstable**: tail-end latency >500 ms common.
- **Limited data plans**: every KB matters.
- **Older browsers**: target Chrome 100+, Safari 15+, Edge 100+ (no IE).

Implications:
- Every interaction must work without JS where possible (server actions for forms).
- Optimistic UI for low-stakes interactions.
- No giant hero videos.
- Test on a real mid-tier Android device monthly.

## 6. Monitoring

- **Vercel Speed Insights** on production.
- **Lighthouse CI** on every PR (regression catch).
- **Plausible Web Vitals** for real-user metrics.
- **Sentry** for client-side error monitoring (privacy-respecting: no PII).
- Monthly: review the slowest 10 pages, optimize.

## 7. Performance Anti-Patterns to Avoid

1. Loading the map library on the homepage even if user doesn't scroll to it.
2. Auto-playing Luma iframe.
3. Auto-playing YouTube embeds.
4. Loading entire ambassador photos in their full resolution on the grid.
5. JS-based scroll animations that block main thread.
6. Heavy hero video (replace with a 4-tile bento grid).
7. Unbundled Tailwind shipping all classes.
8. Multiple instances of a heavy lib (motion, recharts, etc.) in different pages.
9. Inline base64 images larger than 1 KB.
10. Third-party fonts not subset to needed glyphs.

---

# Summary Acceptance Criteria

The site is "production ready" when:

- **SEO:** Lighthouse SEO score = 100 on every P0 page. All event/ambassador/chapter pages have JSON-LD. Dynamic OG image generation working. Sitemap auto-submitted to GSC.
- **Accessibility:** Lighthouse a11y ≥ 95. axe-core clean run on all P0 pages. Keyboard-only test passes on home, events, event detail, chapter, ambassador, join.
- **Performance:** Lighthouse perf ≥ 95 on home. All Web Vitals in "good" range on the median Indian mid-tier Android. Page weight budgets met per §1.

These are the **non-negotiables** for launch.
