# Cursor Community Site Audits (20 sites)

> Phase 3 deliverable. All 20 sites visited and analyzed 2026-05-30.
> Each site is scored against the **Brand-Alignment Score Card** from `/research/brand/01-cursor-brand-analysis.md §15` (out of 100).
> Verdicts use a 4-grade scale: **A** (world class) · **B** (strong) · **C** (functional) · **D** (needs rebuild).

---

## Methodology

Each site was analyzed for:
- **Structure** — what pages/sections exist
- **Strengths** — what they do well
- **Weaknesses** — what we should avoid
- **Visual quality** — typography, palette, motion
- **UX quality** — navigation, friction, mobile parity (inferred from layout)
- **Content quality** — copy voice, photo authenticity, recap depth
- **Brand alignment** — adherence to Cursor's calm, technical, restrained tone

Scoring weights match the rubric in §15 of the brand doc.

---

## 1. cursorthailand.com

**Verdict: B+** · Score: **78/100** · *The reference implementation*

**Structure:** Featured (Cursor from Zero) → Subscribe → Upcoming Events → Past Event Recaps (rich, attendee counts + venue) → Ambassadors (3).

**Strengths**
- Cleanest brand-aligned baseline. Sets the visual benchmark.
- Excellent recap card density (date, venue, attendees, "view recap" link).
- Subscribe-to-Luma CTA is well placed.
- "Cursor from Zero" recurring program is a strong content asset other communities envy.
- Real photos, real venues (Decaf, Sarnies, ZeniCHub, Bubble Humble) — coffee culture authentic.

**Weaknesses**
- Single city (Bangkok + occasional Salaya). No country-wide scaling story.
- No project showcase.
- No blog.
- No event archetype filtering.
- Featured slot is single-purpose only.

**India Takeaways**
- **Adopt:** the recap card pattern (date · venue · attendees · recap link), the "named flagship workshop series" idea, the subscribe-to-calendar pattern.
- **Avoid:** single-city limitation.

---

## 2. cursornetherlands.com

**Verdict: B** · Score: **72/100**

**Structure:** Upcoming flagship (Hague Hackathon) → Subscribe → Past Event Recaps → Ambassadors (4).

**Strengths**
- Hackathon pitch is concrete (12 hours, $2000+ prizes, partner perks). Specific > vague.
- Cleanly multi-city (Delft, Amsterdam, Nijmegen, The Hague).
- Ambassador team is named and photographed.

**Weaknesses**
- No event detail pages — clicks go straight to Luma.
- No partner section despite mentioning "partner perks".
- No project showcase.

**India Takeaways**
- **Adopt:** the concrete hackathon-pitch pattern (X hours, $Y prizes, list of partners).
- **Avoid:** mentioning partners in copy but not surfacing them in a section.

---

## 3. cursorserbia.com

**Verdict: B** · Score: **70/100**

**Structure:** Ambassador-led (Belgrade + Novi Sad) → Past Events (very rich history — 10+ events) → Hosting Partners.

**Strengths**
- City-lead pattern explicit: "Community Lead for Novi Sad", "Community Lead for Belgrade". This is the *chapter pattern* India needs.
- Strong event cadence (monthly+).
- Visible attendance numbers.

**Weaknesses**
- No upcoming events at time of crawl.
- No event archetype filtering.
- "Hosting Partners" header but list is empty in our crawl.

**India Takeaways**
- **Adopt:** "Community Lead for [City]" wording — perfect for the India chapter pattern.
- **Avoid:** placeholder sections with no content.

---

## 4. cursor-croatia.com

**Verdict: C+** · Score: **62/100**

**Structure:** Upcoming Events (2) → Discord CTA → Ambassadors (2).

**Strengths**
- Discord CTA prominent (good — Discord is the primary participation surface).
- Two ambassadors clearly named.

**Weaknesses**
- Very thin content; reads like a placeholder.
- No past events / recaps yet.
- Hyphen in domain (`cursor-croatia.com`) is awkward — *avoid this naming pattern*.

**India Takeaways**
- **Adopt:** prominent Discord CTA.
- **Avoid:** hyphen in domain (use `cursorindia.dev` clean form).

