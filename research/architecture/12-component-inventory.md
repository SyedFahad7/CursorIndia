# Cursor India — Component Inventory

> Deliverable #9. Authoritative list of all components, with phase, dependencies, and acceptance criteria.
> Source of truth complements `/research/brand/08-design-system.md §6` (which has full behavior specs).
> Use this as the **Storybook backlog**.

---

## Legend

- **Phase:** P0 = launch blocker · P1 = launch nice-to-have · P2 = post-launch · P3 = future
- **Type:** primitive (atomic) · composite (composed) · page (route-level)
- **Tests:** Storybook story + unit test + visual regression (Chromatic optional)
- **A11y:** all components must declare WCAG 2.2 AA compliance

---

## 1. Foundation Primitives

| Component | Phase | Type | Depends on | Notes |
|---|---|---|---|---|
| `Box` | P0 | primitive | — | Polymorphic flex container |
| `Stack` | P0 | primitive | `Box` | Vertical or horizontal stack with `gap` |
| `Inline` | P0 | primitive | `Box` | Inline flex with wrap |
| `Container` | P0 | primitive | `Box` | 3 widths: narrow/default/wide |
| `Grid` | P0 | primitive | `Box` | 12-col responsive |
| `Spacer` | P0 | primitive | — | `<div>` with `aria-hidden` |
| `VisuallyHidden` | P0 | primitive | — | A11y helper |
| `Heading` | P0 | primitive | — | Polymorphic h1–h6 |
| `Text` | P0 | primitive | — | Polymorphic p/span with size variants |
| `Link` | P0 | primitive | `next/link` | With `→` arrow variant |
| `Icon` | P0 | primitive | `lucide-react` | Strict size + stroke props |
| `Image` | P0 | primitive | `next/image` | Required alt; CLS-safe defaults |

---

## 2. Form Primitives

| Component | Phase | Depends on |
|---|---|---|
| `Button` | P0 | — |
| `IconButton` | P0 | `Icon` |
| `Input` | P0 | — |
| `Textarea` | P1 | — |
| `Select` | P1 | `@radix-ui/react-select` |
| `Combobox` | P2 | `cmdk` |
| `Checkbox` | P1 | `@radix-ui/react-checkbox` |
| `RadioGroup` | P1 | `@radix-ui/react-radio-group` |
| `Switch` | P2 | `@radix-ui/react-switch` |
| `Field` | P0 | label + helper + error wrapper |
| `Form` | P0 | `react-hook-form` + `zod` |

---

## 3. Display Primitives

| Component | Phase | Depends on |
|---|---|---|
| `Badge` | P0 | — |
| `Avatar` | P0 | `Image` |
| `AvatarGroup` | P1 | `Avatar` |
| `Card` | P0 | `Box` |
| `Skeleton` | P1 | — |
| `Tooltip` | P1 | `@radix-ui/react-tooltip` |
| `Popover` | P1 | `@radix-ui/react-popover` |
| `DropdownMenu` | P1 | `@radix-ui/react-dropdown-menu` |
| `Dialog` | P1 | `@radix-ui/react-dialog` |
| `Sheet` | P1 | `@radix-ui/react-dialog` |
| `Tabs` | P1 | `@radix-ui/react-tabs` |
| `Accordion` | P1 | `@radix-ui/react-accordion` |
| `Toast` | P1 | `sonner` |
| `Separator` | P0 | — |
| `KbdShortcut` | P2 | — |
| `CodeBlock` | P2 | `shiki` |

---

## 4. Compound / Domain Components

### 4.1 Layout & navigation

| Component | Phase | Dependencies | Story coverage |
|---|---|---|---|
| `NavBar` | P0 | `Link`, `Button`, `Sheet` (mobile) | desktop, mobile, with current path highlight |
| `Footer` | P0 | `Link`, `Stack`, `Container` | desktop, mobile |
| `Breadcrumbs` | P1 | `Link` | 1-level, 3-level |
| `PageHeader` | P1 | `Heading`, `Text`, `Breadcrumbs` | with and without breadcrumbs, with actions |
| `SectionHeader` | P0 | `Text` (eyebrow), `Heading`, `Text` (subhead) | with and without subhead |

