# Land in Coorg Implementation Plan

**Goal:** Transform the current starter into the cinematic Land in Coorg experience.
**Architecture:** Server-rendered editorial routes, shared navigation/layout, isolated client interaction components and dynamically loaded R3F scenes. GSAP owns hero/scroll; Framer Motion owns cards and UI; a persistent fog provider coordinates route changes through the Web Animations API.
**Tech stack:** Next.js 16.3.4, React 19, TypeScript, pnpm, Three.js/R3F/Drei, GSAP, Framer Motion, Lenis and React Icons.
**Spec:** `doc/DOC.md`, `AGENTS.md`, and `doc/ASSET_MANIFEST.csv`.

The supplied specification and explicit instruction to implement are the approved design. Work in this repository; preserve existing user edits and source material. Use independent implementation tasks and evidence-based review. No additional approval gates, new worktree, or automated commits are needed for this requested local build.

- [x] Foundation: inspect all source assets; ingest only used stills with provenance; typed draft-only opportunities; global serif/sans typography and forest/paper tokens; navigation/footer.
- [x] Hero: three complementary ridge/treeline photo regions and photographic conceptual atmosphere; HTML headline with independent depth motion and faint mist; no-WebGL and reduced-motion fallbacks.
- [x] Scroll: native sticky desktop hero with 70% viewport extension, direct GSAP camera/text parallax and mist handoff; normal mobile scrolling; cleanup and visibility pausing.
- [x] Carousel: five conceptual worlds on perspective arc; drag, keyboard/buttons, intentional horizontal wheel; reduced-motion flat version. The connected image/detail modal is retained per the latest user instruction, alongside the separate navigation pages.
- [x] Narrative: Why Coorg, development-only opportunity previews respecting factual status, land story, honest downloadable enquiry brief until an official destination is supplied.
- [x] Initial homepage verification: lint/build, TypeScript, Chromium and Firefox; widths 375/390/768/1440; reduced motion, keyboard, touch, images, no videos, no overflow, console, resize and refresh. This records the earlier homepage milestone, not final verification of the subsequent route changes.

## Multi-page extension requested by the user

- [x] Shared layout: persistent header/footer/main landmark, Lenis and fog navigation provider.
- [x] Editorial routes: `/opportunities`, `/plantations`, `/estates`, `/about-coorg` and `/enquiry`, each with its own heading, metadata and composition.
- [x] Individual worlds: `/opportunities/[slug]` generates all five category pages; unknown slugs return not found. Editorial cards link to world pages; carousel cards keep the measured image-expansion modal with side-card centring and drag-click suppression.
- [x] Fog navigation: cover the current page before committing a route; synchronize scroll and reveal the new page; focus its heading; preserve native anchor/modified-click/history behaviour and clear interrupted transitions.
- [x] Motion variety: masked words, scroll-linked ink fills, directional wipes, landscape text settling, quiet entrances, image parallax, drawn rules and separate pointer tilt on depth cards. Keep reduced-motion text fully readable.
- [x] Enquiry: separate page with immediately visible brief form and terrain study; animated custom combobox, keyboard/type-ahead support and rounded focus styling. Keep the honest local-download behaviour until a contact destination is confirmed.
- [x] Icon consistency: React Icons for UI symbols; retain decorative bird/terrain/contour artwork.
- [x] Multi-page production build.
- [x] Final integration verification: lint/build, 18 passing production Playwright tests, desktop/390px screenshots, navigation/history/focus, modal reversal, custom dropdown/download, reduced motion, delayed hydration/no-JavaScript hero entrance, no overflow, no page errors and no videos. Firefox modal/navigation smoke check passed.

## File ownership
- Main: `src/app/`, `src/components/hero/`, `src/components/navigation/`, `src/components/ui/`, shared hooks and global CSS.
- Page components: `src/components/pages/` provides route heroes, text/image choreography, depth cards and next-chapter links.
- Carousel worker: `src/components/worlds/`, `src/data/worlds.ts`.
- Editorial worker: `src/components/sections/`, `src/data/opportunities.ts`, supplied image ingestion/provenance.
- Image worker: conceptual production assets and generation provenance only.

## Publication decisions
All supplied opportunity records remain `publicReady: false`. Development preview may show source-labelled cards; production excludes drafts. Conceptual images explicitly labelled. Unknown contact remains null. No unverified prices, price basis, pins, permissions, returns or listing image associations are published.

## Final user-directed refinements

Five worlds replace four; Countryside Homes is conceptual. Lenis added with native touch/reduced motion. GSAP pin replaced by a native sticky hero with 70% viewport extension: continuous direct scrubbing eliminates the blank pause and is reversible. The landscape uses three complementary photo masks traced along the ridge and tree contours. Near, middle and far regions translate at different scroll speeds with a fixed camera distance; no region repeats. The HTML fallback is hidden once WebGL is ready, and shader mist fades in independently. DM Serif Display replaces Cormorant. Birds, varied editorial text reveals, image parallax, terrain sculpture and global 8px button corners were added. Navigation is independently centred at 14px. Arrows are centre-card-only.

The original four-card/modal specification is historical. The latest user direction keeps the five-card image-expansion modal and adds separate navigation/world pages with a shared fog transition. The selected source card stays hidden until the close animation finishes, preventing a background clone. Navigation and enquiry each have dedicated pages; the enquiry dropdown is custom animated, UI icons use React Icons, and text treatments vary by page. Source contracts in `AGENTS.md` and `doc/` remain preserved; this plan records the authorized later changes.
