# LAND IN COORG — FINAL WEBSITE DESIGN & BUILD DOCUMENT

## 1. Project goal

Build a premium, cinematic, high-performance website for **Land in Coorg** using the user's existing **Next.js App Router + TypeScript starter**. The site should feel like an immersive editorial experience about owning land in Coorg: mist, mountain depth, plantations, forest roads, luxury retreats, calm, exclusivity, and a strong sense of place.

The experience must look expensive and memorable without becoming a generic real-estate template. The motion language should feel closer to a premium automotive/fashion launch page than a property portal, while still being usable, responsive, accessible, and conversion-focused.

**No videos are required or allowed in this build pack.** Use still images, procedural WebGL, layered parallax, shaders, typography, camera movement, and carefully composed transitions.

---

## 2. Brand direction

### Core feeling

- Misty Coorg dawn
- Deep green plantation land
- Layered mountain silhouettes
- Quiet luxury
- Earth, rain, stone, timber and fog
- Nature first, sales language second
- Editorial storytelling with premium real-estate clarity

### Visual system

Suggested palette:

- Deep forest: `#0E211A`
- Charcoal green: `#152A22`
- Moss: `#66755F`
- Mist: `#EDF1EC`
- Warm paper: `#F4F0E7`
- Muted clay: `#A66F4C`
- Soft brass accent: `#BFA16A`

Do not make the site black-and-gold luxury cliché. Green, mist and natural neutral tones should dominate. Brass is a small accent only.

### Typography

Use a refined serif + clean sans pairing. Preferred direction:

- Display/editorial: **Cormorant Garamond**, **DM Serif Display**, or a similar elegant serif.
- UI/body: **Manrope**, **Inter**, or **DM Sans**.

Hero type should be oversized, highly composed and integrated with mountain depth rather than simply placed on top of a background.

---

## 3. Signature hero — “The Coorg Mist”

The hero is the site's defining experience. It must occupy roughly the first full viewport and create an immediate 3D sense of Coorg.

### Hero visual composition

Create a procedural/layered Coorg-inspired mountain environment using **Three.js through React Three Fiber**. Do not use a background video.

Recommended scene layers, back to front:

1. Soft dawn sky gradient and atmospheric haze.
2. Very distant mountain ridge with low contrast.
3. Mid-distance mountain ridge with stronger shape.
4. Foreground dark forest ridge/plantation silhouette.
5. Slow moving mist/cloud layers traveling laterally and slightly toward camera.
6. Optional extremely subtle floating moisture/dust particles.
7. Hero typography placed at different visual depth planes.

The terrain can be generated from deterministic procedural noise. Avoid overly polygonal “game terrain.” The desired result is soft, natural, atmospheric and photographic in feeling.

### Hero typography concept

Recommended copy hierarchy:

**Eyebrow**  
`LAND • ESTATES • PLANTATIONS • COORG`

**Main display**  
`LAND IN`  
`COORG`

**Supporting line**  
`Where the mist settles, your land begins.`

**CTA pair**  
Primary: `Explore Opportunities`  
Secondary: `Enquire Privately`

Alternative headline if a more emotional route is preferred:

`Own the quiet.`  
`Build the extraordinary.`

### Hero motion choreography

At initial load:

- Page begins almost still for ~250 ms.
- Far ridge fades in first.
- Mid ridge rises 12–20 px and resolves from blur.
- Foreground ridge follows with slightly stronger depth.
- “LAND IN” appears from behind the mid ridge with masked vertical reveal.
- “COORG” is larger and can partially pass behind the foreground ridge to create real depth.
- Thin mist crosses the text, briefly occluding 5–15% of letterforms.
- Supporting copy and CTA appear last with a soft stagger.

On pointer movement:

- Camera x/y movement should be very small and spring-smoothed.
- Far mountain moves least; foreground moves most.
- Text depth has slight inverse parallax.
- Never create nausea or excessive perspective swing.

On scroll:

