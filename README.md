# Cursor India

The official Cursor India community website.

> Cursor India is a volunteer community of Cursor users in India. We organize Cafe Cursor, workshops, meetups, and hackathons across Indian cities. We are not Cursor Inc. — for the product, visit [cursor.com](https://cursor.com).

## Quick start

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## What this is

- **Next.js 16** App Router + **React 19**
- **Tailwind 4** (CSS-tokenised, dark default + light theme switcher)
- **TypeScript** everywhere — content is typed TS files, no CMS
- **Geist** font, **lucide-react** icons, **cmdk** for ⌘K search
- Static — deploys to Vercel free tier in seconds

## Editing content

Adding things is the same shape every time:

1. Copy an existing file (or the `_template.ts`) under the relevant folder.
2. Edit the fields.
3. Add the new import to that folder's `index.ts`.
4. Commit. (For images, drop them in the matching `public/images/` folder — see [`public/images/README.md`](public/images/README.md).)

### Adding events

Two options. **You don't have to pick one.** They merge cleanly.

#### Option A: just publish on Luma

Most events should go this way. Once a city has its `lumaCalendarId` set in `content/cities/<city>.ts`, every event the ambassador publishes on that calendar shows up automatically on the site within about a minute (cached server-side via `LUMA_REVALIDATE_SECONDS` in `lib/revalidate.ts`).

Hosts are inferred from the city's ambassador list. Archetype (Cafe / Workshop / Hackathon / Meetup) is inferred from the event title. No code change needed per event.

Getting the calendar ID:

1. Open your Luma calendar dashboard.
2. Settings -> Sync calendar (or "Calendar API").
3. Copy the `cal-XXXXXXXX` part from the iCal URL.
4. Paste it into `content/cities/<city>.ts` as `lumaCalendarId`.
5. Done.

### Event recaps (ambassadors — no code)

After a past event, ambassadors manage everything at **`/admin/<city>`** — profile, Luma calendar, and event recaps. No Google Form, no redeploy.

**Setup:** [`docs/supabase-setup.md`](docs/supabase-setup.md) — run SQL migrations `001` and `002`.

#### Option B: a TS file (use for richer events)

Reach for this when you want to add agenda, sponsors, partners, recap photos, or override anything Luma got wrong. The TS file is matched to its Luma event by `lumaUrl` (or by `slug` if no URL match), and the TS fields are layered on top of the Luma data.

```ts
// content/events/cafe-cursor-mumbai-2026-08-09.ts
import type { CursorIndiaEvent } from "@/lib/types";

export const cafeCursorMumbaiAug: CursorIndiaEvent = {
  slug: "cafe-cursor-mumbai-2026-08-09",
  title: "Cafe Cursor Mumbai",
  archetype: "cafe",
  city: "mumbai",
  date: "2026-08-09T16:00:00+05:30",
  venue: "Blue Tokai, Bandra",
  hosts: [{ handle: "syed-fahad" }],
  partners: ["Blue Tokai", "Cursor"],
  agenda: [
    { time: "4:00 pm", item: "Doors open" },
    { time: "4:45 pm", item: "Show and tell" },
  ],
  description: "Saturday afternoon in Bandra. Bring your laptop.",
  lumaUrl: "https://lu.ma/xxxxxx",
  status: "upcoming",
};
```

Then in `content/events/index.ts`:

```ts
import { cafeCursorMumbaiAug } from "./cafe-cursor-mumbai-2026-08-09";

export const events = [/* ... */, cafeCursorMumbaiAug];
```

That's it — the event shows up in:

- The homepage "Next event" card (if it's the soonest)
- `/events` upcoming list
- `/events/<slug>` detail page
- `/cities/mumbai`
- The ambassador's profile (because `hosts` referenced them)
- ⌘K search

### Add a city

Same pattern under `content/cities/`. See `content/cities/hyderabad.ts` for the canonical example.

### Add an ambassador

Copy `content/ambassadors/_template.ts` → `<handle>.ts`. Drop the photo at `public/images/ambassadors/<handle>.jpg`. Add the import to the barrel.

### Add an event photo gallery

Two options. **Both work** — pick whichever you prefer:

- **Folder drop (easiest):** put images under `public/images/events/<slug>/`. They auto-appear in alphabetical order. `hero.jpg` is special — it's used as the card hero (not in the gallery).
- **Explicit list (more control):** set the `photos` field on the event. See `content/events/_template.ts`. This overrides folder discovery and gives you per-image alt text, captions, and ordering.

## Folder structure

```
app/                Next.js App Router pages
  ├─ page.tsx        Homepage
  ├─ events/         /events list + /events/[slug] detail
  ├─ cities/         /cities list + /cities/[slug] detail
  ├─ ambassadors/    /ambassadors list + /ambassadors/[handle] profile
  ├─ gallery/        /gallery aggregated photos
  ├─ about/          /about
  ├─ join/           /join
  ├─ submit/         /submit (V1 stub — email + PR, no form yet)
  ├─ code-of-conduct/
  ├─ sitemap.ts      Auto-generated sitemap
  ├─ robots.ts       robots.txt
  └─ opengraph-image.tsx  Dynamic OG image

components/
  ├─ ui/             Primitives (Button, Card, Badge, Container, …)
  ├─ layout/         Navbar, Footer, ThemeToggle
  ├─ home/           Homepage sections
  ├─ events/         EventCard, etc.
  ├─ cities/         CityCard
  ├─ ambassadors/    AmbassadorCard
  ├─ gallery/        PhotoGallery
  └─ search/         CmdK dialog

content/             ← edit this folder, that's it
  ├─ site.config.ts
  ├─ events/         per-event TS files + index barrel
  ├─ cities/         per-city TS files + index barrel
  └─ ambassadors/    per-ambassador TS files + index barrel

lib/                 Helpers (theme, types, photos, utils, search index)
public/images/       All site imagery
```

## Theme

- Dark by default, matches Cursor's brand
- Light mode available via the toggle in the navbar, persisted in `localStorage`
- Monochrome palette. White is the only "accent", used only for the primary CTA background and focus rings.
- Tokens live in `app/globals.css` under `@theme` + `[data-theme="light"]`

## Responsive

Mobile-first Tailwind. Breakpoints used:

- (no prefix) — mobile
- `md:` ≥ 768px — tablet
- `lg:` ≥ 1024px — laptop
- `xl:` ≥ 1280px — desktop
- `2xl:` ≥ 1536px — large desktop

Type and grid both scale with breakpoints. Test at 360px and at 1920px before merging.

## ⌘K search

Press `⌘K` (Mac) or `Ctrl K` (Windows/Linux). Searches events, cities, ambassadors, and pages. The index is built once at build time from the content barrels.

## Deployment

```bash
pnpm build
```

Deploys cleanly to Vercel. No env vars needed for V1.

## Contributing

1. Open a PR — see [`/submit`](/submit) or email the India Lead.
2. Run `pnpm typecheck` before pushing — TypeScript is the source of truth.
3. We review within 48 hours.

## License

MIT.
