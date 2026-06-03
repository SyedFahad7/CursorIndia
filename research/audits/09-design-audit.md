# Cursor India — Design Audit (Synthesis)

> Deliverable #4. Cross-cutting design analysis derived from the 20 community sites surveyed in `/research/competitors/03-community-site-audits.md`, the ambassador template (`/research/audits/02-ambassador-template-audit.md`), and the Cursor brand canon (`/research/brand/01-cursor-brand-analysis.md`).
> Date: 2026-05-30.

This is not a per-site critique. It is a **pattern-level diagnosis** of how Cursor community sites currently look, where they fail, and what design moves Cursor India should make.

---

## 1. Design Maturity Distribution

Plotting all 20 sites against a 2-axis matrix:

```
            High Brand Alignment
                    │
   Sri Lanka ▲      │      ▲ Germany
   Colombia ▲       │
                    │      ▲ Thailand
   Indonesia ▲      │
                    │
   Brazil POA ▲     │      ▲ Calgary
   Bulgaria ▲       │      ▲ Netherlands
                    │      ▲ El Salvador
   Brazil BH ▲      │      ▲ Belgium
                    │      ▲ Serbia
                    │
   Kenya ▲          │      ▲ Austria
                    │      ▲ Croatia
                    │      ▲ Trento
                    │      ▲ SLC
                    │      ▲ Victoria
                    │
   Italy Milano ▲   │
   ─────────────────┼────────────────── High Information Density
            Low Brand Alignment
```

The cluster reveals:
- **A high-quality tail** (Germany, Sri Lanka, Colombia, Thailand) we can learn from.
- **A mid-tier majority** (Calgary, Netherlands, El Salvador, Brazil, Belgium, Serbia, Bulgaria, Indonesia) that meets the bar but lacks differentiation.
- **A long bottom** (Italy Milano in particular) that actively diverges from Cursor brand.

Cursor India's design target: top-right corner — high brand alignment AND high information density. This is currently unoccupied.

---

## 2. Pattern-Level Findings

### 2.1 Hero Patterns Observed

| Pattern | Sites using | Verdict |
|---|---|---|
| Bento photo grid | Thailand, Germany, Indonesia (variant) | **Adopt** — proven, on-brand, scalable |
| Single hero photo | Victoria, Brazil BH | Acceptable but less dynamic |
| Text-only hero | Netherlands, Belgium | Underwhelming |
| Hero with CTA above the fold | All | Mandatory |
| Hero with countdown | Kenya | **Adopt** — gentle urgency |
| Hero with bro-y badges (LIVE / AI / etc.) | Italy Milano | **Avoid** |

**Cursor India choice:** Bento photo grid + countdown to next event + 2 CTAs.

### 2.2 Event Card Patterns Observed

| Element | % of sites using | Verdict |
|---|---:|---|
| Title + date | 100% | Required |
| Venue named | 55% | **Required for us** — partner value |
| Attendance count | 60% | **Required for us** — social proof |
| Archetype badge | 0% | **New for us** — unique advantage |
| Photo count | 10% | **New for us** — Calgary inspiration |
| Capacity remaining | 0% | **New for us** — RSVP urgency |
| "View recap" link | 75% | Required post-event |
| Host avatars | 30% | **Adopt** — humanizes |

**Cursor India choice:** All of the above on every card. Compact and expanded variants.

### 2.3 Ambassador Patterns Observed

| Element | % of sites using | Verdict |
|---|---:|---|
| Photo + name | 100% | Required |
| Role label | 60% | Required |
| City affiliation | 15% | **Required for us** |
| Long bio on card | 15% (Brazil) | **No** — link to profile instead |
| Profile pages | 0% | **Major opportunity** — Cursor India should pioneer this |
| Social links | 65% | Required |
| Volunteer tier below ambassadors | 5% (Sri Lanka) | **Adopt** |
| Apply CTA | 30% | **Required** — local intake, not global link |

**Cursor India choice:** Cards + profile pages + city + volunteer tier + local apply form.

### 2.4 Color & Theme Patterns Observed

- **Dark theme dominant** (75% of sites). Aligns with Cursor canon.
- **Single accent color** is the norm; some sites have none (purely monochrome).
- **No site uses an Indian-coded color** in a thoughtful way. Most that use country color use a flag emoji which we explicitly reject.
- **Light theme support is rare** — only Brazil BH/POA and Italy Milano default light. None offer a toggle.

**Cursor India choice:** Dark default, warm marigold accent (`#E68A2E`), light-theme toggle.

### 2.5 Typography Patterns Observed

- Most sites use **Inter / Geist / system sans** — all in the same family.
- **Heading weights** vary 600–800. The lighter end (600) feels more on-brand.
- **Monospace** is underused. Only Colombia and Thailand show any.
- **Tabular numerals** are inconsistently applied.

**Cursor India choice:** Geist (sans + mono); heading weight 600; tabular nums for metrics/dates.

### 2.6 Motion Patterns Observed

- **Almost no animation** on most sites. (Good — restraint.)
- **Card hover lift** is the most common animation, well-executed.
- **Germany's interactive map** and **sticker wall** are the only "delight" moments in the entire 20-site set.
- **Italy Milano** has the most motion, used poorly.

**Cursor India choice:** Card hover lift + delightful interactive India map. No marquees, no parallax, no autoplay.