- Pin the hero briefly with **GSAP ScrollTrigger**.
- Camera slowly pushes toward the valley.
- The foreground mountain drops downward and scales subtly.
- Main headline separates in z-depth and fades through mist.
- Cloud layer thickens momentarily to create a seamless transition into the next section.

On reduced-motion devices:

- Disable camera drift, pinning and heavy parallax.
- Keep a simple fade/slide sequence and static mountain scene.

### Technical animation division

- **Three.js / React Three Fiber**: mountains, fog, atmospheric particles, procedural cloud/mist planes, camera depth.
- **GSAP + ScrollTrigger**: scroll-linked timeline, hero pinning, section transitions, multi-element choreography.
- **Framer Motion**: buttons, nav, cards, modal/detail transitions, drag/spring interactions, shared-layout card expansion.

Do not use all three libraries to animate the same property. Assign each library a clear responsibility.

---

## 4. Section two — 3D rotating “Coorg Worlds” carousel

Immediately after the mist transition, reveal a dark-to-light editorial section containing **four large 3D cards** arranged on a curved horizontal wheel / shallow cylinder.

The section should feel like turning through four interpretations of owning property in Coorg, not like a normal slider.

### Four conceptual cards

1. **Plantation Estates**  
   Art direction: high-altitude Coorg plantation, avocado/coffee greenery, soft rain mist, winding estate road.  
   Short line: `Working land. Living landscape.`

2. **Private Hill Retreats**  
   Art direction: contemporary estate villa tucked into dense Coorg forest, warm windows, wet stone, subtle pool reflection, misty mountain backdrop.  
   Short line: `Privacy shaped by the hills.`

3. **Curated Estate Plots**  
   Art direction: elevated masterplan/landscape view of a premium plotted estate among rolling green terrain, roads and open spaces integrated naturally.  
   Short line: `Space to build with intention.`

4. **Forest & Mountain Land**  
   Art direction: untouched green ridge, forest edge, dramatic layered valley and low cloud.  
   Short line: `Closer to the landscape.`

These four images may be AI-generated for the *category storytelling cards*. They must carry an unobtrusive label such as `Conceptual imagery` or be otherwise clearly presented as editorial/category art, not as an actual listing photograph.

### 3D carousel interaction

- Cards sit on a perspective arc with `rotateY`, z-depth, scale and opacity based on distance from center.
- Desktop: mouse wheel/trackpad while section is active rotates the wheel; drag is also supported.
- Mobile: horizontal drag/swipe with spring snapping.
- Center card is sharp and bright; side cards become slightly desaturated/softened and recede.
- Ambient shadow and faint reflection/ground haze reinforce depth.
- Carousel motion uses spring physics rather than abrupt snapping.

### Card click / press transition

When a card is selected:

1. The selected card rotates to face the viewer.
2. It moves forward in z-space and expands using a shared-layout transition.
3. Remaining cards drift backward and blur/fade.
4. A cloud/mist wipe crosses the screen.
5. The detail panel resolves beside or below the image with title, short story, relevant property types and CTA.
6. Close action reverses the choreography cleanly.

Do not open a plain modal abruptly. The expansion must feel physically connected to the selected card.

---

## 5. AI image art-direction prompts for the four carousel cards

These prompts are for **conceptual/category imagery only**.

### 5.1 Plantation Estates

`Cinematic high-altitude Coorg plantation in Karnataka, lush avocado and coffee estate across rolling hills, narrow wet estate road disappearing into soft morning fog, deep emerald foliage, monsoon moisture in the air, layered Western Ghats mountains in the distance, premium natural editorial photography, realistic but poetic, subtle warm dawn highlights, no people, no text, no logos, 16:10 landscape, extremely detailed foliage, atmospheric depth, restrained luxury real-estate campaign aesthetic.`

### 5.2 Private Hill Retreats

`A refined contemporary private estate retreat in Coorg hidden among dense tropical mountain forest, dark stone and warm timber architecture, warm interior glow, subtle infinity pool reflection, wet monsoon surfaces, low drifting mist between trees, layered hills beyond, understated luxury, realistic architectural photography, not futuristic, no people, no text, no logos, cinematic 16:10 landscape, premium resort editorial lighting.`

