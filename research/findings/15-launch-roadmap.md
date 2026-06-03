# Cursor India — Launch Roadmap

> Deliverable #14.
> A pragmatic, week-by-week plan from today to public launch and the first 90 days post-launch.

---

## 0. Assumptions

- Today is **2026-05-30**.
- Target **public launch**: **2026-07-19** (7 weeks from now), aligned to a soft launch event in Bengaluru the same weekend.
- 6 founding ambassadors are recruited or recruitable.
- 1 lead engineer (the maintainer of this repo) + 1 lead designer (volunteer) + 1 editorial lead.
- Domain `cursorindia.dev` available (verify; alternates in `/research/architecture/07 §17`).
- Cursor's community team is looped in for visibility (not required for go/no-go).

---

## 1. Pre-Launch Sprint (Weeks −7 to 0)

### Week −7 (2026-05-30 → 2026-06-05): Research wrap-up & alignment
- ✅ Complete this research package (DONE — this is the deliverable).
- Founding ambassador recruitment (target: 6 confirmed).
- Domain procured: `cursorindia.dev` + `cursorindia.com` redirect.
- GitHub org created: `cursor-india`.
- Cursor community team notified via `community@cursor.com` and forum.

**Deliverable:** sign-off on positioning + strategy + scope.

### Week −6: Brand + design system kick-off
- Designer onboarded; reads the full `/research` folder.
- Figma file created: tokens (color, type, spacing), wordmark, P0 components.
- Photographer brief shared with founding ambassadors.
- Each ambassador commits to host one event in Month 0–1.
- Discord server created; WhatsApp community created; Telegram channel created; Twitter/X handle reserved; LinkedIn page created.

**Deliverable:** brand pack (wordmark + tokens + 5 sample component frames).

### Week −5: Foundation engineering
- Next.js 15 (App Router) repo bootstrapped (`cursor-india/website`).
- Tailwind v4 + theme variables wired.
- Geist font setup.
- Storybook configured.
- All P0 *primitives* built (`Box`, `Heading`, `Text`, `Link`, `Icon`, `Image`, `Button`, `Input`, `Form`, `Card`, `Badge`, `Avatar`, `Separator`).
- CI: lint + typecheck + Lighthouse CI configured.

**Deliverable:** Storybook with primitives, deployed to a preview URL.

### Week −4: Layout & home pieces (engineering + content)
- `NavBar`, `Footer`, `Container`, `SectionHeader` built.
- `Hero` + `BentoGrid` + `StatStrip` built.
- `EventCard.Compact`, `EventList` built.
- `AmbassadorCard.Compact`, `AmbassadorGrid` built.
- `Manifesto`, `DisambiguationNote` built.
- Content team writes:
  - Manifesto final
  - Homepage copy (eyebrow, heading, subhead, CTA labels)
  - Tagline
  - 6 ambassador profiles (short bios)
  - 4 chapter pages (Bengaluru, Hyderabad, Delhi NCR, Mumbai) — even if some chapters are "forming"
  - About page + FAQ
  - Code of Conduct
- Photographer: 1 photo shoot per founding ambassador.

**Deliverable:** working home page on staging at `staging.cursorindia.dev`.

### Week −3: Routes & dynamic data
- Pages built: `/events`, `/events/[slug]`, `/chapters`, `/chapters/[city]`, `/ambassadors`, `/showcase`, `/resources`, `/join`, `/about`.
- MDX content pipeline (`gray-matter` + `next-mdx-remote` or Next.js MDX support).
- `EventCard.Expanded`, `EventDetailHero`, `LumaEmbed` (lazy).
- `CityHero`, `ChapterCard`, `ChapterList`.
- `ProjectCard`, `ProjectGrid` (with seed of 6 projects from founding ambassadors).
- `ResourceTile`, `ResourceGrid`.
- `NewsletterForm` wired to Buttondown.
- `JoinPanel` populated.
- SEO: sitemap, robots.txt, canonical, OG default, `Organization` JSON-LD.

