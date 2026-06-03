# Cursor Ambassador Evergreen Template — Technical & Strategic Audit

> Repository: [`luisfer/cursor-ambassador-evergreen`](https://github.com/luisfer/cursor-ambassador-evergreen)
> Author: Luis Fernando Romero Calero (Cursor Ambassador, Thailand)
> Stars: 14 · Forks: 0 (live deployment count is far higher — at least 14 sites use it; see `/research/competitors/`).
> Date analyzed: 2026-05-30

This audit answers the four questions posed in the project brief:
**what to keep · what to improve · what to redesign · what to expand for India.**

---

## 1. Repository Structure (verified from README + live deployments)

```
cursor-ambassador-evergreen/
├── app/
│   ├── page.tsx                       # Homepage composition
│   ├── recaps/[slug]/page.tsx         # Dynamic recap pages
│   └── slides/[id]/page.tsx           # Optional workshop slides
├── components/
│   ├── HeroHeader.tsx                 # Top section + bento photo grid
│   ├── FeaturedSection.tsx            # Featured resource card
│   ├── UpcomingEvents.tsx
│   ├── PastEvents.tsx
│   ├── AmbassadorSection.tsx
│   ├── Partners.tsx
│   └── WorldEventsCarousel.tsx        # Global event photos
├── content/                           # ← content-first design
│   ├── site.config.ts
│   ├── header-photos.ts               # Bento grid (4×4)
│   ├── featured.ts
│   ├── events.ts                      # upcoming + past + recap links
│   ├── ambassadors.ts
│   ├── partners.ts
│   ├── world-events.ts
│   ├── recaps/*.ts                    # one file per recap
│   └── locales/
│       ├── en.json
│       ├── th.json                    # Thailand reference locale
│       └── index.ts                   # bundle registry
├── lib/
│   └── i18n.tsx                       # runtime translation provider
├── modules/
│   └── slides/                        # optional decks
└── public/images/                     # all local assets
```

**Stack** (verified): Next.js (App Router) · React · Tailwind CSS · pnpm · Vercel as the canonical deploy target. No CMS. No database. Pure static content modules.

---

## 2. Architectural Strengths

| # | Strength | Why it matters |
|---|---|---|
| 1 | **Content-first, no-CMS** | Editors are just `.ts`/`.json` files. Ambassadors who can't run a Strapi / Sanity instance can still ship. |
| 2 | **Deterministic bento grid** | The hero uses explicit `row`/`col`/`rowSpan`/`colSpan` coordinates instead of CSS magic. Predictable, debuggable. |
| 3 | **i18n is opt-in** | Toggle only renders when `siteConfig.locales.length > 1`. Single-language sites stay simple. |
| 4 | **All local images** | No remote-image domain config; trivial Vercel deploys, no CDN-cost surprises. |
| 5 | **Recap slug ↔ event coupling** | `event.recapPath = '/recaps/foo'` + matching `content/recaps/foo.ts`. Clear referential integrity. |
| 6 | **Composable homepage** | `app/page.tsx` is literally an ordered list of section components. Reordering is trivial. |
| 7 | **Slides are a separate module** | `modules/slides/` is opt-in — keeps the template lightweight when not needed. |
| 8 | **MIT licensed** | Forks and improvements are unambiguous. |
| 9 | **Optimized for Cursor** | README is structured for the Cursor agent to navigate and modify. This is a meta-win — *the template itself is built to be edited by Cursor*. |
| 10 | **Battle-tested** | At least 14 live deployments at the time of this audit (Thailand, Serbia, Croatia, Netherlands, Austria, Germany, SLC, El Salvador, Bulgaria, Trento, Sri Lanka, Indonesia, Belgium, Calgary). |

---

## 3. Architectural Weaknesses / Gaps

| # | Weakness | Symptom in live deployments |
|---|---|---|
| 1 | **No structured city / chapter model** | All template sites are *single-city or single-country*. Multi-city scaling (India needs 8–12 cities Day 1) requires forking the data model. Italy had to spin up `trento.cursor-italy.com` as a separate subdomain. |
| 2 | **No event taxonomy field** | Cursor's own canon defines four archetypes (Cafe Cursor / Workshops / Meetups / Hackathons). The template's `events.ts` has only `status: 'upcoming' \| 'past'`. The site cannot filter by archetype. |
| 3 | **Recaps are TS modules, not MDX** | Every recap edit is a code edit. No non-developer contributor can write a recap without git + TS knowledge. |
| 4 | **No SEO module** | No `next-sitemap`, no per-page OG tags, no schema.org `Event` JSON-LD. Several live sites have title-tag-only SEO. |
| 5 | **No analytics module** | Each fork has to wire Plausible/Umami/GA themselves. |
| 6 | **No RSS / iCal export** | The community calendar lives only on Luma. No way to subscribe via standard calendar clients from the site itself. |
| 7 | **No partner / sponsor tier system** | `partners.ts` is a flat list. Real partnership programs need tiers (Title, Hosting, Community, Media). |
| 8 | **No newsletter integration** | Most sites externally link to a Luma "subscribe" instead of capturing on-domain. India needs an owned email list. |
| 9 | **No ambassador application form** | "Become an Ambassador" CTAs point to the global Cursor page. No way for a local community to triage local applicants. |
| 10 | **No project showcase / member directory** | Sri Lanka, Brazil BH, and Italy all *had to add this themselves*, each in incompatible ways. Should be in the template. |
| 11 | **No blog / longform module** | Sri Lanka added a blog; the template doesn't ship one. |
| 12 | **No dark/light theme switch** | Defaults to dark. Some Indian readers (especially older demographic, daylight readers) prefer light. |
| 13 | **No accessibility audit baked in** | No `lang` switching on locale change in some forks; no skip-to-content; bento grid alt text quality varies wildly. |
| 14 | **No `og-image` generation** | Social shares fall back to default. The Indian community will get high social traffic; default OG kills CTR. |
| 15 | **No semantic search over events / recaps** | At India scale (5+ cities × 12 events/yr = 60+ events/year), users need search. |

---

## 4. Component-by-Component Notes

### `HeroHeader.tsx` — 4×4 Bento Photo Grid
- **Strength:** the deterministic grid is more reliable than CSS auto-flow.
- **Weakness:** designers cannot live-preview without re-deploying; no `/admin` editor.
- **For India:** keep the deterministic grid, but **build a one-shot generator** (`pnpm run bento:from-folder ./uploads`) that auto-fills row/col coordinates for newly added photos. Reduces editor friction for ambassador hand-offs.

### `FeaturedSection.tsx`
- **Strength:** single, focused promo slot above the fold.
- **Weakness:** only one. India needs to feature **upcoming flagship event + ambassador-of-the-month + chapter spotlight** simultaneously. Either rotate, or convert this to a 3-slot featured row.

### `UpcomingEvents.tsx` / `PastEvents.tsx`
- **Strength:** clean separation by `status`.
- **Weakness:** events live in source code. India will have weekly events across cities — this becomes unmaintainable.
- **For India:** keep the typed module pattern but back it with a `content/events/*.mdx` directory pattern + `gray-matter` parsing, *or* a lightweight Notion/Google-Sheets sync. Source of truth stays in git; the editor is friendlier.

### `AmbassadorSection.tsx`
- **Strength:** simple, photo + name + social links.
- **Weakness:** no chapter / city association, no bio depth, no "what they're building".
- **For India:** extend with `city`, `chapter`, `bio` (long), `building` (current project), `looking_for` (collab signal). This turns the ambassador wall into a connection engine.

### `Partners.tsx`
- **Strength:** clean SVG-first logo grid.
- **Weakness:** no tier, no link UTM tracking, no benefit framework.
- **For India:** add `tier` enum and a `/partners` deep-page with the benefit ladder.

### `WorldEventsCarousel.tsx`
- **Strength:** ties local pride to the global movement.
- **Weakness:** static; ages quickly without manual updates.
- **For India:** keep, but also add an *India events carousel* — what's happening in other Indian cities right now — to drive *intra-country* discovery.

### `lib/i18n.tsx`
- **Strength:** lightweight, dot-path keys, parameter interpolation.
- **Weakness:** missing-key fallback returns the *key path*, which can leak to production text.
- **For India:** keep, but add a build-time check that fails CI if any registered locale has missing keys vs the canonical `en.json`. Critical because India will support multiple Indian languages (recommendation: English-only at launch, then add Hindi, Tamil, Bengali, Telugu in waves).

### `app/slides/[id]/page.tsx`
- **Strength:** "Cursor from Zero"-style workshop decks live in-repo, no third-party slides app.
- **Weakness:** TSX-as-slides is heavy for non-engineer presenters.
- **For India:** keep as the canonical format for ambassador-built decks, but also support MDX slides for non-engineers.

---

## 5. What to Keep Unchanged

These are template wins. Don't reinvent them.

1. **Next.js App Router** — current best-in-class for this surface area.
2. **Tailwind** — every Cursor community site uses it; ambassador talent pool is fluent.
3. **Content-first architecture** — even when we extend, keep `content/` as the source of truth.
4. **Deterministic bento grid coordinates.**
5. **MIT license + open contribution model.**
6. **No CMS by default.** (Optional sync layer is fine; CMS as required dependency is not.)
7. **i18n opt-in pattern.**
8. **Vercel as canonical deploy target.**
9. **README written for Cursor agents to read.**
10. **All-local image strategy.**

---

## 6. What to Improve

1. **Event model** — add `archetype` (cafe/workshop/meetup/hackathon), `city`, `venue`, `partners[]`, `language`, `cost`, `capacity`.
2. **Recap format** — migrate to MDX with frontmatter so non-engineers can write recaps.
3. **SEO** — ship `next-sitemap`, dynamic OG generation (`@vercel/og`), `schema.org/Event` JSON-LD per event, robots.txt.
4. **Analytics** — ship Plausible or Umami self-host + a privacy-respecting consent banner.
5. **iCal feed** — `/events.ics` for calendar subscribers.
6. **RSS feed** — `/blog.rss` and `/recaps.rss`.
7. **Partner tiering + UTM tracking.**
8. **Owned newsletter capture** (Buttondown / Resend / ConvertKit) instead of Luma-only.
9. **Build-time i18n key validation.**
10. **a11y baseline** — skip-to-content, color-contrast tokens, focus-visible, ARIA on the bento grid, alt-text linter.

---

## 7. What to Redesign

These are first-principles redesigns specifically for the India scale.

### 7.1 Multi-Chapter Architecture
The template assumes one community. India is many cities. Redesign the data model so:
```
content/chapters/
├── bengaluru.mdx
├── hyderabad.mdx
├── delhi.mdx
├── mumbai.mdx
├── pune.mdx
├── chennai.mdx
├── kolkata.mdx
└── ...
```
Each chapter has its own lightweight page (`cursorindia.dev/chapters/bengaluru`) and aggregates into the homepage. Routing pattern: `/chapters/[city]` with a chapter-scoped events list, ambassador list, and recap feed.

### 7.2 Ambassador Profile Pages
Today: a card. Tomorrow: `/ambassadors/[handle]` page with bio, projects, talks given, recaps hosted, contact CTAs. Drives accountability and recognition.

### 7.3 Event Detail Pages
Today: a card linking to Luma. Tomorrow: `/events/[slug]` with venue map, agenda, speakers, partners, photos, recap link — *owned canonical URL*, Luma is the registration backend not the landing page.

### 7.4 Project / Showcase Module
Sri Lanka and Indonesia both bolted this on. The India template should ship `content/projects/*.mdx` and a `/showcase` page from Day 1. India has world-class indie-hacker energy; this is non-negotiable.

### 7.5 Resources / Learn Hub
Cursor.com/learn is the global learning surface. India needs a *regional learning hub* with curated playlists, vernacular content, college-tour materials. Redesign `FeaturedSection` into a `/resources` tree: getting-started, advanced workflows, Cursor-for-students, Cursor-for-startups, vernacular guides.

### 7.6 Apply-to-Lead Flow
Replace the global "Become an Ambassador →" link with a *local intake form* that captures applicant city, role (Ambassador / Campus Lead / Chapter Co-organizer / Volunteer), portfolio links, and routes them to the relevant lead.

---

## 8. What to Expand Specifically for India

| Expansion | Rationale |
|---|---|
| **Campus Leads as a first-class module** | India has 5000+ engineering colleges. Campus Leads will outnumber Ambassadors 5:1 within 12 months. Needs its own page, directory, application flow. |
| **Tier-2/3 city visibility** | Indian community sites must not be Bengaluru-only. Build the chapter system to give Indore, Jaipur, Coimbatore, Bhubaneswar, Guwahati, Chandigarh equal visual weight. |
| **Multilingual roadmap** | Launch English; Q2: add Hindi; Q3: add Tamil + Bengali + Telugu + Marathi. Use the existing i18n module + a translation contribution flow. |
| **Vernacular event recaps** | Some recaps in original language + English. Honours the locality. |
| **Startup founders track** | India has the world's third-largest startup ecosystem. Add a `/founders` section with Cursor-for-startups workflows, founder ambassador profiles, partner program with YC India / Sequence / Lightspeed / Accel / Z47. |
| **Student / educator partnerships** | Tie into Cursor's `cursor.com/students` flow + a `/campus` page with IIT/IIIT/BITS/NIT/IISc campus club playbooks. |
| **Open-source contributor track** | India is OSS heavy. Add an OSS contributor recognition stream. |
| **Hackathon-in-a-box kit** | Downloadable runbook for ambassadors to host their first hackathon: venue checklist, sponsor email templates, judging rubric, prizes from Cursor. |
| **WhatsApp + Telegram integration** | Sri Lanka already uses WhatsApp; India will too. Add these alongside Discord/Reddit/Forum. Don't make Discord the only entry. |
| **UPI-friendly registration** | If we ever charge for ticketed events, registration must support UPI. Luma supports this; the template should document it. |
| **Time-zone awareness (IST)** | Lock the calendar to IST display and label it clearly. |
| **Diversity & inclusion section** | Women in Cursor India track, accessibility-first events, regional language support. |
| **Connection to global Cursor team** | "Office hours with the Cursor team" — recurring slot for India ambassadors to bring questions to the Cursor team and surface answers publicly. |

---

## 9. Recommended Tech Decisions for the India Fork

| Layer | Recommendation | Reasoning |
|---|---|---|
| Framework | **Next.js 15 App Router** (keep) | Template parity; SSR/ISR for SEO. |
| Styling | **Tailwind CSS v4** | Matches Cursor brand pattern; small bundle. |
| Components | **Radix Primitives + shadcn/ui** | Accessible by default; pairs naturally with Tailwind; matches Cursor's own UI vocabulary. |
| Icons | **Lucide** | Open, free, Tailwind-friendly. |
| Animation | **Motion (Framer Motion v12)** sparingly + native CSS where possible | Restrained motion, see brand doc §9. |
| Forms | **react-hook-form + zod** | For ambassador / sponsor / hackathon applications. |
| Email capture | **Resend + Buttondown / ConvertKit** | Owned list, not Luma-only. |
| Calendar | **Luma API** for sync; **`ics`** lib for `/events.ics` export | Two-way sync, on-domain canonical URLs. |
| Content | **MDX + gray-matter + remark/rehype** | Non-engineers can contribute recaps and blog posts. |
| Search | **Pagefind** (static) or **Algolia DocSearch** | Index events, recaps, blog, ambassadors. |
| Analytics | **Plausible (self-host or cloud)** | Privacy-first, no consent banner needed in many jurisdictions. |
| Image | **next/image** + local-first + Cloudinary fallback for high-volume galleries | Mostly local; Cloudinary for hackathon-galleries. |
| Auth (later) | **Clerk** or **NextAuth** | Only when ambassador dashboards land. |
| Deploy | **Vercel** primary; **Cloudflare Pages** as cost fallback | Template parity. |
| Repo | **GitHub** under `cursor-india-community/website` (org) | Public, MIT, fork-friendly. |

---

## 10. Audit Summary Score Card

| Dimension | Score (1–10) | Notes |
|---|---:|---|
| Code quality | 8 | Clean, minimal, well-typed. |
| Documentation | 9 | README is genuinely excellent for AI agents and humans. |
| Extensibility | 6 | Easy to fork, harder to extend without breaking other forks. |
| Multi-city scaling | 3 | Not designed for it. India needs a redesign here. |
| SEO out of the box | 4 | Missing sitemap, OG, JSON-LD. |
| Accessibility out of the box | 5 | Decent base, no audit. |
| Event richness | 5 | Status-only model. |
| Ambassador richness | 5 | Cards-only. |
| i18n | 7 | Lightweight and works; missing CI validation. |
| Recap workflow | 5 | TS-only is too high-friction. |
| **Overall** | **5.7** | A great *starter*; not a great India *platform*. |

---

## 11. Verdict

**Use the template as inspiration and as the canonical baseline ambassador can recognize, but build the Cursor India website as a fresh Next.js project that:**

1. **Adopts** the template's content-first philosophy, naming, and component patterns.
2. **Extends** to a chapter-aware, multi-city, SEO-rich, accessibility-first platform.
3. **Contributes back** the generic improvements (event archetype enum, MDX recaps, SEO module, a11y audit) as PRs to the upstream template, so every Cursor community benefits.

This is the most respectful and most strategic move: we honor the upstream, we serve our scale, and we lift every other community's site in the process.
