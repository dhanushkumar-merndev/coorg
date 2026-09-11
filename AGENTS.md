<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# AGENTS.md — LAND IN COORG IMPLEMENTATION CONTRACT

## Mission

Turn the existing **Next.js App Router + TypeScript starter** into the final **Land in Coorg** cinematic real-estate website defined in `DOC.md`.

The implementation must combine **Three.js / React Three Fiber**, **GSAP ScrollTrigger**, and **Framer Motion** in a disciplined way. The primary creative signature is a procedural layered Coorg mountain + mist hero, followed by a premium four-card 3D rotating carousel with animated card-to-detail transitions.

Do not add or depend on video. Do not include unrelated Bangalore/Hoodi property data.

Read `DOC.md`, `ASSET_MANIFEST.csv`, and this file before making code changes.

---

## 1. Repository assumptions

The user's current project is a normal Next.js starter with approximately:

```text
.next/
node_modules/
public/
src/
.gitignore
AGENTS.md
CLAUDE.md
eslint.config.mjs
next-env.d.ts
next.config.ts
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
postcss.config.mjs
README.md
tsconfig.json
```

Work inside the current project. Do not scaffold a second Next.js app inside it.

Use **pnpm** because the repository already contains `pnpm-lock.yaml` and `pnpm-workspace.yaml`.

---

## 2. Hard constraints

1. No MP4, background video, autoplay video, video canvas, or video preload.
2. No Hoodi/Bangalore content.
3. No invented property facts, prices, price basis, legal status, map pins or contact details.
4. No generic forest/waterfall image may be claimed as belonging to a specific property unless the source status allows it.
5. No AI/conceptual image may be represented as an actual property photograph.
6. No ABBELON render may be represented as a sanctioned/authoritative legal plan.
7. Do not publish SLN current/projected revenue or ROI claims because the source PDF is internally contradictory.
8. Keep unknown values explicitly typed as TBC/null internally.
9. Do not use the Basavanahalli lead-specific phone number as the site's global WhatsApp/contact number.
10. Preserve normal scrolling; never implement aggressive scroll hijacking.

---

## 3. Required libraries and responsibilities

Use these libraries unless they already exist in equivalent form:

```bash
pnpm add gsap framer-motion three @react-three/fiber @react-three/drei
pnpm add -D @types/three
```

Optional small utilities are acceptable when justified, but avoid dependency bloat.

### Three.js / React Three Fiber owns

- Hero mountain geometry
- Atmospheric fog
- Mist/cloud planes or lightweight shader/sprites
- Tiny environmental particle layer if used
- Camera depth/pointer parallax

### GSAP owns

- Hero entry master timeline if easier than CSS
- ScrollTrigger hero pin + camera/DOM coordination
- Section-to-section mist transition
- Scroll-linked editorial text/image reveals
- Carousel section activation choreography if needed

### Framer Motion owns

- Nav/menu transitions
- CTA/button micro-interactions
- Carousel card drag/spring behavior
- Shared-layout card-to-detail expansion
- Minor UI entrances that are not scroll-scrubbed

**Never have GSAP and Framer Motion compete for the same transform/style property on the same element at the same time.**

---

## 4. First implementation actions

1. Inspect the existing project files and package versions.
2. Remove starter/demo content that is unrelated to Land in Coorg.
3. Preserve useful existing configuration and lint/build setup.
4. Copy source images from the supplied pack into a clean public structure.
5. Install only missing dependencies.
6. Build the page in independent components, not one monolithic `page.tsx`.
7. Run lint and production build after each major milestone.

Do not delete `.git`, configuration, or user code without a direct reason.

---

## 5. Asset ingestion rules

Use `ASSET_MANIFEST.csv` as the confidence map.

Recommended destination:

```text
public/images/coorg/supplied/villa/
public/images/coorg/supplied/sln/
public/images/coorg/supplied/abbelon/
public/images/coorg/supplied/generic/
public/images/coorg/supplied/reference/
public/images/coorg/conceptual/
```

Rename files only if useful for web cleanliness; keep an internal mapping if renamed.

Generate optimized WebP/AVIF versions for large image use if tooling is available, but retain source quality. Do not upscale low-resolution legal/reference assets and then treat the result as authoritative.

Never move videos into the project.

---

## 6. Component architecture

Minimum expected components:

```text
SiteHeader
MobileMenu
CoorgHero
HeroCanvas
MountainScene
MistLayer / MistTransition
RevealText
MagneticButton
CoorgWorldsCarousel
WorldCard
WorldDetail
WhyCoorg
FeaturedOpportunities
OpportunityCard
LandStory
EnquiryCTA
Footer
```

Prefer server components for static content wrappers and client components only where interaction/animation requires them.

Keep Three.js isolated behind a client boundary/dynamic import so the rest of the page can render quickly.

---

## 7. Hero scene specification

### DOM layer

The main heading, subtitle and CTAs must stay in normal HTML for SEO/accessibility.