**Deliverable:** all P0 routes navigable end-to-end on staging.

### Week −2: Polish, a11y, perf, SEO
- Dynamic OG image generation (`/api/og`).
- `schema.org/Event` JSON-LD per event.
- iCal feed (`/events.ics`).
- RSS feed (`/blog/rss.xml`) — even if blog is empty at launch.
- Lighthouse audit: hit 95+ on Performance, Accessibility, SEO, Best Practices.
- axe-core audit: zero violations on all P0 pages.
- Keyboard-only walkthrough.
- NVDA + VoiceOver smoke tests.
- Cross-browser test: Chrome, Safari, Edge, Firefox.
- Mobile test on real mid-tier Android.
- `ChapterMap` (lazy, accessible fallback).
- `CountdownTimer`.
- Vercel deployment with custom domain.

**Deliverable:** site is "production ready" per `/research/findings/13 §summary`.

### Week −1: Soft launch & content seed
- All 6 ambassador profiles polished and live.
- 4 chapter pages live with at least 1 upcoming event each.
- "Cafe Cursor Bengaluru — Launch Edition" event page published.
- Press kit assembled at `/press` (logos, founder bios, 1-page about).
- Newsletter sign-up form smoke tested.
- WhatsApp + Discord + Telegram links verified.
- Internal review: all 6 ambassadors + 2 trusted advisors review the site.
- Final pre-launch checklist (see §3 below).

**Deliverable:** site sign-off; launch checklist green.

### Week 0 — Launch week (2026-07-13 → 2026-07-19)

**Mon Jul 13:** Final QA, content freeze.
**Tue Jul 14:** DNS cutover; site live at `cursorindia.dev`.
**Wed Jul 15:** Internal announcement to ambassadors + Cursor community team.
**Thu Jul 16:** Soft public announcement on Cursor.com forum (Events thread).
**Fri Jul 17:** Public announcement on Twitter/X, LinkedIn (by all 6 ambassadors simultaneously).
**Sat Jul 19:** **Launch event** — Cafe Cursor Bengaluru "Launch Edition" at Third Wave Coffee Indiranagar.

---

## 2. First 90 Days Post-Launch

### Month 1 (Jul 19 → Aug 18)
- **Events:** 1 per founding chapter (Bengaluru, Hyderabad, Delhi NCR, Mumbai). 4 events total.
- **Content:** First monthly roundup (Jul 2026, published Aug 1).
- **Growth:** target 200 WhatsApp + 300 Discord + 500 newsletter sign-ups.
- **Press:** outreach to YourStory, Inc42, Entrackr for a "Cursor India launches" story.
- **Cursor team coordination:** ensure first 4 events appear on cursor.com/community feed.

### Month 2 (Aug 18 → Sep 17)
- **Events:** add Pune, Chennai chapters (1 event each). 6 events total this month.
- **Content:** Aug roundup; 2 ambassador interviews; 4 tutorial posts.
- **Growth:** 600 WhatsApp + 800 Discord + 1500 newsletter.
- **Hackathon:** first Cursor India hackathon in Bengaluru (Sep, 24h, partner-sponsored).
- **Campus:** first campus event at IIIT Bangalore or IIT Bombay.

### Month 3 (Sep 17 → Oct 17)
- **Events:** 8 events across 6 cities + 1 hackathon recap + 1 campus event.
- **Content:** Sep roundup; first project showcase batch (6 projects featured).
- **Growth:** 1200 WhatsApp + 1500 Discord + 3000 newsletter.
- **Founders' Roundtable #1** (closed, Bengaluru, 12 CTOs).
- **Vernacular:** first Hindi resource published.
- **Press:** at least one Indian dev media outlet has covered Cursor India.

---

## 3. Pre-Launch Checklist (gate to go-live)

