# Land in Coorg

A cinematic Next.js website with separate editorial pages, fog-covered navigation, a continuous 3D mountain relief, a five-world perspective carousel, varied scroll animation, and an interactive terrain study.

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Production: `pnpm build` followed by `pnpm start`.

## Verify

```bash
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

The browser suite reuses a running dev server or starts one. Set `PLAYWRIGHT_BASE_URL` to test a production server. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use an existing Chromium installation.

## Implementation

- Three.js/R3F/Drei: one procedural photographic relief with three depth zones, shader mist, camera depth, and terrain sculpture. Three.js stays on the 0.182 line because the current R3F release still uses Clock internally.
- GSAP: hero progression, image parallax, line drawing, masked text, scroll-linked ink fills, sideways wipes and quiet text settling. Page treatments differ by editorial context.
- Lenis: smooth wheel/anchor scrolling synchronized with GSAP; native touch and reduced-motion support.
- Framer Motion: carousel springs and drag, pointer-responsive depth cards, menu, dropdown and button feedback. A persistent Web Animations API fog cover hides route changes and clears when the new page is ready.
- React Icons: all UI icons; custom SVG remains only for decorative terrain, contour and bird artwork.
- DM Serif Display + Manrope, optimized and self-hosted through Next fonts.

Later user refinements supersede the initial single-page/modal brief: five category cards, a longer native sticky hero, rounded controls, animated birds, centred navigation and centre-card arrows only. Selecting a carousel card centres it and expands its image into a detail modal; closing returns the image into that card. Navigation links and editorial depth cards use the separate routes.

## Pages

| Route | Content |
| --- | --- |
| `/` | Mountain hero, five-world carousel and introductory editorial sections |
| `/opportunities` | Five conceptual ways to belong and search considerations |
| `/plantations` | Plantation-life editorial with scroll-linked ink reveals |
| `/estates` | Retreat/home perspectives, depth cards and text wipes |
| `/about-coorg` | Landscape story, image parallax and interactive terrain |
| `/enquiry` | Dedicated personal brief form, animated custom dropdown and terrain study |
| `/opportunities/[slug]` | Five individual world pages, generated from the category data |

World slugs are `plantation-estates`, `private-hill-retreats`, `curated-estate-plots`, `forest-mountain-land` and `countryside-homes`. Each route renders its own HTML heading and metadata. Navigation keeps ordinary links, modified clicks and browser history; reduced motion uses brief fades and static fallbacks.

## Content and enquiry

All nine source opportunity records remain server-only drafts. Three previews appear in development; production excludes them. Category/hero art and the terrain study are explicitly conceptual. The enquiry form validates and downloads a local text brief; it sends no personal data. Its custom dropdown supports pointer, keyboard navigation and type-ahead. Direct submission/WhatsApp requires a confirmed official destination.

See [implementation and QA notes](docs/IMPLEMENTATION.md), [supplied asset provenance](docs/asset-provenance.md), and [generated image prompts and mappings](docs/image-generation.md). Original source files remain under `doc/`.

---

# LAND IN COORG — FINAL BUILD PACK

The original cleaned source package is retained under `doc/`; the following notes describe that supplied package, not the later implementation decisions above.

## What was removed

- All MP4/video files and the complete `04_VIDEOS/` folder.
- The out-of-scope Hoodi/Bangalore property document.
- The previous mixed master DOCX and previous content-only agent brief, because both referenced removed/out-of-scope material.

## What is included

- `doc/DOC.md` — original product, UI, animation, content and implementation specification.
- `AGENTS.md` — coding-agent execution rules for the existing Next.js App Router starter.
- `doc/01_SOURCE_DOCUMENTS/COORG/SLN_Plantations_Madapur.pdf` — original SLN source.
- `doc/02_REFERENCE/BRAND/landincoorg_domain_reference.png` — supplied brand/domain reference.
- `doc/03_ASSETS/` — Coorg-related still-image asset bank only.
- `doc/ASSET_MANIFEST.csv` — image-only manifest with confidence/usage notes.

## Core rule

The website can be visually cinematic and highly creative, but **property facts must never be invented**. Any AI-generated or conceptual imagery must be visibly treated as conceptual/representational and must never be presented as proof of an actual property's current condition, amenities, legal status, or infrastructure.