---

## 5. cursoraustria.com (Vienna)

**Verdict: C+** · Score: **64/100**

**Structure:** City tab (Vienna) → Upcoming + Past tabs → Ambassadors (2) → Past Events (2).

**Strengths**
- Has a city tab pattern even with only one city — extensible.
- Recap cards include venue names (Sportradar, Flinn.ai) — venue branding is partner-value.

**Weaknesses**
- Sparse content (2 events, 2 ambassadors).
- Loaded with 503 errors during initial fetch — *hosting resilience concern*.

**India Takeaways**
- **Adopt:** city-tab pattern as extensibility hook.
- **Avoid:** flaky hosting; use Vercel/Cloudflare CDN.

---

## 6. cursorsrilanka.com

**Verdict: A−** · Score: **86/100** · *Most ambitious South-Asian deployment*

**Structure:** Hero ("The official hub") → Recent events photos → Latest Roundup → Latest Blog → Featured Projects (3 with status badges) → Community-at-a-Glance stats (1020+ members, 3+ events, 2 roundups) → Join CTA (WhatsApp, Discord, Luma) → Ambassador + Volunteer Team → Global events.

**Strengths**
- **Roundups** (monthly community digest) — a genuinely novel content format other sites should copy.
- **Featured Projects** with `Live` / `Marketing` / `Education` tags — exactly what we recommend.
- **WhatsApp + Discord** dual entry — recognizes South Asian comms reality.
- **Member count stat** (1020+) — social proof.
- **Volunteer Team** sub-section — broadens the leadership ladder beyond just ambassadors.
- **Inside-look blog post** ("Experiencing the 1st Cafe Cursor as a Cursor Ambassador") — humanizes the ambassador role.

**Weaknesses**
- "0 0" reaction counts on roundups read as broken.
- Featured Projects need a clearer submission pipeline.
- No event detail pages.

**India Takeaways** *(this is the closest sibling to India)*
- **Adopt:** monthly Roundup format, Featured Projects, WhatsApp+Discord, Volunteer Team layer, stat strip with member count.
- **Avoid:** reaction widgets that show "0" — hide if no data.

---

## 7. cursorgermany.com

**Verdict: A** · Score: **88/100** · *Most innovative custom build*

**Structure:** About + Disambiguation FAQ → Ambassadors (10!) → Upcoming → **Interactive Germany Map with event markers** → Past Events (12+) → **Sticker Wall** (gamified user contribution) → Past Events list.

**Strengths**
- **Disambiguation FAQ at the top** — they had to clarify they're not Anysphere AND not CURSOR Software AG (cursor.de). This is **a model for India** which will face confusion with `cursor.in`, `cursor.com/in`, etc.
- **Interactive map** with past + upcoming arcs — beautiful and useful for a multi-city geography.
- **Sticker wall** — gamified social proof, anonymous, "one sticker per visitor". Memorable.
- 10 named ambassadors with city affiliations — visual proof of national scale.
- Hand-typed "Cursor Germany — meetups, hackathons & community" title is honest and clear.

**Weaknesses**
- The sticker wall, while delightful, could be misused — moderation strategy unclear.
- Map can feel busy with many markers.

**India Takeaways** *(highest-leverage learnings of all 20 sites)*
- **Adopt:** disambiguation FAQ (critical — Cursor India will get confused with the cursor-keyboard-input concept, with the Indian software CURSOR products, etc.), interactive India map, ambassador city affiliation, multiple ambassadors visible.
- **Adapt:** sticker wall → "Pin your city on the India map" — a one-time location pin contribution.

---

## 8. cursorslc.com (Salt Lake City)

**Verdict: C** · Score: **58/100**

**Structure:** Ambassadors → Past Events (2) → Discord CTA.

**Strengths**
- Venue-named events (Alpha Coffee Cafe, Sugar House Station) — local color.
- Clean, no fluff.

**Weaknesses**
- Bare-bones; only 2 events.
- No featured section, no upcoming, no hero.

**India Takeaways**
- **Adopt:** venue-naming discipline in recap cards.
- **Avoid:** launching with no hero / no narrative.

---