Primary hero copy:

```text
LAND • ESTATES • PLANTATIONS • COORG

LAND IN
COORG

Where the mist settles, your land begins.

Explore Opportunities
Enquire Privately
```

### WebGL scene

Create 3–4 mountain ridges with deterministic procedural displacement. Use a fixed random seed so the hero shape is stable across renders.

Desired hierarchy:

- very far low-contrast ridge
- far ridge
- middle ridge
- foreground forest ridge
- atmospheric mist between at least two depth planes

Use fog to naturally hide geometry edges.

Avoid shiny materials. Surfaces should be matte and diffuse.

### Cloud/mist

No video textures.

Use one of:

- a tiny custom shader for moving low-frequency alpha noise,
- a small number of soft billboard planes using generated radial/noise alpha textures,
- procedural canvas textures generated at runtime once.

Clouds must be subtle, slow and layered. They should partially cross the typography during the opening and scroll transition.

### Pointer parallax

Clamp pointer motion. Camera shift should be measured in small fractions of the scene scale. Smooth with damp/spring logic. Disable on coarse pointers/mobile.

### Scroll transition

Create a GSAP ScrollTrigger timeline that:

- pins hero for a short controlled range on desktop,
- gently pushes camera forward,
- separates headline depth/opacity,
- lowers foreground ridge,
- increases mist coverage,
- releases into the carousel section.

Do not make the user scroll several screens before leaving the hero.

---

## 8. Four-card 3D carousel specification

Create exactly four category cards initially:

```ts
[
  { id: 'plantation-estates', title: 'Plantation Estates', line: 'Working land. Living landscape.' },
  { id: 'private-hill-retreats', title: 'Private Hill Retreats', line: 'Privacy shaped by the hills.' },
  { id: 'curated-estate-plots', title: 'Curated Estate Plots', line: 'Space to build with intention.' },
  { id: 'forest-mountain-land', title: 'Forest & Mountain Land', line: 'Closer to the landscape.' },
]
```

Use conceptual images for these category cards; keep them visually distinct from actual listing galleries.

### Geometry/positioning

A CSS 3D/perspective carousel is acceptable and preferred for DOM accessibility. Three.js does not need to own these cards.

For card index distance `d` from active card, derive:

- x translation
- `rotateY`
- z translation
- scale
- opacity / blur

Center card faces forward. Neighbor cards should visibly wrap on a shallow arc.

### Input

- drag/swipe with Framer Motion
- wheel/trackpad when the carousel section has focus/active intent, without blocking normal page scrolling permanently
- keyboard previous/next buttons
- touch-friendly controls

### Selection

Use Framer Motion shared `layoutId` or an equivalent FLIP-style transition.

Sequence:

1. active card faces camera
2. card advances/expands
3. inactive cards recede
4. mist wipe/fade crosses viewport
5. detail copy appears
6. close reverses all states

The selected image should feel like it becomes the detail hero, not like it disappears and is replaced by a modal.

---

## 9. Data model

Create a typed data model that distinguishes factual status.

Example shape:

```ts
type VerificationStatus = 'confirmed-source' | 'partial' | 'tbc';

type Opportunity = {
  id: string;
  name: string;
  areaLabel?: string | null;
  priceLabel?: string | null;
  priceBasisConfirmed: boolean;
  locationLabel?: string | null;
  coordinates?: { lat: number; lng: number } | null;
  typeLabel?: string | null;
  verificationStatus: VerificationStatus;
  publicReady: boolean;
  media: Array<{
    src: string;
    association: 'confirmed' | 'probable' | 'generic';
    conceptual?: boolean;
  }>;
  cautions: string[];
};
```

All current opportunities should default to `publicReady: false` until the user/client confirms the missing publication requirements.

Do not encode assumptions into the data.

---

## 10. Property/source rules the agent must preserve

### Villa cluster

Known: 26 cents, ₹4.5 crore wording, bed notes, pool/villa image cluster, coordinates around 12.445 / 75.877. Association of all facts to exact media remains unconfirmed.

### “50 caree”

Do not normalize wording to 50 acres.

### 12-acre villa

Area/type wording only; do not fabricate price/specification.

### 6-acre Kisan JV

Do not interpret `6,000 sq ft` or `₹2,000/sq ft` without clarification.

### 23.50-acre lead

Do not assume ₹60 lakh is per acre or attach the supplied Instagram reel without confirmation.

### 23-acre lead

Coordinates `12.5529731, 75.7950978`; ₹45 lakh basis is unresolved.

### 20-acre Basavanahalli lead

Address `CWWG+94Q, Basavanahalli, Karnataka 571234, India`; approximate coordinate around `12.445624652349654, 75.92473067343235`. Contact details in source are lead-specific, not global.

### SLN Plantations

Use the original PDF as the factual source. Area/crops/infrastructure can be represented cautiously. Do not publish conflicting revenue statements.

### ABBELON Estates