### 5.3 Curated Estate Plots

`Premium plotted estate integrated into the rolling green landscape of Coorg, elegant winding internal roads, generous green buffers, native trees, small landscaped open spaces and water feature, seen from an elevated oblique viewpoint, misty Western Ghats beyond, realistic masterplan visualization blended with natural photography, refined and believable, no text, no labels, no logos, 16:10 landscape, muted natural colors, high-end property campaign aesthetic.`

### 5.4 Forest & Mountain Land

`Untouched forest-edge land in Coorg, dramatic layered green mountain ridges, tall native trees framing an open meadow and valley, clouds moving low through the hills, post-rain atmosphere, rich natural textures, cinematic realistic landscape photography, quiet and expansive, no buildings, no people, no text, no logos, 16:10 landscape, premium editorial color grading.`

---

## 6. Homepage narrative after the 3D carousel

### A. “Why Coorg” editorial strip

Use an asymmetric split layout with a slow image reveal and 3–4 short facts/themes. Keep copy concise. Do not invent investment statistics.

Suggested thematic copy:

- `Altitude.`
- `Rain.`
- `Plantation culture.`
- `A landscape that changes with every cloud.`

The visual can use a confirmed/generic Coorg still image from the asset bank as atmosphere, provided it is not attached to a specific listing.

### B. Featured opportunities

Build a modular listing system but keep all records in draft until factual-publication criteria are met.

Recommended cards in development preview:

- SLN Plantations — strong source, price/map/current revenue still TBC.
- ABBELON Estates — strong branded visual source, legal/location/pricing data incomplete.
- Villa/pool cluster — media likely belongs together, 26-cent/₹4.5Cr association still requires confirmation.
- Other acreage leads can remain hidden from public homepage until enough data exists.

Each card must display a visible verification state in development/admin data, even if that status is not public-facing.

### C. Immersive “Land is more than area” section

Use one large still image with scroll-linked typography appearing in layers:

`It is the road in.`  
`The tree line.`  
`The rain pattern.`  
`The view you wake up to.`

This is a strong place for GSAP clip-path and text-mask animation.

### D. Private enquiry CTA

Finish with a calm full-width CTA rather than a loud sales banner.

Suggested copy:

`Looking for a specific kind of land in Coorg?`  
`Tell us what you are looking for. We will curate the right opportunities.`

Buttons:

- `Start an Enquiry`
- `WhatsApp Us` only after the official number is confirmed.

---

## 7. Navigation

Desktop nav should start transparent over the hero and transition to a frosted/opaque compact state after scrolling.

Suggested items:

- Opportunities
- Plantations
- Estates
- About Coorg
- Enquire

Do not create links to empty pages. If only the homepage is implemented initially, use in-page anchors and keep architecture ready for future routes.

Mobile nav should be a full-screen or 80–90% height panel with large editorial links and a subtle mountain/mist background treatment. Use Framer Motion for panel transition.

---

## 8. Still-image usage rules

### Confirmed/specific

`03_ASSETS/02_SLN_PLANTATIONS_CONFIRMED/`

Safe to identify as SLN-specific, but do not attach unverified price/revenue claims.

`03_ASSETS/03_ABBELON_ESTATES_CONFIRMED/`

Safe as ABBELON marketing/layout material. Mark/word legal-plan graphics as illustrative/reference; do not present them as sanctioned legal documents.

### Probable but not fully confirmed

`03_ASSETS/01_VILLA_26_CENT_PROBABLE/`

Treat as one villa/pool media cluster. Do not publicly state that these images are definitely the 26-cent / ₹4.5 crore property until client confirmation.

### Generic / TBC

`03_ASSETS/04_FOREST_LAND_GENERIC_TBC/`

Use only as generic Coorg atmosphere. Never claim that the road, pond, waterfall or JCB work belongs to a specific listing.

`03_ASSETS/05_SURVEY_AND_PLAN_TBC/`