## 9. cursorcalgary.com

**Verdict: B+** · Score: **76/100**

**Structure:** Ambassadors (2) → Featured ("Build with Cursor") → Upcoming + Past Events with **photo counts** → Past Event Recaps.

**Strengths**
- **Photo counts per recap** (12 photos, 402 photos, 25 photos) — strong social proof, drives clicks to galleries.
- Specific hackathon location ("ZayZoon", "SAIT") — venue partnerships visible.
- Attendance numbers consistent across cards (29 to 186).

**Weaknesses**
- No project showcase, no blog.
- Featured section is generic.

**India Takeaways**
- **Adopt:** photo-count badges on recap cards — high-signal social proof.
- **Adopt:** consistent attendance reporting.

---

## 10. cursorelsalvador.com

**Verdict: B** · Score: **72/100**

**Structure:** Ambassadors (2 with rich bios — "Ai /abs Founder", "The AI Collective Co-Host") → Upcoming → Past Events with attendance (93–163) → **Cafe Cursor around the world** photo strip (Fukuoka, Kigali, Mexico City).

**Strengths**
- Rich ambassador bios with role context, not just name + photo.
- High-attendance events (163 at hackathon!).
- Global "around the world" strip → ties local to global movement.

**Weaknesses**
- Only 2 ambassadors and 4 events visible.

**India Takeaways**
- **Adopt:** rich ambassador role descriptors (mini-bios on cards).
- **Adopt:** "global solidarity" strip ("Cafe Cursor around the world") — ties India to the bigger movement.

---

## 11. www.cursorbh.com.br (Belo Horizonte)

**Verdict: B+** · Score: **74/100** · *Uses a custom (non-evergreen) template*

**Structure:** Hero → **Ambassador deep-bios** (full résumé-style) → Stats (400+ members, 5+ events, 100% engaged) → Upcoming → **Online Courses** (Cursor for PMs, Spec-Driven Dev) → Past Events → Supporters.

**Strengths**
- **Long-form ambassador bios** with metrics (5–10x ROI, 88% productivity gain, 22k users in own product). Treats ambassadors as the *product*.
- **Online Courses module** — courses are first-class. India should absolutely have this.
- Mix of online + in-person events.
- Stat strip is concrete.
- Sponsors named: TechManagerdeResultados, Pingback, FIAP — real partners.

**Weaknesses**
- Visual identity is more "tech community" than "Cursor-canon". Less brand alignment.
- Heavy use of emojis (📅 🕐 📍) — diverges from Cursor's restrained tone.
- "100% Engaged & Active" is a meaningless stat.

**India Takeaways**
- **Adopt:** courses module, full ambassador résumés, named supporters list.
- **Avoid:** emoji-heavy section headers, vanity stats ("100% engaged").

---

## 12. www.cursorpoa.com.br (Porto Alegre)

**Verdict: B** · Score: **70/100** · *Sibling of cursorbh.com.br — clearly same operator*

**Structure:** Nearly identical to BH. Same ambassador (Marlon Vidal) leads both → effectively a *multi-chapter* deployment under the same operator.

**Strengths**
- Demonstrates the multi-chapter operator pattern works (one organization, two regional sites).
- Marcelo Barella's bio explicitly mentions being an *official Cursor Discord moderator* — adds credibility.

**Weaknesses**
- 95% content overlap with BH — feels duplicated rather than localized.
- Same stats ("400+ members") across both sites — looks copy-pasted.

**India Takeaways**
- **Adopt:** the multi-chapter operator concept (one operator, multiple cities).
- **Avoid:** duplicate stats and copy across chapter pages — each chapter must have its own truth.

---

## 13. cursorvictoria.com

**Verdict: C** · Score: **56/100**

**Structure:** City hero ("VICTORIA, BC", "Parliament Buildings") → Upcoming (Workshop + Meetup) → Past events strip ("Cursor Stickers + Pins", "Cafe Cursor Dec 2025").

**Strengths**
- Strong city identity opening — Parliament Buildings ground the visual.
- "We host Cafe Cursor, hackathons, and many more, powered by the Tenfold community" — names the partner co-host.

