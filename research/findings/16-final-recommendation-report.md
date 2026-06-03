# Cursor India — Final Recommendation Report

> Deliverable #15. The single document a decision-maker can read in 15 minutes and act on.
> Supersedes nothing. Synthesizes everything in `/research`.

---

## 1. The Recommendation in One Page

**Build a new Cursor India community website from scratch on Next.js 15, deeply aligned to Cursor brand and the ambassador-evergreen template's philosophy, but architecturally redesigned for India's multi-city, multilingual, college-heavy, founder-rich scale.**

- **Domain:** `cursorindia.dev` (primary), `cursorindia.com` redirect.
- **Stack:** Next.js (App Router) · Tailwind v4 · Radix + shadcn/ui · MDX content · Pagefind search · Buttondown newsletter · Plausible analytics · Vercel deploy.
- **Brand:** dark by default, single warm marigold accent (`#E68A2E`), Geist typography, restrained motion, real photos only.
- **Architecture:** chapters as first-class entities · event archetype tagging · ambassador profile pages · project showcase · vernacular roadmap · disambiguation FAQ · canonical event URLs · dynamic OG · iCal/RSS · `schema.org/Event`.
- **Launch:** **2026-07-19** with a Cafe Cursor Bengaluru "Launch Edition".
- **Year-1 target:** 18 chapters, 30 ambassadors, 150 events, 20K newsletter subscribers, vernacular content in 5 Indian languages.
- **Total central cost Year 1:** **< ₹50,000** (volunteer-led; sponsor-funded events).

---

## 2. The Five Decisions That Must Be Made Now

Each of these is a strategic decision the founding ambassadors need to confirm before implementation begins.

| # | Decision | Recommendation | Why |
|---|---|---|---|
| 1 | **Domain** | `cursorindia.dev` primary | `.dev` codes the audience; `.com` redirect ensures discoverability. |
| 2 | **Chat primacy** | WhatsApp + Discord (parallel, both first-line) | India is WhatsApp-first; Discord adds depth for engaged subset. |
| 3 | **Fork vs new build** | **New build, inspired by the template; PRs back to upstream for generic improvements** | The template is excellent for single-city deployments; India's scale requires more. |
| 4 | **Vernacular at launch** | English-only at launch; Hindi in Q2; Tamil/Bengali/Telugu in Q3; Marathi in Q4 | Quality > quantity; build the contribution flow before flooding it. |
| 5 | **Top-nav set** | Events · Chapters · Ambassadors · Showcase · Resources · Blog · Join | Each item is a distinct journey; no mega-menus; mirrors strategy doc §5. |

---

## 3. The Five Things We Will Do Differently from Every Other Cursor Community Site

These are *original contributions* that no current community site has.

1. **Chapter-aware architecture from Day 1.** Every event, ambassador, project, and recap is tagged with a chapter. The site supports India's geography natively, not as an afterthought.
2. **Canonical event URLs (not Luma deep-links).** Each event has a permanent URL with structured data, dynamic OG, and a recap that lives at the same URL post-event.
3. **Ambassador profile pages.** Cards link to full profile pages with bios, builds, hosted events, written recaps. Turns ambassadors into a directory, not a logo wall.
4. **Featured Projects with PR-based submission.** Members ship things; we celebrate them at the source-of-truth level (an MDX file in `content/projects/`).
5. **Vernacular roadmap visible from Day 1.** Even before Hindi content lands, the structure shows the commitment.

Plus the *non-trivial set of improvements* covered in `/research/audits/09-design-audit.md §5`.

---

## 4. The Five Mistakes We Will Not Repeat

From `/research/competitors/04-comparison-matrix.md` top-10-avoid list (highest leverage 5):

1. **Bro-y SaaS tone.** No "AI revolution", no flag emojis, no vanity stats.
2. **Empty placeholder sections.** Hide what is empty; offer "Get notified" alternates.
3. **Discord-only chat entry.** WhatsApp + Telegram for India reality.
4. **Luma-only event surface.** Owned canonical URLs always.
5. **Static OG images.** Dynamic per page; share-worthy by default.