Internal/reference only unless mapping and legal status are confirmed.

---

## 9. Content source-of-truth and property records

### Property A — Villa/pool cluster

Status: partial/probable.

Known notes:

- 26 cents
- ₹4.5 crore quoted
- 10 Queen beds
- 1 King bed
- 10 extra Single beds
- Room distribution note totals 11 main beds
- Location stamps around `12.445366, 75.877754` and `12.445074, 75.877756`

Do not infer guest capacity or exact classification.

### Property B — raw “50 caree” / ₹55 lakh

Status: incomplete.

Do not convert `50 caree` to 50 acres. Do not assume ₹55 lakh is per acre.

### Property C — 12-acre villa property

Status: incomplete.

Known: 12 acres; wording `villa property`. Price, map, media and specifications not supplied.

### Property D — 6-acre “Kisan JV”

Status: incomplete.

Known: 6 acres; `Kisan JV`; 6,000 sq ft; ₹2,000/sq ft. Meaning/basis unresolved. Do not calculate total value.

### Property E — 23.50-acre property

Status: incomplete.

Known: 23.50 acres; ₹60 lakh wording; an Instagram reference was supplied. Price basis and media association are not confirmed.

### Property F — 23-acre property

Status: partial.

Known: 23 acres; ₹45 lakh wording; coordinates `12.5529731, 75.7950978`. Do not assume rate basis.

### Property G — 20-acre Basavanahalli property

Status: partial.

Known:

- 20 acres
- Address: `CWWG+94Q, Basavanahalli, Karnataka 571234, India`
- Approx coordinate: `12.445624652349654, 75.92473067343235`
- Source associates the contact name/number `Computer Raju / +91 9481202280` with this lead only.

Do not use that number as the website's general contact without confirmation.

### Property H — SLN Plantations, Madapur/Madhapur

Status: strongest detailed source, but not yet fully publication-ready.

Source states:

- Total area: 80 acres / 79.86 acres
- Location wording: Garwale, Madhapur, Coorg, Karnataka
- Altitude: over 3,900 ft
- Annual rainfall: over 110 inches
- Avocado: 50 acres, 3,800 trees, 3,000 yielding, source average 100 kg/plant
- Litchi: 10 acres
- Robusta Coffee: 10 acres
- Arecanut: 15 acres interplanted, over 15,000 trees
- Netafim irrigation/fertigation
- RCC worker quarters for 20 workers
- Developed/tarred roads/pathways
- Scenic top point marketed for a 5,000 sq ft estate bungalow

Revenue figures in the PDF conflict. Do not publish current/projected crop revenue or ROI claims until clarified.

### Property I — ABBELON ESTATES

Status: strong visual association, incomplete legal/location/pricing data.

Marketing material states:

- `ABBELON ESTATES`
- `Premium Residential Layout`
- ~17 sites in ~40x60 category
- ~156 sites in ~30x40 category
- 68 other sites
- 1 utility/other
- 242 total sites
- main/internal road, landscaped/open areas, water body, clubhouse, drainage, street lights and avenue plantation shown in marketing graphics

The render graphics contain inconsistent dimensions/units. Do not use them as authoritative legal plans.

---

## 10. Public-content safety rules

Never invent or silently resolve missing facts.

- Never convert ₹45L/₹55L/₹60L into a per-acre rate without confirmation.
- Never convert `50 caree` into `50 acres` without confirmation.
- Never label a generic waterfall as private/on-site.
- Never assign generic forest imagery to a specific property without confirmation.
- Never present AI imagery as the actual property.
- Never present ABBELON renders as legally sanctioned plans.
- Never publish SLN revenue/ROI figures while source values conflict.
- Never expose a lead-specific phone number as the global contact without client approval.
- Keep unknown values as `TBC` / `Not supplied` in the internal data model.

A listing should be considered factually publication-ready only when it has confirmed identity/name, map/location, area, price + price basis, property type, correct media association, public contact, and intended legal/title/approval wording.

---

## 11. Next.js implementation architecture

