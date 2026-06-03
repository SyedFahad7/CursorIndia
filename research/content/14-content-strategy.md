# Cursor India — Content Strategy

> Deliverable #13.
> Inputs: brand audit (§1), strategy (§5), IA (§6), homepage blueprint (§8), SEO doc (§10).

This document defines **what we publish, who writes it, how often, in what voice, in what languages, and to what effect.**

---

## 1. Content Pillars

Six pillars carry all our content. Every piece must fit one (or, rarely, two).

| Pillar | Purpose | Surface |
|---|---|---|
| **EVENTS** | Document every event end-to-end | `/events/[slug]` + recap |
| **ROUNDUPS** | Monthly digest of the whole community | `/blog/roundups/[slug]` |
| **PEOPLE** | Ambassador profiles, builder interviews | `/ambassadors/[handle]`, `/blog?tag=interview` |
| **CRAFT** | Cursor workflows, tutorials, vernacular guides | `/resources/*`, `/blog?tag=tutorial` |
| **SHOWCASE** | Member-built projects | `/showcase/[slug]` |
| **VOICE** | Manifesto pieces, opinion, ecosystem context | `/about`, `/blog?tag=community` |

---

## 2. Editorial Cadence (Year 1)

| Frequency | Content type | Owner |
|---|---|---|
| Per event (~12/month) | Event page (pre-event) | Event host |
| Per event (~10/month) | Recap (post-event, within 7 days) | Event host or chapter writer |
| Monthly (1) | Roundup | Rotating chapter lead + India lead reviews |
| Bi-weekly (2/month) | Interview / spotlight | India editorial lead |
| Weekly (4/month) | Tutorial / craft post | Volunteer writers + India editorial lead |
| Quarterly (1/3 months) | Ecosystem / opinion piece | India lead, signed |
| Vernacular (Q2+) | Translated resources | Native-speaker volunteers |
| Talks (per event) | Recorded talk uploaded to YouTube + embedded | Speaker + chapter lead |

**Total Year-1 output projection:**
- ~120 events
- ~100 recaps
- 12 roundups
- 24 interviews
- 48 tutorials
- 4 opinion pieces
- 30+ vernacular pieces (starting Q2)
- ~60 talks recorded

That's ~400 content artifacts in Year 1. Sustainable because most are short and ambassador-distributed.

---

## 3. Voice & Style Guide

Codified from `/research/findings/06-cursor-india-strategy.md §4`.

### 3.1 The four voice attributes

1. **Calm** — confidence without volume.
2. **Specific** — concrete > vague, always.
3. **Technical** — respect the reader.
4. **Warm** — community, not brochure.

### 3.2 Mechanics

- **Spelling:** UK English (organise, recognise, behaviour, colour). Document in the style guide.
- **Date format:** `Sat, 12 Jul 2026 · 4 pm IST` — Day-of-week, dd Mmm yyyy, time with IST suffix.
- **Time:** 12-hour with `am`/`pm`. Always IST. (Time-zone label mandatory.)
- **Numbers:** Indian numbering for amounts > 100,000 (e.g. `₹1 lakh prize pool`); Western numbering elsewhere.
- **Currency:** `₹` symbol, never "Rs." or "INR" in body copy.
- **Cities:** spelled in the way locals do (Bengaluru, not Bangalore; Mumbai, not Bombay; Chennai, not Madras; Kolkata, not Calcutta; Pune is Pune; Delhi NCR is the umbrella for Delhi + Gurgaon + Noida).
- **Names:** preserve diacritics where author intends.
- **Punctuation:** Oxford comma yes. Em dash with no spaces (`—like this`). En dash for ranges (`4–8 pm`).
- **Headlines:** Sentence case. Not Title Case.
- **Emoji:** Almost never. Single `→` arrow on CTA links is the only "icon" in copy.
- **Exclamation marks:** Maximum one per page. Usually zero.

### 3.3 Forbidden phrases (kill list)

- "world-class"
- "cutting-edge"
- "best-in-class"
- "next-level"
- "game-changer" / "game-changing"
- "revolutionary"
- "AI-powered" (Cursor uses it for product; we use "built with Cursor" or "agentic" precisely)
- "thought leader"
- "10x your career"
- "exclusive" (we are inclusive)
- "click here" → use verb + arrow
- "amazing" / "awesome" / "incredible" — replace with specific claim

### 3.4 Preferred constructions

| Vague | Specific |
|---|---|
| "Many developers attended" | "47 developers attended" |
| "Some great projects were demoed" | "Five projects demoed: [list]" |
| "Awesome venue" | "Hosted at Third Wave Coffee, Indiranagar" |
| "Sponsored by partners" | "Sponsored by Razorpay and Postman, who provided…" |
| "World-class speakers" | "Speakers included Jet Semrick (Cursor) and Tanvi Sharma (Razorpay)" |

