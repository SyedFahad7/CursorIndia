# Images

Drop images into the matching subfolder. The site auto-resolves them.

## Structure

```
public/images/
├── hero/            01.jpg … 06.jpg — Bento grid on the homepage hero
├── carousel/        01.jpg … 06.jpg — Infinite strip below the APAC letter
├── events/
│   └── <slug>/      hero.jpg + any other photos for the event gallery
├── cities/
│   └── <slug>/      hero.jpg (used on the city detail page)
└── ambassadors/
    └── <handle>.jpg  Avatar for the ambassador profile
```

## Rules

- **Format:** `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif`
- **Hero photos (event/city):** name the file `hero.<ext>` — the renderer auto-picks the first one it finds.
- **Gallery photos (event):** any name. They render in alphabetical order. To control order, prefix with numbers (`01-...`, `02-...`).
- **Ambassador photos:** filename must equal `<handle>.<ext>` where `<handle>` matches the ambassador's TS file.
- **Aspect ratios:** square for ambassadors, 16:10 for event/city hero, anything for gallery (we crop to fit).
- **Size:** target under 500 KB per file. Use [squoosh.app](https://squoosh.app) if needed.

## Captions / order / credits (optional)

For more control on event galleries (caption text, credit, custom order), use the `photos` field in the event's TS file. See `content/events/_template.ts`.

If `photos` is set, it takes precedence — folder auto-discovery is skipped.
