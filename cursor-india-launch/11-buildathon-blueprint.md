# 11 — Online Buildathon Blueprint (Research + Options)

> Goal: run a **big, hype-y, India-wide online build competition** tied to the launch —
> **without** the team drowning in judging or per-city hackathon logistics. This doc has the
> real-world research, the judging problem solved, and **3 concrete format options** to pick from.

---

## v2 — Locked direction (supersedes conflicting bits below)

Canvas: `canvases/cursor-india-buildathon-option-a.canvas.tsx`

- **No public / community voting.** It's gameable (finalists brigade friends to upvote → loudest
  network wins, not best build). **Judge 100% internally** (Cursor team + ambassadors, fixed rubric).
- **~1-week build sprint**, not 2 weeks. Kickoff **best case Jul 11**, **worst case Jul 18**;
  submission ~1 week later (Jul 19 / Jul 26).
- **No separate online demo day.** Instead the internally-picked **Top ~8 finalists are brought to
  the Bangalore flagship (Aug 1)** to demo **live on stage**, and **winners are declared in the room.**
  (This is the Algorand "Change the Game" model — virtual hack → in-person Grandmaster Demo Day.)
- **Finalists must be announced by ~Jul 29** so they have ≥3 days to book train travel before Aug 1.
  Earlier kickoff (Jul 11–14) = safer booking window.
- **Travel support:** flat **₹5,000 per finalist** (trains), same per-person rate solo or team.
  Reimbursed against tickets. **Lower the cash prize pool** since covering travel is the big value-add.
- **Bring how many:** 5 / 8 / 10 → **recommend 8** (full stage session, still cheap on travel).
- **Everything is an "options menu."** I'm an ambassador keeping levers open for the Cursor team to pick.

### Prizes (all optional)
- **Primary / core:** just **1st, 2nd, 3rd** — awarded on stage at Bangalore. Only tier I'd call essential.
- **Optional category add-ons:** Best use of Background Agents · Best use of a specific feature · Best Student.
  - **No "first-time builder"** category (dropped on purpose). Best Student stays.
- **Prize giveaway happens only at Bangalore.** Other cities (Mumbai, Delhi, Hyderabad) exist mainly
  to **push people to start building** and enter the buildathon.
- **Cash pool is optional.** We do **not** need a big cash pool — a large **credits giveaway**
  (Cursor plan credits + partner credits) is equally good, arguably better for devs. Options: (a)
  modest cash Top 3 + big credits, (b) credits-only, (c) cash + credits + travel.

### Platform — three options (all viable)
1. **Devfolio** — India-native, managed judging, least setup.
2. **Devpost** — biggest global reach ("largest" optics), what Bolt used.
3. **Our own custom website** — take registrations ourselves, fully branded/bespoke, control the
   experience, and **wire in agents to pre-screen submissions + assist judging later**. Most effort,
   most flexibility. (Fahad can build this.)

### Worldwide Cursor hackathon links (for the deck)
- Hamburg — Luma: https://luma.com/hl7wv7k3 · Recap (68 photos): https://www.cursorgermany.com/recaps/cursor-hamburg-2026-01-31
- Singapore — Luma: https://luma.com/cursor-hack-sg · Business Insider: https://www.businessinsider.com/inside-24-hour-cursor-vibe-coding-hackathon-singapore-ai-tech-2025-10
- Vancouver — Devpost: https://cursor-hackathon-vancouver.devpost.com/
- Cursor Hackathon (Devpost): https://cursor-hackathon.devpost.com/

### Travel-covered-finalist precedents (research)
- **Algorand "Change the Game":** virtual hackathon → track winners **invited to an in-person
  Grandmaster Demo Day** (Decipher, Barcelona) to pitch on the main stage; grand prize decided there.
- **ETHGlobal:** travel credits (City Packs / ETHGlobal Plus) + gas reimbursements; finalists
  notified, then demo on stage.
- **ETHIndia (Devfolio):** runs a **travel reimbursement policy** for accepted hackers.
- **Cursor Vancouver:** grand prize = Cursor credit **+ Web Summit ticket per team member** (a
  travel/experience prize — exactly our model).