**Weaknesses**
- Very sparse content; reads like an early prototype.
- No ambassador section visible.
- Stickers-and-pins past event card has no recap.

**India Takeaways**
- **Adopt:** city-anchoring imagery (a recognizable city landmark in the hero is powerful).
- **Avoid:** launching without an Ambassador / lead surface.

---

## 14. cursor-italy.com (Milano)

**Verdict: C−** · Score: **52/100** · *Most off-brand of all 20*

**Structure:** Heavy hero with badges ("Live Community / AI / Powered / Milano / Tech Hub") → What We Do (3 generic cards) → Growing Community stats → Why Join → Sponsors → CTA.

**Strengths**
- Sponsor solicitation flow is built out ("Become a Sponsor").
- CFP / Sessionize integration is forward-thinking.

**Weaknesses**
- Tone is **bro-y SaaS** — "AI-POWERED REVOLUTION", "VIBRANT NETWORK", flag emoji 🇮🇹 — exactly what Cursor's brand isn't.
- Stats are unbacked ("14+ Members", "1 City Covered", "Monthly Events", "100% AI-Powered" — the last is meaningless).
- Generic feature cards ("Live Coding Sessions / Community Networking / AI-Powered Workshops").
- No real events listed.
- No real recaps.

**India Takeaways**
- **Avoid this entire template/approach.** This is the cautionary tale.
- Specifically avoid: meaningless stats, flag emojis as branding, generic feature blocks, "Why Join" listicles instead of real evidence.

---

## 15. trento.cursor-italy.com

**Verdict: C** · Score: **58/100**

**Structure:** Ambassador (Davide Carlomagno) → Featured Projects (placeholder: "Submit your project via PR") → Upcoming (empty) → Past (1 event, 114 attendees) → Sponsors.

**Strengths**
- "Submit your project via PR" is a beautifully developer-native CTA. India should consider this.
- Subdomain pattern (`trento.cursor-italy.com`) proves the multi-city subdomain strategy works.

**Weaknesses**
- 90% empty sections.
- Single past event.

**India Takeaways**
- **Adopt:** "Submit via PR" CTA for project showcase — bold and on-brand for a developer audience.
- **Adopt:** subdomain pattern as a fallback option for chapters.
- **Avoid:** showing many empty sections — hide what's empty.

---

## 16. cursorkenya.com

**Verdict: B−** · Score: **66/100**

**Structure:** Hero with countdown to next event → About → Upcoming (1 event) → Featured Videos.

**Strengths**
- **Countdown timer** to next event — urgency that doesn't feel salesy.
- **Featured Videos** section — leans into talk recordings, which is great for SEO and onboarding.
- "Pulled from our Luma calendar — revalidated every minute" — quietly shows technical polish.

**Weaknesses**
- No ambassador section.
- No past events / recaps.

**India Takeaways**
- **Adopt:** countdown to next event (subtle, time-zone aware, IST-labeled).
- **Adopt:** featured videos section (India has lots of YouTube talk culture).
- **Avoid:** launching without ambassador surface.

---

## 17. cursorbelgium.com

**Verdict: B** · Score: **70/100**

**Structure:** Hero → Ambassadors (Kris from InQuote, Can from Habitat) → Past events (1: Cafe Cursor Ghent at "Bar Bougie in Wintercircus").

**Strengths**
- Ambassadors carry their **company affiliations** (Founder InQuote, Co-founder Habitat) — credentialing.
- Venue narrative ("Bar Bougie in Wintercircus") is evocative.
- *Note: one ambassador is from Habitat — the joinhabitat.eu inspiration site is linked through actual person.*

**Weaknesses**
- Single recap.
- No upcoming events visible.

**India Takeaways**
- **Adopt:** ambassador company affiliations as credentialing.
- **Adopt:** venue narrative writing ("at X in Y" with character).

---

## 18. cursorcolombia.com

**Verdict: A−** · Score: **82/100** · *Best photo archive UX*

**Structure:** "Photo archive · Moments from the community, kept simple and close" → Event Index (1 event) → Per-event photo set → Luma calendar **lazy-loaded** on click.