### 4.2 Hero & home

| Component | Phase | Dependencies |
|---|---|---|
| `Hero` | P0 | `BentoGrid`, `Heading`, `Text`, `Button` |
| `BentoGrid` | P0 | `Image` |
| `StatStrip` | P0 | `Text` |
| `NextEvent` | P0 | `EventCard` (expanded), `CountdownTimer` |
| `CountdownTimer` | P1 | — |
| `ChaptersHomeSection` | P0 | `ChapterMap`, `ChapterList` |
| `AudienceSelectPanel` | P0 | `AudienceCard` |
| `AudienceCard` | P0 | `Link`, `Icon` |
| `Manifesto` | P0 | `Container` (narrow), `Prose` |

### 4.3 Events

| Component | Phase | Dependencies |
|---|---|---|
| `EventCard` | P0 | `Card`, `Badge`, `Avatar`, `Link` |
| `EventCard.Compact` | P0 | `EventCard` variant |
| `EventCard.Expanded` | P1 | `EventCard` variant |
| `EventList` | P0 | `EventCard` |
| `EventFilters` | P1 | `Select`, `RadioGroup`, `Switch` |
| `EventCalendar` | P2 | — (likely a custom implementation or `react-day-picker`) |
| `EventMap` | P2 | lazy-loaded map lib |
| `EventDetailHero` | P1 | `Badge`, `Heading`, `DateChip` |
| `EventAgenda` | P1 | `Stack`, `Text` |
| `LumaEmbed` | P1 | lazy `iframe` |
| `EventHostList` | P1 | `AvatarGroup`, `Text` |
| `DateChip` | P1 | `Icon`, `Text` |

### 4.4 Chapters

| Component | Phase | Dependencies |
|---|---|---|
| `ChapterMap` | P1 | inline SVG + IntersectionObserver |
| `ChapterList` | P0 | `Link` |
| `ChapterCard` | P0 | `Card`, `Image`, `Text`, `Link` |
| `CityHero` | P1 | `Image`, `Heading`, `Text`, `Button` |
| `ChapterStats` | P1 | `StatStrip` variant |

### 4.5 Ambassadors

| Component | Phase | Dependencies |
|---|---|---|
| `AmbassadorCard.Compact` | P0 | `Avatar`, `Text`, `Link` |
| `AmbassadorCard.Expanded` | P1 | `AmbassadorCard` variant |
| `AmbassadorGrid` | P0 | `AmbassadorCard.Compact` |
| `AmbassadorProfile` | P1 | composition: header + bio + builds + events + recaps + projects |
| `VolunteerStrip` | P1 | `AvatarGroup`, `Text` |

### 4.6 Showcase

| Component | Phase | Dependencies |
|---|---|---|
| `ProjectCard` | P0 | `Card`, `Image`, `Badge`, `Link` |
| `ProjectGrid` | P0 | `ProjectCard` |
| `ProjectFilters` | P2 | `Select` |
| `ProjectDetailHero` | P2 | `Image`, `Heading`, `Badge` |

### 4.7 Blog & content

| Component | Phase | Dependencies |
|---|---|---|
| `BlogList` | P1 | `BlogCard` |
| `BlogCard` | P1 | `Card`, `Image`, `Badge`, `Link` |
| `BlogPost` | P1 | `Prose`, `MdxComponents` |
| `Prose` | P1 | base MDX rendering wrapper |
| `MdxComponents` | P1 | overrides: `Heading`, `Text`, `Image`, `CodeBlock`, `Callout`, `Quote` |
| `RoundupCard` | P1 | `Card`, `Image`, `Text`, `Link` |
| `RoundupHero` | P2 | `RoundupCard` variant |
| `Callout` | P1 | `Box`, `Icon`, `Text` |

