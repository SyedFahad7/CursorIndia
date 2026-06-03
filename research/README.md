# Cursor India — Research Package

> Research, planning, architecture, and design strategy for the Cursor India Community website.
> All findings, audits, wireframes, and recommendations live here.
> Implementation has **not** started yet — this folder is the contract for it.

**Date of this package:** 2026-05-30

---

## How to read this in 15 minutes

If you only read three documents, read these in order:

1. **[`findings/16-final-recommendation-report.md`](./findings/16-final-recommendation-report.md)** — the single-page synthesis of everything.
2. **[`findings/06-cursor-india-strategy.md`](./findings/06-cursor-india-strategy.md)** — positioning, audience, voice, growth.
3. **[`architecture/07-sitemap-and-information-architecture.md`](./architecture/07-sitemap-and-information-architecture.md)** — what we're actually building.

If you have an hour, also read:

4. **[`brand/01-cursor-brand-analysis.md`](./brand/01-cursor-brand-analysis.md)**
5. **[`brand/08-design-system.md`](./brand/08-design-system.md)**
6. **[`architecture/11-homepage-blueprint.md`](./architecture/11-homepage-blueprint.md)**
7. **[`findings/15-launch-roadmap.md`](./findings/15-launch-roadmap.md)**

If you're an engineer joining the build, also read:
- [`architecture/12-component-inventory.md`](./architecture/12-component-inventory.md)
- [`audits/02-ambassador-template-audit.md`](./audits/02-ambassador-template-audit.md)
- [`findings/13-seo-accessibility-performance.md`](./findings/13-seo-accessibility-performance.md)

If you're a writer / editor joining, also read:
- [`content/14-content-strategy.md`](./content/14-content-strategy.md)

---

## Full Document Map

### `/brand`
| File | What it covers |
|---|---|
| [`01-cursor-brand-analysis.md`](./brand/01-cursor-brand-analysis.md) | Brand personality, palette, typography, motion, IA across cursor.com, /learn, /blog, /community, /students, /enterprise, forum |
| [`08-design-system.md`](./brand/08-design-system.md) | Tokens, type scale, color, spacing, components, motion, accessibility, photography |

### `/audits`
| File | What it covers |
|---|---|
| [`02-ambassador-template-audit.md`](./audits/02-ambassador-template-audit.md) | Deep audit of `luisfer/cursor-ambassador-evergreen` template — keep / improve / redesign / expand for India |
| [`09-design-audit.md`](./audits/09-design-audit.md) | Cross-cutting design synthesis across all 20 community sites |

### `/competitors`
| File | What it covers |
|---|---|
| [`03-community-site-audits.md`](./competitors/03-community-site-audits.md) | Per-site audits for all 20 Cursor community websites with scores |
| [`04-comparison-matrix.md`](./competitors/04-comparison-matrix.md) | Feature × site matrix, final ranking, top 10 ideas to reuse, top 10 mistakes to avoid |

### `/findings`
| File | What it covers |
|---|---|
| [`05-external-inspiration-analysis.md`](./findings/05-external-inspiration-analysis.md) | High-value patterns extracted from `buildclub.ai` and `joinhabitat.eu` |
| [`06-cursor-india-strategy.md`](./findings/06-cursor-india-strategy.md) | Strategic context, positioning, voice, audiences, journeys, growth plan |
| [`13-seo-accessibility-performance.md`](./findings/13-seo-accessibility-performance.md) | SEO, a11y, and performance recommendations (consolidated) |
| [`15-launch-roadmap.md`](./findings/15-launch-roadmap.md) | 7-week pre-launch sprint + 90-day post-launch plan |
| [`16-final-recommendation-report.md`](./findings/16-final-recommendation-report.md) | The single decision-maker-ready document |

### `/architecture`
| File | What it covers |
|---|---|
| [`07-sitemap-and-information-architecture.md`](./architecture/07-sitemap-and-information-architecture.md) | Complete sitemap, URL conventions, nav structure, data model, events/chapters/ambassador architecture |
| [`11-homepage-blueprint.md`](./architecture/11-homepage-blueprint.md) | Section-by-section homepage build contract |
| [`12-component-inventory.md`](./architecture/12-component-inventory.md) | All components with phase (P0–P3), dependencies, and Storybook coverage |