- **Cursor Singapore:** 147 projects → judges shortlisted **15 finalists from demo videos** → stage demos.
- **Cursor Hamburg:** 400+ builders, on-stage finalist demos + Fan Favorite. Photo galleries:
  cursorgermany.com recap, Hamburg Luma.

---

## TL;DR (my recommendation) — original v1 below

Run a **~2-week online "Cursor India Buildathon"** on **Devfolio or Devpost** (platform does
registration + submissions + judging for us). Keep it **low-stress** by:

1. **Async, ~2 weeks**, not a stressful 24–48h sprint → people build calmly ("buildathon" vibe).
2. **Two-stage judging:** community/public voting shortlists a Top 20–30 → a **small Cursor panel
   only judges the finalists** (they never wade through hundreds of entries).
3. **Category prizes + regional/city prizes** so many people "win" and every roadshow city has a local hero.
4. **Online Demo Day** to announce winners (ties the whole tour together).
5. **Partner-funded prize tracks** (Exa, ElevenLabs, fal.ai…) so it's cheap for Cursor and amplifies reach.

This is the **least-stress / highest-ceiling** path. Details + two alternatives below.

---

## The key reframe: Buildathon > Hackathon (for us)

| | Hackathon (classic) | **Buildathon (recommended)** |
|---|---|---|
| Duration | 24–48h sprint | **1–4 weeks, async** |
| Energy | Pressure cooker, all-nighters | Calm, "build thoughtfully" |
| Judging load | Everything judged at once | **Staged / community-filtered** |
| Who wins | 1–3 teams | **Many categories → many winners** |
| Org stress | Very high | **Low–medium** |
| Fits our timeline? | Risky (<3 wks) | **Yes** |

FOSS United literally rewrote their format for this reason: *"Past editions ran 36 hours. Teams
rushed… pushing all code in one final commit. FOSS Hack 2026 will be a month-long program…
giving you time to plan, learn, build thoughtfully."* That's the lesson.

---

## Real-world references (what actually works)

### 1. Bolt "World's Largest Hackathon" (2025) — the BIG online precedent
- **128,000+ participants, $1M+ prize pool, fully online, ~1 month.** (Matches Sanjeed's
  *"world's/India's largest Cursor buildathon"* framing.)
- Structure that keeps judging sane:
  - **Submission period** (May 30–Jun 30) separate from **judging period** (Jul 7–22) separate from
    **awards ceremony** (Jul 26). Clean phases.
  - **4 simple criteria:** potential impact, idea quality, technological implementation, design.
  - **Layered prizes:** Global Top 10 + **Regional winners (AMER/APAC/EMEA)** + **Challenge/partner
    tracks ($25k each: ElevenLabs, Netlify, Supabase, Tavus, Algorand…)** + fun **Bonus awards**
    ("One-Shot" best single-prompt build, "Silly Sh!t", "Uniquely Useful Tool").
  - Requirements: public demo URL + **video** + "Built on Bolt" badge.
- **Steal:** the phase separation, the regional prizes (→ our **city prizes**), and **partner-funded
  challenge tracks** (cheap for us, huge amplification).

### 2. Supabase Launch Week Hackathon — the low-stress gold standard
- **~10 days, weekend-anchored, fully online, free.** Runs every launch week.
- **Judging is deliberately light:** *"The Supabase team will judge the winners for each category."*
  Criteria are vibes-forward: *creativity, functions smoothly, visually pleasing, technically
  impressive, use of Supabase features, FUN 😃.*
- **5 categories** (Best Overall, Best use of AI, Most Fun/Best Easter Egg, Most Technically
  Impressive, Most Visually Pleasing) → winner + runner-up each → **~10 winners** feel great.
- Submission = **1-minute demo video** + open-source repo link. *"We do not assess the quality of
  the video itself."* Low bar = more entries.
- **Steal:** tie it to the launch ("build in a weekend"), swag-kit prizes, minimal judging, many categories.

### 3. FOSS United — FOSS Hack (hybrid, month-long) + SEGFAULT
- **Month-long hybrid**: online is the default; **10 "localhosts"** (college venues) run in-person
  Day 1 + final 2 days. **Weekly check-ins + mentorship** keep momentum.
- **Multi-round elimination** spreads judging over weeks (not one marathon). Results ~2 months later.
- **Steal:** the **localhost model** ≈ our **roadshow cities as in-person anchors** for one online program.
  Weekly check-in calls = cheap engagement. Evaluation criteria: novelty, completeness, relevance.