### Engineering
- [ ] Lighthouse Performance ≥ 95 on home, ≥ 90 on event detail
- [ ] Lighthouse Accessibility ≥ 95 on all P0 pages
- [ ] Lighthouse SEO = 100 on all P0 pages
- [ ] axe-core zero violations on all P0 pages
- [ ] Sitemap.xml generated and submitted to Google Search Console + Bing
- [ ] Dynamic OG image generation tested for 5 routes
- [ ] `schema.org/Event` JSON-LD valid (test in Google Rich Results)
- [ ] iCal feed validates
- [ ] RSS feed validates
- [ ] Newsletter form submits successfully to Buttondown
- [ ] Discord/WhatsApp/Telegram links verified by 2 different people
- [ ] Cmd+K search works
- [ ] 404 page styled and functional
- [ ] Privacy policy + Terms + Code of Conduct pages live
- [ ] Disambiguation note on home + footer + about
- [ ] Plausible analytics installed and verified
- [ ] Sentry installed and verified (no PII captured)
- [ ] DNS configured with SPF, DKIM, DMARC for email
- [ ] All P0 routes return 200; orphan pages return 404
- [ ] Mobile parity verified on real device

### Content
- [ ] Manifesto signed by founding ambassadors
- [ ] 6 ambassador profiles complete with photo, bio, city, social links, what-they-are-building
- [ ] 4 chapter pages live (Bengaluru, Hyderabad, Delhi NCR, Mumbai); 2 more (Pune, Chennai) marked "forming"
- [ ] Launch event page published with hero, agenda, hosts, partners
- [ ] First 3 upcoming events published (one in each of Bengaluru, Hyderabad, Mumbai)
- [ ] About page + FAQ written
- [ ] At least 4 resources written (Getting started, Workflows, Hackathon kit, For students)
- [ ] 6 featured projects from founding ambassadors in `/showcase`
- [ ] Code of Conduct finalized
- [ ] Press kit assembled

### Brand
- [ ] Wordmark in SVG (light + dark)
- [ ] Color tokens documented (JSON + CSS)
- [ ] Type spec PDF
- [ ] Photography brief (1 page)
- [ ] OG image template in Figma