---

## 5. What This Site Will Mean to Each Audience

| Audience | What they get in 5 seconds |
|---|---|
| Working developer | "There's a meetup in my city next Saturday. RSVP." |
| Student | "I can get free Cursor and join a Campus Lead community." |
| Indie hacker | "Other Indian builders are shipping; I can showcase my project." |
| Founder | "There's a closed-door roundtable next month; here's how to get in." |
| OSS contributor | "My work gets recognized in the monthly roundup." |
| Aspiring ambassador | "Here's how I host my first Cafe Cursor in 4 weeks." |
| Cursor team (Anysphere) | "Cursor India is well-aligned, well-organized, low-risk, high-leverage." |
| Press / partners | "This is a serious community, with serious numbers and a serious roadmap." |

---

## 6. Resources Required

### People (Year 1)
- 6 founding ambassadors (volunteer, ~5 hr/week each)
- 1 lead engineer / maintainer (volunteer or partially-funded)
- 1 lead designer (volunteer; can be one of the ambassadors)
- 1 editorial lead (volunteer; can be one of the ambassadors)
- Per-chapter co-organizers as we scale (volunteer)
- Per-language vernacular reviewers (volunteer)

### Money (Year 1)
- Domain: ~₹1,000
- Newsletter (Buttondown free tier; paid in Q4 if subs > 1k): ~₹0 → ₹8,000
- Plausible (self-host or cloud): ~₹0 → ₹10,000
- Resend transactional emails (if used): ~₹0 → ₹5,000
- Cloudinary fallback for hackathon galleries (free tier): ~₹0
- Vercel hosting (free tier likely sufficient): ~₹0
- Stickers, banners for events: per-event sponsor-funded
- Misc (legal review, photography): ~₹25,000

**Estimated central cost Year 1: ≤ ₹50,000.** Excellent leverage.

### Tools (all free / mostly free)
- GitHub (free for public repo)
- Vercel (free for personal/community)
- Buttondown (free up to 100 subs)
- Plausible (self-host free)
- Resend (free tier)
- Pagefind (free)
- Figma (free for open-source / community)

---

## 7. Success Metrics (12-month review)

| Metric | Threshold for "successful Year 1" |
|---|---|
| Active chapters | ≥ 15 cities |
| Ambassadors | ≥ 25 |
| Campus Leads | ≥ 40 |
| Events held | ≥ 120 |
| Recaps published | ≥ 100 |
| Newsletter subscribers | ≥ 15,000 |
| WhatsApp community members | ≥ 10,000 |
| Discord members | ≥ 12,000 |
| Featured projects | ≥ 80 |
| Vernacular content pieces | ≥ 25 |
| India events shown on cursor.com/community feed | ≥ 60% of events |
| Lighthouse scores on all P0 pages | ≥ 95 / 95 / 100 / 95 |
| Inbound press mentions in Indian dev media | ≥ 5 |
| Internal NPS from ambassadors | ≥ 50 |

Failing any single one is **not** a failure; failing 4+ is.

---

## 8. What Could Go Wrong

The honest list (full version in `/research/findings/06 §8`):

1. **Bus factor on the lead.** Always have two co-leads per chapter, two for the central org.
2. **Discord drama / toxicity.** Strong CoC + active mods + low tolerance.
3. **Cursor team distancing.** Stay close to `community@cursor.com`; never overclaim.
4. **Single-city dominance.** Multi-chapter from Day 1; rotate featured chapter weekly.
5. **Vernacular quality slip.** Native-speaker review or don't publish.
6. **Sponsor over-commitment.** No exclusive deals at launch; clear tiers.
7. **Diversity gaps.** Explicit diversity goals; Women in Cursor India track from Q2.

---

## 9. Comparison: Where Cursor India Will Sit