**Strengths**
- **Performance-conscious by design** — "the embed only loads when someone asks for it so the page remains fast". Rare and excellent.
- "The site keeps the mood quiet" — *that copy is itself perfectly on-brand for Cursor*.
- Per-event photo URLs (deep-linkable).
- 154 photos for one event (Cafe Cursor Medellin) — substantial archive.
- Lazy-loaded Luma embed is a model for India.

**Weaknesses**
- Only one event in the archive.
- No ambassador section visible from homepage.

**India Takeaways**
- **Adopt:** lazy-loaded calendar embed (performance + UX win).
- **Adopt:** "kept simple and close" tone — closest mirror of Cursor brand voice in the whole set.
- **Adopt:** per-event photo deep links.

---

## 19. cursorbulgaria.com

**Verdict: B** · Score: **71/100**

**Structure:** Ambassadors (2) → Upcoming subscribe CTA → Past events (2 with attendance) → Photo strip.

**Strengths**
- Photo strip ("Cursor Sofia in photos") gives life without a full gallery.
- Clean, calm pacing.

**Weaknesses**
- Empty upcoming events with a placeholder CTA can feel inactive.
- Thin overall.

**India Takeaways**
- **Adopt:** the calm pacing and the photo strip.
- **Avoid:** placeholder upcoming sections; either hide or fill.

---

## 20. www.cursorindonesia.com

**Verdict: B+** · Score: **75/100** · *Strong South-East Asia sibling*

**Structure:** Hero → Recent events photos → Upcoming (3 listed!) → Past Event Recaps → Join (Instagram, X, Luma) → Ambassadors (6!).

**Strengths**
- **6 named ambassadors** — visible scale.
- **3 confirmed upcoming events** with dates — feels alive.
- **Instagram + X join CTAs** (recognizes SE-Asia social platform reality, like India).
- Clean recap card with "+9 more" photo indicator.

**Weaknesses**
- No project showcase, no blog, no roundup.
- No event detail pages.

**India Takeaways**
- **Adopt:** 5+ ambassadors visible at launch (signals real scale).
- **Adopt:** Instagram + X as primary social entries (mirror for India).
- **Adopt:** "+N more" photo count on recap thumbnails.

---

## Summary Table (sortable view in comparison matrix)

| # | Site | Score | Verdict | Standout |
|---|---|---:|---|---|
| 1 | cursorgermany.com | 88 | A | Map + sticker wall + disambiguation FAQ |
| 2 | cursorsrilanka.com | 86 | A− | Roundups + Featured Projects + Volunteer Team |
| 3 | cursorcolombia.com | 82 | A− | Performance-conscious; perfect brand voice |
| 4 | cursorthailand.com | 78 | B+ | Reference implementation; recap card pattern |
| 5 | cursorcalgary.com | 76 | B+ | Photo counts on recaps |
| 6 | www.cursorindonesia.com | 75 | B+ | 6 ambassadors, 3 upcoming, IG+X |
| 7 | www.cursorbh.com.br | 74 | B+ | Online courses module, deep ambassador bios |
| 8 | cursornetherlands.com | 72 | B | Concrete hackathon pitch |
| 9 | cursorelsalvador.com | 72 | B | Rich ambassador bios; global strip |
| 10 | cursorbulgaria.com | 71 | B | Calm pacing, photo strip |
| 11 | cursorbelgium.com | 70 | B | Company affiliations credentialing |
| 12 | cursorserbia.com | 70 | B | "Community Lead for [city]" pattern |
| 13 | www.cursorpoa.com.br | 70 | B | Multi-chapter operator |
| 14 | cursorkenya.com | 66 | B− | Countdown + featured videos |
| 15 | cursoraustria.com | 64 | C+ | City-tab pattern |
| 16 | cursor-croatia.com | 62 | C+ | Discord CTA prominent |
| 17 | cursorslc.com | 58 | C | Venue-naming discipline |
| 18 | trento.cursor-italy.com | 58 | C | "Submit via PR" CTA |
| 19 | cursorvictoria.com | 56 | C | City landmark imagery |
| 20 | cursor-italy.com | 52 | C− | (cautionary tale — bro-y SaaS tone) |