### 2.7 Empty-State Patterns Observed

| Pattern | Effect |
|---|---|
| Empty section with placeholder text ("No upcoming events") | **Anti-pattern** — site looks dead (seen on Croatia, Bulgaria, Trento) |
| Hide section if empty | **Best** (rare in current sites) |
| Replace with relevant alternate ("Get notified when next event posts") | **Adopt** |

**Cursor India choice:** Hide what's empty; offer a "Get notified" form where relevant.

---

## 3. Cross-Site Design Anti-Patterns (kill list)

These appear across multiple sites and we will NOT do them:

1. **Emoji as section markers.** (📅 🕐 📍 on Brazil sites.) Use Lucide icons.
2. **Vanity stats.** ("100% engaged", "1 city covered".) Either real or omitted.
3. **Discord-as-only-CTA.** Add WhatsApp + Telegram.
4. **Luma-as-only-event-page.** Owned URL always.
5. **Placeholder upcoming events.** Hide if none.
6. **Flag emojis as branding.** Use color and content, not flags.
7. **"AI-powered revolution" rhetoric.** Calm, specific, technical.
8. **Identical copy across multi-city deployments.** Each chapter must be localized.
9. **Ambassador cards without context.** Always include city + role.
10. **Static OG images.** Dynamic per page.
11. **Loaded Luma iframes above the fold.** Lazy-load on click.
12. **No structured data.** Always emit `schema.org/Event`.
13. **Single-locale hard-coding with no path to vernacular.** Build i18n in from Day 1.
14. **Long, opinion-free "About" pages.** Have a manifesto instead.
15. **Dropdown mega-menus.** Flat nav.

---

## 4. Design Strengths to Preserve

Across the 20 sites, these design strengths recur and are worth keeping in our system:

1. **Bento photo grids in hero.** Visual proof of activity.
2. **Card-first information design.** Cards are the unit of community life.
3. **Eyebrow → headline → subhead → content rhythm.** Universal pattern.
4. **Real photos.** Universally adopted, universally on-brand.
5. **Restrained palettes.** Most sites get this right.
6. **Date-led event cards.** Date is the primary scannable signal.
7. **Single-CTA discipline** per fold.

---

## 5. New Design Moves Cursor India Will Introduce

These are *original* design contributions that no current community site has:

1. **Archetype-tagged event cards** (Cafe / Workshop / Meetup / Hackathon visible at a glance).
2. **Event detail canonical URLs** (not Luma deep links).
3. **Ambassador profile pages** (with what-they're-building, events hosted, recaps written).
4. **Audience-self-select panel** on the homepage (six personas).
5. **Interactive India chapter map** with marker pulses for "happening this week".
6. **Lazy-loaded Luma + YouTube embeds** with a "Load preview" button.
7. **Featured Projects with PR-based submission** flow.
8. **Hackathon-in-a-box downloadable kit.**
9. **Vernacular roadmap visible from Day 1** (even if content lands later).
10. **Manifesto on the homepage**, signed by the India lead.
11. **Disambiguation footer note** on every page (avoiding confusion with Cursor Inc. / cursor.de-style products).
12. **Dynamic OG images** per event + per chapter.
13. **`Cmd+K` search** across events, chapters, ambassadors, projects, blog.
14. **Calendar subscription** (`/events.ics`) and RSS feeds for blog and recaps.
15. **Code of Conduct linked from every event card.**

---

## 6. Design Quality Scorecard for the New Site

Use this scorecard as the acceptance criteria for the design phase. The site is "design done" when it scores ≥ 92.

| Criterion | Weight | Target |
|---|---:|---:|
| Brand alignment to Cursor canon (calm, technical, specific) | 12 | 12 |
| Type system rigor (one sans, one mono, scale, tabular nums) | 8 | 8 |
| Palette discipline (dark default, single accent, no gradients) | 8 | 8 |
| Real photos only, with quality grading | 6 | 6 |
| Event card archetype tagging present | 6 | 6 |
| Ambassador profile pages with city + bio + builds | 6 | 6 |
| Chapter map functional + accessible fallback | 6 | 6 |
| Lazy-loaded heavy embeds | 4 | 4 |
| Cmd+K search functional | 4 | 4 |
| Newsletter capture on-domain | 4 | 4 |
| Disambiguation FAQ present | 4 | 4 |
| Dynamic OG per page | 4 | 4 |
| `schema.org/Event` JSON-LD per event | 4 | 4 |
| Mobile parity (every component tested at xs) | 8 | 8 |
| WCAG 2.2 AA compliance (Lighthouse a11y ≥ 95) | 8 | 8 |
| Performance budget (Lighthouse perf ≥ 95 on home, ≥ 90 on event detail) | 8 | 8 |
| **Total** | **100** | **100** |

---

## 7. Visual Identity Mood (one-paragraph brief for the designer)

> Cursor India should feel like a quiet developer notebook left open on a café table in Indiranagar at 4 pm: warm light from one corner, real typography, a grid of photos that are clearly from real meetups, and the smell of filter coffee. No flash, no neon. The voice is a senior developer who is genuinely excited but doesn't need to perform it. The visual cadence is identical to cursor.com — but with warmer light, an India-coded marigold accent, and unmistakable specificity (real cities, real venues, real people, real numbers).