After Year 1, this is where Cursor India should rank against the current 20 community sites scored in `/research/competitors/04-comparison-matrix.md`:

| Rank | Site | Score | Notes |
|---:|---|---:|---|
| **1 (projected)** | **cursorindia.dev** | **96** | New site, projected to be the new benchmark. |
| 2 | cursorgermany.com | 88 | Current #1. |
| 3 | cursorsrilanka.com | 86 | |
| 4 | cursorcolombia.com | 82 | |
| 5 | cursorthailand.com | 78 | The reference. |
| ... | ... | ... | ... |

To earn the #1 rank, Cursor India must execute on the 14 "design quality scorecard" criteria in `/research/audits/09-design-audit.md §6` *and* sustain the editorial cadence in `/research/content/14-content-strategy.md §2`. The site is necessary but not sufficient; consistent activity is what closes the gap.

---

## 10. The Defensible Strategic Position

By the end of Year 1, Cursor India will be:

- **The default landing place** for any Indian developer searching "cursor india", "cursor meetup [city]", or "cursor for students india".
- **The clearest model** of a chapter-aware community website in the Cursor ecosystem (likely upstream-influencing the template).
- **A meaningful contributor** to Cursor's global community signal — 60%+ of India events visible on cursor.com/community.
- **A pipeline** to the Cursor Ambassador and Campus Lead programs.
- **A bridge** between Cursor's English-only product surface and India's multilingual developer reality.

That position is hard to displace once held.

---

## 11. What We're Not Promising

To stay honest:

- We are not promising to be **everything to every Indian developer**. We are a community; we will be small in absolute terms vs. India's developer population.
- We are not promising **monetary career outcomes**. Cursor is a tool; jobs come from skill + network, not membership.
- We are not promising **paid certifications**. We are not a bootcamp.
- We are not promising **Cursor product changes** from India feedback. We will *surface* feedback; Cursor decides.
- We are not promising **uninterrupted operation**. Volunteer communities ebb. We commit to transparency about state of the community in monthly roundups.

Honesty is part of the brand.

---

## 12. The Single Most Important Idea in This Report

> **Cursor India is the depth-and-local-trust layer that cursor.com/community links *into*, not the layer that competes with it.**

Everything else — the design, the architecture, the chapters, the content, the events, the roadmap — serves that single idea.

If we hold that line, we will build the strongest, most scalable, most professional Cursor community website globally while remaining unambiguously aligned with Cursor's ecosystem, ambassador program, and community philosophy.

That is the goal. This research package is the plan. Implementation begins at the first commit.

---

## Appendix: Reading Order for the Research Package

For anyone joining this project, read in this order:

1. `README.md` (in `/research`) — navigation guide.
2. `/research/findings/06-cursor-india-strategy.md` — what we believe.
3. `/research/findings/16-final-recommendation-report.md` — this document.
4. `/research/brand/01-cursor-brand-analysis.md` — how Cursor speaks.
5. `/research/architecture/07-sitemap-and-information-architecture.md` — what we're building.
6. `/research/architecture/11-homepage-blueprint.md` — the contract for the homepage.
7. `/research/brand/08-design-system.md` — the contract for visuals.
8. `/research/audits/02-ambassador-template-audit.md` — what we are inheriting from the template.
9. `/research/competitors/03-community-site-audits.md` + `04-comparison-matrix.md` — what other communities have done.
10. `/research/findings/05-external-inspiration-analysis.md` — what we are stealing from outside the Cursor world.
11. `/research/wireframes/10-wireframes.md` — page anatomy.
12. `/research/architecture/12-component-inventory.md` — engineering backlog.
13. `/research/findings/13-seo-accessibility-performance.md` — non-negotiables.
14. `/research/content/14-content-strategy.md` — what we publish.
15. `/research/findings/15-launch-roadmap.md` — when we ship.
16. `/research/audits/09-design-audit.md` — synthesis across all sites.

End of report.