### 4.8 Resources

| Component | Phase | Dependencies |
|---|---|---|
| `ResourceTile` | P0 | `Card`, `Icon`, `Heading`, `Text`, `Link` |
| `ResourceGrid` | P0 | `ResourceTile` |
| `VideoEmbed` | P1 | lazy YouTube placeholder + iframe-on-click |
| `TalksGrid` | P1 | `VideoEmbed` |

### 4.9 Partners

| Component | Phase | Dependencies |
|---|---|---|
| `PartnerLogoGrid` | P0 | `Image` |
| `PartnerTierCard` | P1 | `Card`, `Text`, `List` |
| `PartnerCategoryTabs` | P1 | `Tabs` |

### 4.10 Application forms

| Component | Phase | Dependencies |
|---|---|---|
| `NewsletterForm` | P0 | `Input`, `Button`, server action |
| `JoinPanel` | P0 | `Card` × N (Discord, WhatsApp, Telegram, Newsletter, Forum, Reddit) |
| `AmbassadorApplyForm` | P1 | `Form`, all form primitives |
| `CampusLeadApplyForm` | P1 | `Form` |
| `PartnerApplyForm` | P1 | `Form` |
| `ProjectSubmitForm` | P1 | `Form` |
| `EventProposalForm` | P2 | `Form` |

### 4.11 Search & navigation

| Component | Phase | Dependencies |
|---|---|---|
| `Search` (Cmd+K) | P1 | `cmdk` + Pagefind |
| `SearchResultGroup` | P1 | `Search` |
| `TableOfContents` | P2 | sticky right-rail |

### 4.12 Special

| Component | Phase | Dependencies |
|---|---|---|
| `DisambiguationNote` | P0 | `Text` |
| `PhotoGallery` | P2 | lazy-loaded image grid + `Dialog` lightbox |
| `CTABanner` | P2 | `Container`, `Heading`, `Button` (use sparingly) |
| `ThemeToggle` | P1 | `IconButton` + theme provider |
| `LocaleSwitcher` | P2 | `DropdownMenu` |

---

## 5. Page-Level Compositions (Route Components)

| Page | Phase | Composes |
|---|---|---|
| `/` (Home) | P0 | Hero, StatStrip, NextEvent, EventList, ChaptersHomeSection, ProjectGrid (featured), AmbassadorGrid (8), AudienceSelectPanel, RoundupCard (latest), TalksGrid (3), ResourceGrid, PartnerLogoGrid, Manifesto, NewsletterForm, DisambiguationNote, Footer |
| `/events` | P0 | PageHeader, EventFilters, EventList, calendar/map toggle |
| `/events/[slug]` | P0 | PageHeader, EventDetailHero, Description, EventAgenda, EventHostList, PartnerLogoGrid, LumaEmbed, MapEmbed, RelatedEvents |
| `/chapters` | P0 | PageHeader, ChapterMap, ChapterGrid, StartAChapterCTA |
| `/chapters/[city]` | P0 | CityHero, ChapterStats, NextEvent (chapter-scoped), EventList (chapter-scoped), AmbassadorGrid (chapter), VolunteerStrip, ProjectGrid (chapter), PartnerLogoGrid, JoinPanel (chapter-scoped) |
| `/ambassadors` | P0 | PageHeader, AmbassadorGrid, VolunteerStrip, ApplyCTA |
| `/ambassadors/[handle]` | P1 | AmbassadorProfile |
| `/ambassadors/apply` | P1 | AmbassadorApplyForm |
| `/campus` | P1 | PageHeader, CampusLeadList, ApplyCTA |
| `/campus/apply` | P1 | CampusLeadApplyForm |
| `/showcase` | P0 | PageHeader, ProjectFilters, ProjectGrid, SubmitCTA |
| `/showcase/[slug]` | P1 | ProjectDetailHero, Prose, RelatedProjects |
| `/showcase/submit` | P1 | ProjectSubmitForm |
| `/founders` | P1 | PageHeader, RoundtableList, PartnerLogoGrid |
| `/resources` | P0 | PageHeader, ResourceGrid |
| `/resources/[topic]` | P1 | PageHeader, Prose |
| `/resources/hackathon-kit` | P1 | PageHeader, Prose, Download CTA |
| `/blog` | P1 | PageHeader, TagFilters, BlogList |
| `/blog/[slug]` | P1 | PageHeader, BlogPost, RelatedPosts |
| `/blog/roundups` | P1 | PageHeader, RoundupList |
| `/partners` | P1 | PageHeader, PartnerCategoryTabs, PartnerLogoGrid, PartnerTierCard |
| `/partners/become-a-partner` | P1 | PartnerApplyForm |
| `/join` | P0 | PageHeader, JoinPanel, ApplyCTAs |
| `/about` | P0 | PageHeader, Manifesto, FoundersList, FAQ, DisambiguationNote |
| `/code-of-conduct` | P0 | Prose |
| `/privacy` | P0 | Prose |
| `/terms` | P0 | Prose |
| `/press` | P2 | PageHeader, AssetsList |
| `/contact` | P1 | PageHeader, ContactForm |

