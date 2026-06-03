# Screenshots

This folder is reserved for visual reference captures.

## Status

The Phase-3 audit of the 20 Cursor community sites was conducted via fetched HTML and rendered content (see `/research/competitors/03-community-site-audits.md` for sources). Screenshots were not captured live in that pass because the analyzed content was sufficient for the audit.

## When to populate this folder

Add screenshots when:
- A designer is doing a visual reference pass before opening Figma.
- A site we audited makes a significant visual change that we want to track.
- We want to document our own site visually for changelog purposes.

## Recommended structure

```
screenshots/
├── _competitors/                Reference captures of the 20 sites
│   ├── thailand/                One folder per site
│   │   ├── home-2026-05-30.png
│   │   ├── event-detail-2026-05-30.png
│   │   └── mobile-home-2026-05-30.png
│   ├── germany/
│   ├── srilanka/
│   └── ...
├── _inspiration/                Reference captures from non-Cursor sites
│   ├── buildclub/
│   ├── habitat/
│   └── ...
└── _ours/                       Captures of our own site as it evolves
    ├── 2026-07-19-launch/
    └── ...
```

## File naming

- `kebab-case-area-yyyy-mm-dd.png`
- Include device/viewport in the filename if mobile: `mobile-home-2026-05-30.png` vs `home-2026-05-30.png` (desktop default).
- PNG for screenshots; SVG/PDF for design exports.

## Capture tips

- Capture at 1440×900 for desktop default.
- Capture at 390×844 for mobile (iPhone 14 Pro reference).
- Capture full page where useful (browser DevTools → Capture full size screenshot).
- Mark date in the filename to track design evolution.