### Community
- [ ] WhatsApp community created and tested
- [ ] Discord server created with channels (#welcome, #announcements, #bengaluru, #hyderabad, #delhi-ncr, #mumbai, #pune, #chennai, #help, #showcase, #jobs, #random)
- [ ] Telegram channel created
- [ ] Twitter/X handle `@cursorindia` claimed; pinned tweet ready
- [ ] LinkedIn page `Cursor India` claimed
- [ ] Cursor community forum thread posted in `/c/events/4`
- [ ] Cursor's `community@cursor.com` notified
- [ ] Code of Conduct enforced; moderators briefed
- [ ] Welcome message for new joiners drafted (WhatsApp + Discord + Telegram)

### Legal / safety
- [ ] Privacy policy reviewed (focus: newsletter capture, analytics, no PII)
- [ ] Terms of use reviewed
- [ ] Code of Conduct reviewed
- [ ] Trademark check on the wordmark (we use "Cursor India" descriptively, not as a brand of Cursor's product)
- [ ] Photo release consent forms ready for events

---

## 4. Launch Day Comms Templates

### 4.1 Cursor.com forum post (Events thread)

> **Cursor India launches — Cafe Cursor Bengaluru on Sat Jul 19**
>
> We're a new community for Cursor users across India. We host Cafe Cursor, workshops, meetups, and hackathons in Bengaluru, Hyderabad, Delhi NCR, Mumbai, Pune, and Chennai — and a few more cities by Q4.
>
> Our launch event is **Cafe Cursor Bengaluru — Sat 19 Jul, 4 pm IST at Third Wave Coffee Indiranagar.** 60 seats; RSVPs already open.
>
> Site: https://cursorindia.dev
> Calendar: https://cursorindia.dev/events
> WhatsApp: [link]
> Discord: [link]
>
> Founding ambassadors: [6 names + handles]
>
> Happy to coordinate with the global Cursor team — `community@cursor.com` already cc'd.

### 4.2 Twitter/X thread (by India lead)

> Today we're launching Cursor India 🪶
>
> A community of developers, students, founders, and OSS contributors across India who build with Cursor every day.
>
> Cafe Cursor in 6 cities. Workshops. Hackathons. All volunteer. Site: cursorindia.dev
>
> 1/

(Use a single 🪶 — the only emoji allowed — as a unique brand mark, optional.)

### 4.3 LinkedIn post (by each ambassador)

> Excited to be one of the founding ambassadors of Cursor India.
>
> We're launching today, with chapters in Bengaluru, Hyderabad, Delhi NCR, Mumbai, Pune, and Chennai. We're not the official Cursor team — we're the people who use Cursor every day and want to make it easier for the next million Indian developers to ship.
>
> Our first event: Cafe Cursor Bengaluru, Sat 19 Jul at Third Wave Coffee Indiranagar. 60 seats. RSVP: cursorindia.dev/events
>
> If you build with Cursor, come say hi.

### 4.4 WhatsApp / Discord welcome message

> Welcome to Cursor India. We're a volunteer community of developers across India who build with Cursor.
>
> A few quick notes:
> 1. Our Code of Conduct is at cursorindia.dev/code-of-conduct — please read it.
> 2. Upcoming events are at cursorindia.dev/events.
> 3. Your city not listed? Reply with your city and we'll set up a chapter.
> 4. Got a project built with Cursor? Submit at cursorindia.dev/showcase/submit.
>
> Glad you're here.

---

## 5. Risk Register & Mitigations (launch-specific)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Launch event has low turnout | Low | Medium | Pre-RSVP cap; over-invite 1.3x to expected; ambassadors bring +1 each. |
| Site DNS issue at cutover | Low | High | Cutover at midnight IST; rollback plan to staging URL. |
| Cursor team raises trademark concern | Low | High | Engage `community@cursor.com` in advance; site uses "Cursor India" descriptively, not as a brand. |
| Discord spam at scale | Medium | Medium | Verified members, mod team, slow-mode enabled. |
| Press misrepresents us as "official Cursor India" | Medium | Medium | Press kit explicitly states we are volunteer community, not Cursor Inc. |
| Ambassador disagreement on direction | Medium | Medium | Lead has final call; documented governance. |
| Site bug post-launch | Medium | Low | Sentry monitoring; hotfix in <24h. |

---

## 6. Post-Launch Iteration Cycles

After Month 3, we operate in 4-week cycles:

- **Week 1:** plan next 4 weeks of events + content per chapter.
- **Week 2–3:** execute.
- **Week 4:** review (events held, content shipped, new members, feedback); publish roundup.

Site changes shipped as needed; major releases quarterly.

---

## 7. Quarterly Milestones (Year 1)

| Quarter | Key milestones |
|---|---|
| **Q1** (launch + 90 days) | Launch + 4 chapters + 6 ambassadors + first hackathon + first campus event + 3 monthly roundups + 1500 newsletter subs |
| **Q2** | 8 chapters + 12 ambassadors + Hindi vernacular launch + first founders' roundtable + 6 monthly roundups + Cursor SDK workshop series + 7500 newsletter subs |
| **Q3** | 12 chapters + 20 ambassadors + 25 Campus Leads + Tamil/Bengali/Telugu launch + first Cursor India online conference + 15000 newsletter subs |
| **Q4** | 18 chapters + 30 ambassadors + 50 Campus Leads + Marathi launch + annual report published + 20000 newsletter subs |

---

## 8. Beyond Year 1 (signposts, not commitments)

- **Year 2:** city scaling to 25+; full subdomain chapters where they outgrow the path-based model; ambassador summit; print/zine project.
- **Year 2:** open source the website as `cursor-india/website` for other communities to fork (close the loop on the upstream `luisfer/cursor-ambassador-evergreen` contribution).
- **Year 3:** sustained governance structure; ambassador grant program; integration with Cursor's Campus Lead program at scale; international ambassador exchanges (India ambassadors visit Thailand, vice versa, etc.).