Use branded render assets as marketing/illustrative material. Do not transcribe uncertain legal dimensions/approval numbers from the low-resolution photographed plan.

---

## 11. CSS and visual implementation

Use CSS custom properties for palette, spacing and easing.

Define a small animation system, e.g.:

```css
--ease-out-expo: cubic-bezier(.16, 1, .3, 1);
--ease-soft: cubic-bezier(.22, .61, .36, 1);
--radius-card: 28px;
```

Hero typography should use responsive `clamp()` sizing.

Use masks/clip paths selectively. Avoid stacking expensive blur filters on many large elements simultaneously.

Avoid the common “glassmorphism everywhere” look. Frosted glass is acceptable for the scrolled nav or small controls, not the entire website.

---

## 12. Motion principles

- Slow environment, faster UI.
- Mountains move in seconds, buttons respond in milliseconds.
- Scroll motion should reveal depth, not decorate every element.
- Use opacity + transform before filter whenever possible.
- Blur is a transitional spice, not a permanent effect.
- Preserve visual rest between major motion moments.
- Use natural spring return for drag interactions.
- Never make text difficult to read for the sake of animation.

---

## 13. Reduced motion

If `prefers-reduced-motion: reduce`:

- no pinned hero
- no pointer camera motion
- no continuous particles
- static/faint mist only
- carousel uses simple horizontal slide/snap
- card detail opens with short opacity/scale transition
- all information remains fully accessible

---

## 14. Performance budget

Avoid a hero that requires a gaming GPU.

- Keep hero draw calls low.
- Clamp WebGL DPR.
- Reuse geometry/materials where possible.
- Avoid high-resolution texture stacks.
- Prefer procedural color/material over multiple 4K textures.
- Lazy-load sections below the fold.
- Use Next Image for DOM images.
- Preload only the actual LCP asset/font essentials.
- No autoplay background media.
- Clean every ScrollTrigger/listener on unmount.
- Do not render WebGL when the tab/scene is not needed if an easy pause strategy exists.

---

## 15. SEO / semantic requirements

- One semantic `<h1>` on the page.
- Use real DOM text for all important marketing copy.
- Add descriptive alt text to supplied imagery based only on visible/known facts.
- Do not put unverified property claims in metadata or JSON-LD.
- Set title/description around Land in Coorg generally until exact listing copy is approved.
- Keep structure ready for future opportunity detail routes.

---

## 16. Build order

### Milestone 1 — Foundation

- clean starter content
- global tokens/fonts
- header/footer
- image ingestion
- typed content data

### Milestone 2 — Hero

- static DOM composition first
- WebGL mountain scene
- mist
- pointer parallax
- opening sequence
- reduced-motion fallback

### Milestone 3 — Hero scroll transition

- GSAP ScrollTrigger
- hero pin on desktop
- mist handoff to next section
- mobile simplification

### Milestone 4 — 3D carousel

- 4 cards
- drag/snap
- keyboard controls
- perspective states
- selection transition
- detail panel

### Milestone 5 — Supporting sections

- Why Coorg
- Featured Opportunities preview
- Land Story
- Enquiry CTA

### Milestone 6 — Polish

- responsive pass
- motion tuning
- accessibility
- performance
- metadata
- lint/build

Do not begin by overengineering the full site. Get each milestone visually correct and stable before adding the next.

---

## 17. Testing checklist

Run at minimum:

```bash
pnpm lint
pnpm build
```

Also manually check:

- desktop Chrome/Chromium
- Firefox if available
- mobile viewport around 390px width
- reduced-motion simulation
- keyboard navigation
- no hydration errors
- no horizontal overflow
- no console warnings from Three.js/React
- no stuck ScrollTrigger after route refresh/resizing
- carousel still usable without drag
- hero text visible before/while WebGL loads
- no missing image paths
- no video network requests

---

## 18. Acceptance criteria

The agent is finished only when all are true:

- The existing Next.js starter is transformed, not replaced with a nested new app.
- Homepage hero contains original procedural/layered Coorg mountain + mist art direction.
- Hero has premium depth-based text choreography.
- Scroll transition is cinematic but brief and native-scroll friendly.
- A four-card 3D curved carousel follows the hero.
- Carousel supports drag/swipe, buttons and keyboard.
- Clicking a card produces a connected card-to-detail animation.
- GSAP, Framer Motion and Three.js have distinct responsibilities.
- The page works on mobile and reduced-motion settings.
- No MP4/video is used.
- No Hoodi/Bangalore data is included.
- No unverified price basis or property claim is invented.
- Supplied image associations are respected.
- Build and lint pass.
- Code is componentized, typed and maintainable.

---

## 19. Creative freedom

Within these constraints, use strong creative judgment. Improve composition, spacing, light, fog timing, depth, card motion and section transitions when doing so raises the quality bar.

The target is **cinematic, world-class, restrained and believable** — not a demo reel full of effects. Every major animation should strengthen the feeling of moving through Coorg's mist, terrain and land.