---

## 6. Storybook Coverage Targets

- **P0 components:** 100% Storybook coverage at launch.
- **P1 components:** 100% coverage by end of Week 6.
- **All form primitives:** error state + loading state + success state stories.
- **All cards:** compact + expanded + skeleton + hover stories.

---

## 7. Acceptance Criteria for "Component Done"

Every component is "done" when:

1. **Visual:** matches design system tokens, both light and dark themes.
2. **Responsive:** verified at xs, sm, md, lg, xl, 2xl.
3. **Accessibility:** Lighthouse a11y check passes; keyboard fully usable; focus ring visible; screen-reader smoke test in NVDA / VoiceOver.
4. **i18n-safe:** no hard-coded strings; uses `t()` from i18n provider.
5. **Storybook:** primary + edge-case stories.
6. **TypeScript:** zero `any`; props validated.
7. **Tests:** at least one unit/render test.
8. **Bundle:** no unintentional `'use client'` on server components.
9. **Performance:** no layout shift; lazy where appropriate.
10. **Documentation:** props table auto-generated; usage example in Storybook.

---

## 8. Build Sequence (4-week sprint plan to ship P0)

### Week 1 — Foundation
- All P0 primitives (`Box`, `Stack`, `Container`, `Grid`, `Heading`, `Text`, `Link`, `Icon`, `Image`).
- Form primitives (`Button`, `Input`, `Field`, `Form`).
- Display primitives (`Badge`, `Avatar`, `Card`, `Separator`).
- Theme provider + tokens.
- Storybook setup.

### Week 2 — Layout & home pieces
- `NavBar`, `Footer`, `PageHeader`, `SectionHeader`.
- `BentoGrid`, `Hero`, `StatStrip`, `NextEvent`, `CountdownTimer`.
- `EventCard.Compact`, `EventList`.
- `AmbassadorCard.Compact`, `AmbassadorGrid`.
- `Manifesto`, `DisambiguationNote`.

### Week 3 — Routes & dynamic data
- Home page composition.
- `/events`, `/events/[slug]` pages with MDX-backed events.
- `/chapters`, `/chapters/[city]`.
- `/ambassadors`, `/showcase`, `/resources`, `/join`, `/about`.
- `ChapterMap`, `ChapterList`.
- `ProjectCard`, `ProjectGrid`.

### Week 4 — Polish, a11y, perf, launch
- `NewsletterForm` wired to Buttondown.
- `LumaEmbed`, `VideoEmbed`, `MapEmbed` — all lazy.
- `Search` (Cmd+K) with Pagefind.
- Dynamic OG image route.
- Sitemap, RSS, iCal endpoints.
- Lighthouse + axe-core audit.
- Browser matrix testing.
- Soft launch to Cursor India ambassadors.