### `/wireframes`
| File | What it covers |
|---|---|
| [`10-wireframes.md`](./wireframes/10-wireframes.md) | Low-fidelity text wireframes for Home, Events, Event Detail, Chapter, Ambassador profile, Showcase, Submit, Join, About, Resources, Blog |

### `/content`
| File | What it covers |
|---|---|
| [`14-content-strategy.md`](./content/14-content-strategy.md) | Pillars, cadence, voice, templates, vernacular roadmap, editorial governance, distribution |

### `/screenshots` (intentionally minimal)
This folder is reserved for static reference images. The 20 competitor sites were analyzed live via fetched content rather than screenshots; if a future contributor wants to capture visual references, they belong here. Each subfolder mirrors a site (`thailand/`, `germany/`, etc.).

---

## What This Research Established

### 1. Strategic
- Cursor India fills a real gap (India is not currently visible on cursor.com/community).
- We position as a community outpost, not Cursor's official India team.
- Six audience segments; each gets a clear journey.
- Year-1 target: 18 chapters, 30 ambassadors, 150 events, 20K newsletter subs.
- < ₹50,000 central cost in Year 1.

### 2. Architectural
- Multi-chapter model from Day 1 (the biggest single departure from the template).
- Canonical event URLs (Luma as backend, not landing).
- Ambassador profile pages.
- Featured Projects with PR-based submission.
- Vernacular roadmap visible from Day 1.
- Cmd+K search, dynamic OG, iCal, RSS, `schema.org/Event` structured data.

### 3. Design
- Cursor brand discipline: dark by default, single warm marigold accent, Geist type, restrained motion.
- 100-point design quality scorecard with target 92+ at launch.
- WCAG 2.2 AA accessibility baseline.
- Performance budget: Lighthouse 95+ on home.

### 4. Implementation
- 7-week pre-launch sprint to **2026-07-19** launch.
- P0 component inventory built and tested.
- Soft launch event: Cafe Cursor Bengaluru — Launch Edition.

### 5. Content
- 6 content pillars: Events, Roundups, People, Craft, Showcase, Voice.
- Monthly roundup cadence; weekly tutorials; bi-weekly interviews.
- Vernacular roadmap: Hindi Q2 → Tamil/Bengali/Telugu Q3 → Marathi Q4.
- Distribution across 10 channels.

---

## What This Research Did NOT Do

To stay honest:

- **No high-fidelity Figma designs** — those come next, by a designer working from `/brand/08-design-system.md` + `/wireframes/10-wireframes.md`.
- **No code** — implementation starts after sign-off on this package.
- **No live ambassador recruiting** — the founding 6 must be confirmed before the launch sprint starts.
- **No live partner commitments** — partners are courted during the build, not before.
- **No screenshots captured live** — the 20 competitor sites were analyzed via their public HTML/content. The `/screenshots` folder is reserved for visual references to add during the design phase.

---

## Open Questions for the Founding Team

These five questions need explicit answers before implementation begins:

1. **Domain:** confirm `cursorindia.dev` (recommended) or alternative?
2. **Chat:** confirm WhatsApp + Discord as parallel primary channels?
3. **Founding 6 ambassadors:** named list confirmed?
4. **Launch date:** confirm `2026-07-19` (or shift)?
5. **Brand color:** confirm marigold `#E68A2E` (or alternate to teal)?

Once these are answered, implementation begins.

---

## Acknowledgements

- **Luis Fernando Romero Calero** for the open-source [`cursor-ambassador-evergreen`](https://github.com/luisfer/cursor-ambassador-evergreen) template that every Cursor community now builds on.
- **Cursor Germany** for the disambiguation FAQ pattern and the interactive map / sticker wall — the most innovative community site of the 20 studied.
- **Cursor Sri Lanka** for the monthly Roundups, Featured Projects, and Volunteer Team patterns — the closest sibling to what we'll build.
- **Cursor Colombia** for the lazy-load discipline and the perfect on-brand voice ("kept simple and close").
- **Cursor Thailand** for setting the reference implementation standard the rest of us measure against.
- **Build Club** and **Habitat** for inspiration we adapted carefully without copying.
- **The Cursor community team** for building the ambassador program that makes any of this possible.

---

End of `/research/README.md`. Implementation phase starts at the first commit of the website.