Assume an existing Next.js App Router starter with `src/`, `public/`, TypeScript and pnpm.

Recommended dependencies:

```bash
pnpm add gsap framer-motion three @react-three/fiber @react-three/drei
pnpm add clsx tailwind-merge lucide-react
pnpm add -D @types/three
```

If Tailwind is already configured, keep it. If not, use the project's existing CSS strategy rather than introducing multiple styling systems.

Suggested source structure:

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    home/
      CoorgHero.tsx
      HeroCanvas.tsx
      MountainScene.tsx
      CoorgWorldsCarousel.tsx
      WorldCard.tsx
      WhyCoorg.tsx
      FeaturedOpportunities.tsx
      LandStory.tsx
      EnquiryCTA.tsx
    navigation/
      SiteHeader.tsx
      MobileMenu.tsx
    ui/
      MagneticButton.tsx
      RevealText.tsx
      SectionLabel.tsx
      MistTransition.tsx
  data/
    opportunities.ts
    content.ts
  lib/
    motion.ts
    gsap.ts
    three.ts
    cn.ts
  hooks/
    useReducedMotion.ts
    useMediaQuery.ts
public/
  images/
    coorg/
      supplied/
      conceptual/
```

Copy only approved still images from this pack into `public/images/coorg/supplied/` using clean web-safe filenames.

---

## 12. Performance rules

The site must feel cinematic **and** fast.

Targets:

- No homepage background video.
- Prefer AVIF/WebP derivatives for large stills while keeping original sources outside `public` if needed.
- Use `next/image` for normal image content.
- Lazy load off-screen Three.js/detail experiences.
- Keep the hero R3F scene intentionally low-poly / low draw-call.
- Clamp DPR, e.g. `dpr={[1, 1.5]}` on heavy scenes.
- Avoid runtime shadow maps where a baked/fake shadow works.
- Avoid dozens of transparent cloud planes; use a small number of optimized layers.
- Destroy GSAP ScrollTriggers on unmount.
- Dynamically import WebGL hero client-side if needed.
- Provide a static fallback for low-power devices / no WebGL.
- Do not block LCP with large JS initialization before the hero text is visible.

Aim for a stable 60fps feel on modern desktop and a simplified but premium experience on mid-range mobile.

---

## 13. Responsive behavior

### Desktop

Use full 3D hero, pointer parallax, pinned transition and full curved carousel.

### Tablet

Reduce camera/pointer range, shorten pin duration, show 3 visible carousel cards.

### Mobile

- Simplify WebGL geometry and particle count.
- Do not pin the hero for long.
- Keep text legible and avoid overlapping critical CTA areas.
- Carousel becomes swipe-first with one dominant card and partial neighboring cards.
- Detail expansion should become a full-screen sheet/page-like takeover.
- Preserve the mountain/mist feeling using fewer layers.

---

## 14. Accessibility and usability

- Respect `prefers-reduced-motion`.
- All interactions must work by keyboard as well as pointer where relevant.
- Carousel has previous/next controls and accessible labels in addition to drag.
- Do not hide essential copy inside WebGL canvas.
- Main headline and CTAs remain normal DOM text.
- Contrast must remain readable across fog/image states.
- Focus states must be visible.
- Avoid scroll hijacking. Scroll-linked motion must still follow native page scroll.

---

## 15. Final quality bar

The build is successful when:

- The first 5 seconds feel unmistakably “Coorg” without using video.
- The hero creates real perceived depth through mountain layers, mist and typography.
- GSAP, Framer Motion and Three.js each have a deliberate role.
- The 4-card 3D carousel is the second memorable interaction.
- Card selection transitions into details rather than opening an ordinary modal.
- The site remains smooth on mobile and offers reduced-motion fallbacks.
- No Bangalore/Hoodi data appears anywhere.
- No MP4/video dependency exists.
- No property claims exceed the supplied/confirmed data.
- AI-generated imagery is treated as conceptual storytelling only.
- The existing Next.js starter remains clean and maintainable rather than becoming a one-file animation demo.