---

## 4. Templates

### 4.1 Event page (pre-event)

```mdx
---
slug: cafe-cursor-bengaluru-2026-07-12
title: Cafe Cursor Bengaluru
archetype: cafe
city: bengaluru
date: 2026-07-12T16:00:00+05:30
endDate: 2026-07-12T20:00:00+05:30
venue: Third Wave Coffee, Indiranagar
capacity: 60
status: upcoming
lumaUrl: https://lu.ma/...
hosts: [tanvi, karthik, rohan]
partners: [third-wave-coffee, cursor]
hero: /images/events/cafe-cursor-bengaluru-2026-07-12/hero.jpg
audiences: [working-devs, indie-hackers]
language: en
cost: 0
---

A relaxed 4-hour Saturday afternoon at Third Wave Coffee Indiranagar.
Bring your laptop, your current project, and meet 40+ Bengaluru builders
who use Cursor every day. Drinks on us; bring an open mind.

## Agenda

- 4:00 pm · Doors open · introductions over coffee
- 4:45 pm · Show & tell: 5 builders, 5 minutes each
- 5:30 pm · Open building / pairing
- 7:30 pm · Wrap-up & dinner plans

## Who should come

- You ship with Cursor every week, or want to.
- You like meeting other builders in person.
- You enjoy coffee and conversation.
```

### 4.2 Recap (post-event)

```mdx
---
# Same slug as event; we overwrite status and add recap fields.
status: past
attendees: 47
photoCount: 122
recapAuthor: tanvi
publishedAt: 2026-07-14
---

## What happened

47 developers showed up — about a third students, a third working
engineers, a third indie hackers and founders. Five demos in the show-and-tell:

1. Pranav demoed a research-paper search tool he built in three evenings.
2. ...

## Highlights

- Karthik shared a Cursor agent harness for his employer's monorepo.
- Tanvi walked the room through her PR-review agent.
- Three attendees signed up to volunteer for the next Cafe.

## Photos

[PhotoGallery from /images/events/cafe-cursor-bengaluru-2026-07-12/]

## Thanks

Thanks to Third Wave Coffee for hosting and to Cursor for the credits.
```

### 4.3 Monthly roundup

```mdx
---
slug: 2026-06
title: June 2026 roundup
publishedAt: 2026-06-30
author: tanvi
month: 2026-06
stats:
  events: 14
  attendees: 380
  newAmbassadors: 6
  newProjects: 8
cover: /images/roundups/2026-06/cover.jpg
---

# June 2026

Editor's letter from Tanvi.

## What happened

A summary across all chapters this month.

## New ambassadors

[ambassador cards]

## Featured projects

[project cards]

## Cursor product highlights

A short recap of what Cursor shipped (Composer 2.5 etc.) with our community's reactions.

## Photos

[gallery]

## Next month

What to look forward to in July.
```

### 4.4 Ambassador interview

```mdx
---
slug: interview-tanvi-sharma
title: How Tanvi runs the Bengaluru chapter
publishedAt: 2026-07-20
author: india-editorial
subject: tanvi
tags: [interview, community]
---

(Q&A format with 6–10 questions.)
```

### 4.5 Tutorial / craft post

```mdx
---
slug: cursor-pr-review-workflow
title: A Cursor workflow for reviewing PRs in big monorepos
publishedAt: 2026-08-05
author: karthik
tags: [tutorial, workflows]
---

(Narrative + screenshots + code blocks. ~1500 words.)
```

### 4.6 Project showcase entry

```mdx
---
slug: ceynk
title: Ceynk
oneLiner: Build your creator home on the web.
description: A modern platform for creators to showcase and grow their audience.
category: marketing
status: live
city: bengaluru
builders: [name-of-builder]
github: https://github.com/...
live: https://ceynk.link
addedAt: 2026-07-12
---

## The story

(Optional longer description.)
```

---

## 5. Vernacular Content Strategy

### 5.1 Why vernacular matters in India

- Indian developers in Tier-2 / Tier-3 cities increasingly prefer content in their first language.
- Hindi alone reaches ~500M speakers; Tamil, Bengali, Telugu, Marathi reach further regional clusters.
- Cursor.com is English-only; an Indian community site shipping vernacular tutorials is **net-new value**.

### 5.2 Vernacular roadmap (Year 1)

| Phase | Languages | Scope |
|---|---|---|
| Launch | English | All content |
| Q2 | **Hindi** added | Homepage, About, /events index, /resources/getting-started, /resources/vernacular (Hindi tutorials), monthly roundup excerpts |
| Q3 | **Tamil + Bengali + Telugu** added | Same scope (5 pages each) |
| Q4 | **Marathi** added | Same scope |

### 5.3 Vernacular contribution flow