### 4. VibeCon India (Emergent) — the "high-signal / exclusive" model
- **20,000+ applicants → vetted ~300 builders.** Selection is the product: portfolio + **60–90s
  video pitch**. Final = 2-day in-person Battle Grid; **Top 10 pitch on stage → judges pick Top 3.**
- Huge prizes/outcomes (YC interview, $ pool, partner credits from OpenAI/Anthropic/AWS/Stripe).
- **Steal:** the **funnel** (many apply → few finalists judged) and the **video-pitch filter** — this is
  exactly how to make judging tractable. Don't copy the exclusivity unless we want a premium tier.

### 5. YC "Hack the Stackathon" — the anti-slide-deck ethos
- *"This is not a demo day hackathon… We care about what you tried to build, what broke, and what
  actually shipped."* Judged by engineers on **technical decisions/tradeoffs**, not pitch theatrics.
- **Steal:** great framing for a **Cursor** audience — reward real shipping, agentic workflows, honesty.

---

## The judging problem — and 6 ways to kill the stress

The whole worry is *"we can't judge hundreds of entries."* Solved:

1. **Platform does the mechanics.** Devfolio/Devpost handle submissions, rubric scoring, judge
   rooms, auto-normalized scores, CSV export. We don't build anything.
2. **Two-stage funnel.** Stage 1 = **community/public voting** (or a lightweight volunteer/ambassador
   screen) narrows to a **Top 20–30**. Stage 2 = **small Cursor panel judges only finalists.**
   → panel reviews ~20 videos, not 500 repos.
3. **Judge rooms / parallel panels.** Split submissions across ambassador + partner judges; scores
   consolidate to one leaderboard (HackHQ/Devfolio/Devpost all support this).
4. **Public/community voting for a "Community Choice" prize** (Devpost & Devfolio Quadratic Voting)
   → offloads a whole category to the crowd, adds virality.
5. **1-minute video is mandatory.** Judging videos is 10x faster than cloning repos. (Supabase/Bolt both do this.)
6. **AI-assisted first pass** (optional). Devfolio's "discerning machine" shows AI can audit
   submissions against a rubric and cite evidence, so humans only apply taste on top. Even simpler:
   we can use **Cursor/Background Agents to pre-screen** repos for a shortlist — very on-brand.

**Net:** a panel of 3–5 people spends **one afternoon** on ~20 finalist videos. That's it.

---

## THREE OPTIONS TO CHOOSE FROM

### 🟢 Option A — "Cursor India Buildathon" (RECOMMENDED: big + low stress)
- **Format:** ~2-week async online buildathon, tied to the launch. Build anything with Cursor.
- **Platform:** Devfolio (India-native, great judging + microsite) or Devpost (global reach, Bolt used it).
- **Submission:** public demo link + **1-min video** + repo. Low bar, high volume.
- **Judging:** community voting → Top 20 → small Cursor+ambassador panel → winners. Partner tracks
  judged by partners.
- **Prizes:** Best Overall, Best Agentic Workflow, Best use of Background Agents, Most Fun,
  Best Student build + **City prizes** (Best from Blr/Hyd/Delhi/Mumbai/Chennai) + **partner tracks**.
- **Roadshow tie-in:** every city event promotes it + has a live "build corner"; **Bangalore Demo
  Day / winners reveal** as the finale.
- **Stress:** LOW–MED. **Ceiling:** HIGH (can genuinely be "India's largest Cursor buildathon").
- **Why:** combines Bolt's scale + Supabase's low-effort judging + FOSS localhost anchoring.

### 🟡 Option B — "Ship With Cursor" weekend (LOWEST stress)
- **Format:** Supabase-style **single weekend (Fri→Sun)**, async, online only. No roadshow dependency.
- **Judging:** Cursor team picks category winners directly (no funnel needed at smaller scale).
- **Prizes:** 5 categories × winner+runner-up = ~10 swag-kit winners.
- **Stress:** LOWEST. **Ceiling:** MEDIUM (less "campaign," more "fun activation").
- **Why:** if bandwidth is truly tight, this is copy-paste-proven and near-zero risk.

### 🔵 Option C — "Cursor Builders League" (highest hype, most work)
- **Format:** VibeCon-style **funnel** — open online build phase → **Top ~50 finalists** invited to
  the **Bangalore flagship** to demo on stage → live Top 3.
- **Judging:** online voting/screen for Top 50; **live stage judging** at Blr finale.
- **Prizes:** premium (credits, spotlight, maybe a partner perk).
- **Stress:** MED–HIGH (travel/logistics for finalists, stage ops). **Ceiling:** HIGHEST prestige.
- **Why:** makes Bangalore an unmissable finale, but adds the most moving parts on a tight timeline.

> **My call:** **Option A**, with the *submission window sized to the roadshow* (open ~Jul 21 launch,
> close ~Aug 3, Demo Day right after Bangalore). If the team says "too much," fall back to **Option B**.

---

## How it stitches into the roadshow (Option A)

| Phase | Dates (aligned to Notion) | What |
|---|---|---|
| Teaser | pre–Jul 21 | Registration opens; ambassadors seed hype |
| Launch + kickoff | **Jul 21** | Buildathon goes live with the India announcement |
| Build window | Jul 21 → ~Aug 3 | Async building; city events (Mumbai/Delhi/Hyd) promote it + live build corners |
| Bangalore flagship | **Aug 1** | On-stage shoutouts, live demos, "submit before Aug 3!" |
| Judging | ~Aug 3–7 | Community vote → Top 20 → panel |
| **Demo Day (online)** | ~Aug 9 | Winners announced → ties all cities into one story |

- Offline events **feed** the buildathon (help desks, "start your Background Agent here").
- **City prizes** reward showing up locally without excluding remote builders (**open to everyone**).
- Solves the group-chat debate (Hadi/Yash): judge **collectively, once, online**; offline runs async.

---

## Prizes & partners (cheap for Cursor, big amplification)

- **Partner-funded challenge tracks** — mirror Bolt: each partner sponsors a track + prize +
  judges their own. Targets from our list: **Exa, ElevenLabs, fal.ai**, plus Supabase, Vercel, Neon,
  Clerk, Tavily, Mem0. → free prize budget + co-marketing + they judge their track (less load on us).
- **Cursor prizes:** Pro/plan credits, **India-themed hero swag** (the Compile-keycap equivalent),
  feature on Cursor socials, spotlight at Bangalore.
- **Category ideas:** Best Overall · Best Agentic Workflow · Best Background-Agent use · Best MCP use ·
  Best Student/First-time build · Most Fun · Best Notebook/ML build · **Community Choice (public vote)** ·
  City winners · partner tracks.

---

## Platform pick (do this first)

- **Devfolio** — India-native, best-in-class judging (rubric auto-normalization, judge rooms, sponsor
  judging, Quadratic Voting), free microsite. **Best default for an India campaign.**
- **Devpost** — biggest global reach, what Bolt used, strong public voting. Good if we want "world's largest" optics.
- **Reskilll / Unstop / HackerEarth** — India platforms that offer **end-to-end managed** ops (they
  run logistics for you) — worth a quote if we want to fully offload operations.

---

## Open decisions to lock (fast — <3 weeks)
- [ ] **Option A / B / C?** (recommend A)
- [ ] **Platform** (recommend Devfolio) + who owns the account.
- [ ] **Submission window + Demo Day date** (recommend Jul 21 → Aug 3, Demo Day ~Aug 9).
- [ ] **Judging panel** (who + how many) and **community-vote yes/no**.
- [ ] **Partner tracks** — confirm Exa / ElevenLabs / fal.ai etc. + their prizes.
- [ ] **Prize budget + India-themed hero swag** feasibility.
- [ ] **Theme/tracks** and eligibility (open to all + special city/student prizes).

## Risks & mitigations
- **Judging overwhelm** → funnel + video-only + partner-judged tracks + optional AI pre-screen.
- **Low-quality flood** → require public demo + video; "Report Project" (Devfolio) for plagiarism.
- **Clashes with Delhi's IIIT hackathon** → position the online buildathon as the **umbrella**;
  Delhi's in-person hack can **feed submissions** into it (its projects can enter).
- **Dead-air build sessions offline** → structured 30-min challenge + mentors + lightning demos (see 05).
- **Timeline** → pick platform + partners **this week**; everything else is templated.