1. A native-speaker volunteer translates a page or tutorial.
2. PR opens on GitHub.
3. India editorial lead + a second native speaker review.
4. Merged and deployed.
5. Volunteer credited in `/resources/vernacular`.

### 5.4 Vernacular content quality bar

- Must be native-quality (not Google-translated).
- Technical terms can stay in English (Cursor, Agent, Composer 2.5).
- Cultural references should be Indianized where natural.
- Examples in tutorials should use Indian context (Indian-named variables, Indian payment flows, etc.).

---

## 6. Editorial Governance

### 6.1 Editorial team (proposed)

- **India editorial lead** (one): reviews all blog posts, publishes the monthly roundup, maintains style guide.
- **Chapter writers** (one per chapter): writes the chapter's event recaps.
- **Tutorial volunteers** (open pool): writes craft pieces.
- **Vernacular reviewers** (per language): reviews vernacular contributions.

### 6.2 Editorial workflow

1. **Idea** → opened as an issue in `cursor-india/content` repo.
2. **Draft** → MDX PR opened against `main`.
3. **Review** → at least one editorial reviewer + one technical/community reviewer.
4. **Polish** → style guide pass.
5. **Publish** → merge triggers deploy.
6. **Distribute** → ambassador shares on X, LinkedIn; auto-posted to Discord/WhatsApp; included in next roundup.

### 6.3 Quality bar

Every piece must:
- Pass the style guide (UK English, kill-list compliance, sentence-case headings, etc.).
- Cite real people / events / numbers (no inventions).
- Include at least one image (event hero, ambassador photo, screenshot, or diagram).
- Have an `<h1>` matching the title.
- Be at least 200 words (no thin content).
- Pass spell-check.

---

## 7. Distribution Strategy

Every published piece is amplified through:

1. **Cursor India Twitter/X** — short summary + link.
2. **Cursor India LinkedIn** — slightly longer summary + link.
3. **Discord #blog / #events channels** — auto-posted via webhook.
4. **WhatsApp Cursor India broadcast** — once a week digest.
5. **Cursor.com forum** — events posted in `/c/events/4`; resources posted in `/c/guides/13`.
6. **Cursor community team** — submit upcoming events for inclusion in cursor.com/community feed.
7. **Newsletter** — bundled into next monthly roundup.
8. **Ambassador personal networks** — each ambassador shares the piece organically.
9. **Partner channels** — sponsors and venue partners cross-promote.
10. **YouTube** — talks uploaded; embed used in resources/talks.

---

## 8. Content KPIs (Year 1)

| KPI | Q1 target | Q4 target |
|---|---:|---:|
| Blog posts published | 6 | 60 |
| Event recaps published | 10 | 100 |
| Monthly roundups published | 3 | 12 |
| Talks recorded + uploaded | 5 | 50 |
| Vernacular pieces | 0 | 30 |
| Featured projects added | 6 | 100 |
| Newsletter subscribers | 500 | 20,000 |
| Newsletter open rate | 35%+ | 35%+ |
| Roundup share rate | 5%+ | 5%+ |
| Average reading time per blog | 4 min | 6 min |

---

## 9. Content Anti-Patterns to Avoid

1. Posting recaps months after the event (target: ≤ 7 days).
2. Recaps that are just photo dumps with no narrative.
3. Tutorials that paraphrase the Cursor docs (we add India context or skip).
4. Interviews that read as PR fluff for the subject's employer.
5. Roundups that omit smaller chapters (every chapter must appear, even if briefly).
6. Vernacular content that is machine-translated.
7. Content that names people without their consent.
8. Content that names sponsors more than mentions of community members.
9. Posting on holidays / festivals without local appropriateness check.
10. Auto-generated content (LLM with no human edit) shipping unreviewed.

---

## 10. Editorial Calendar Template (per month)

```
Week 1
- Mon: Publish previous month's roundup
- Wed: Tutorial post (workflow / craft)
- Sat: Cafe Cursor in [city]; event page live by Mon

Week 2
- Tue: Interview post (ambassador or builder)
- Thu: Event recap from Saturday
- Sat: Workshop OR Meetup in another city; event page live by Mon

Week 3
- Wed: Tutorial post
- Sat: Meetup OR Hackathon in another city

Week 4
- Tue: Interview post
- Wed: Recap from previous week's event
- Sat: City event
- Sun: Editorial draft of roundup
```

This is a sustainable cadence for a 6-ambassador team.

---

## 11. Cursor-Inc. Coordination

To stay aligned with Cursor's global voice:

- Subscribe to the **cursor.com blog RSS** and link every relevant product post in the next roundup.
- Cross-reference **Cursor changelog** in monthly roundup.
- Run any official-sounding statements (numbers about Cursor product adoption, claims about Cursor's stance) past `community@cursor.com` before publishing.
- Submit interesting India content to Cursor's community channels for potential global feature.
