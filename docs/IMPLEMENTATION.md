# Land in Coorg — implementation and handoff

The original `AGENTS.md`, `doc/DOC.md`, source PDF and image manifest were used as the implementation contract. The user's subsequent UI decisions supersede these initial design specifics:

- Five balanced category cards, adding **Countryside Homes**.
- Lenis smoothing, native touch, direct GSAP scrubbing. A native sticky desktop hero adds 70% of a viewport of continuous parallax before release, with no GSAP pin spacer or blank settling interval. Mobile and reduced motion use normal section flow.
- Stronger landscape/camera/text parallax, a subtle animated bird flock, varied text treatments, drawn lines and editorial image parallax. Foreground depth comes from the three non-repeating photo regions, with ridge and treeline masks.
- DM Serif Display with Manrope, 14px desktop navigation centred independently of the logo, 8px global button radius.
- Centre-card arrows only. Carousel selection centres the card and expands its image into a detail modal. Close reverses the image into its measured card position. The source card is hidden for the entire transition so no duplicate image or placeholder appears. Drag release never opens details. Editorial depth cards link to individual world pages.
- An interactive procedural terrain study with contour lines, labelled conceptual and unrelated to a surveyed property.
- Separate Opportunities, Plantations, Estates, About Coorg and Enquiry pages, plus five individual world pages. A persistent fog cover coordinates internal navigation and page entrances.
- React Icons for all UI icons, and a custom animated enquiry dropdown with rounded forest-colour focus styling.

## Pages and navigation

The root layout owns the shared header, footer, main landmark, Lenis integration and `PageTransition` provider. Routes render their own semantic heading, metadata and editorial composition:

| Route | Composition |
| --- | --- |
| `/` | Existing mountain hero, carousel, Why Coorg, draft-aware opportunity preview, land story and enquiry invitation |
| `/opportunities` | Landscape hero, carousel and search considerations |
| `/plantations` | Plantation hero, layered editorial images, land-care questions and next-chapter navigation |
| `/estates` | Retreat hero, three pointer-responsive depth cards and home editorial |
| `/about-coorg` | Landscape hero, panoramic parallax, terrain study and next-chapter navigation |
| `/enquiry` | Dedicated introduction, open personal brief form and interactive terrain |
| `/opportunities/[slug]` | Five generated category pages with their own hero, story, considerations and related worlds |

The five world slugs are `plantation-estates`, `private-hill-retreats`, `curated-estate-plots`, `forest-mountain-land` and `countryside-homes`. They are editorial categories, not published property listings. Unknown slugs use Next.js not-found handling.

`TransitionLink` preserves Next links and native modified-click behaviour. For internal page changes, the Web Animations API moves soft fog banks across the old page, reaches an opaque cover, then commits the route. Scroll position and Lenis are synchronized underneath; the provider waits briefly for the new hero image before uncovering it and starting the page entrance. It then focuses the new heading without scrolling. Same-page anchors retain ordinary Next/Lenis behaviour. Browser history clears stale transitions, and a timeout prevents a failed navigation leaving the curtain stuck. Hard refresh starts with the cover idle. Reduced motion uses short opacity transitions without travelling fog banks.

## Animation boundaries and performance

R3F owns three complementary regions of the original photograph, masked along traced ridge and treeline contours, two subtle shader mist layers, pointer depth and the terrain sculpture. Scroll translates the near region faster than the middle and far regions; the camera stays at a fixed distance, avoiding a zoom-only effect. Each photograph region occurs once, replacing stacked full-photo projections that created repeated mountain ridges. Hero WebGL loads behind a client-only dynamic boundary, replaces its fallback image when ready, without overlapping two differently transformed photographs, clamps DPR, pauses off-screen/in hidden tabs, and preserves HTML, faint CSS mist and photographic fallback. The terrain mounts near its viewport and uses a static SVG under reduced motion or without WebGL. Birds pause off-screen and disappear in reduced motion.

GSAP owns scroll choreography, text reveals, image parallax and drawn rules. Lenis feeds the GSAP ticker; listeners and ScrollTriggers are cleaned up. Framer Motion owns drag, card springs, the measured card-to-modal image transition, depth-card pointer response, dropdown/menu animation and UI feedback. GSAP animates depth-card wrappers while Framer Motion animates their child tilt, keeping ownership separate. The fog provider persists across routes and composites three small, pre-baked procedural noise textures with feathered edges. Texture generation runs once; navigation only changes opacity and transforms.

The home hero entrance is CSS-driven from the server’s first paint: hidden, reveal once, remain visible. It pauses beneath the route cover, avoids a hydration replay, and stays readable without JavaScript. Text no longer uses one reveal everywhere. The homepage combines masked lines, ink opacity fills and directional wipes. Shared `PageMotion` supports editorial masked words, plantation ink fills, estate wipes, landscape text settling and quiet enquiry entrances; field rules draw with scroll and card copy fades in sequence. Image parallax and large drifting words add depth between these treatments. These effects are skipped under reduced motion so the text stays visible and readable.

All interface icons come from `react-icons/lu`. Procedural terrain/contour drawings and bird silhouettes remain decorative artwork rather than a separate icon set. Buttons share 8px corners, with circular controls retained where appropriate.

Three.js is on the 0.182 compatible line: the installed R3F 9.7 still instantiates Clock internally, and newer Three releases emit deprecation warnings for that call.

## Content safety

All nine internal opportunities are server-only and `publicReady: false`. Three source-labelled draft previews exist only in development. Production does not render those records or their unknown prices. No unverified revenue, approvals, price basis, coordinates or global phone details are exposed.

Only five necessary supplied still derivatives were ingested. Originals remain in `doc/`. `forest_01` was excluded after inspection revealed an AI-generated mark. All six newly generated assets remain explicitly conceptual; prompts and provenance are in `docs/image-generation.md`. There are no videos or video requests.

The dedicated enquiry page shows the brief form immediately. The reusable invitation can still expand the same form within editorial pages. The custom combobox exposes its label, active option and selected state to assistive technology; it supports arrows, Home/End, Enter/Space, Escape, Tab, type-ahead and outside clicks. Its list opens above or below the field according to available space. Form inputs and the dropdown use rounded focus treatment consistent with the site.

The form validates details and generates a local `.txt` download. It does not transmit or persist personal details. A confirmed official contact destination is required for real submissions/WhatsApp; none was invented.

## Verification

The earlier homepage milestone passed lint/build and its eight experience tests, with Chromium/Firefox and responsive visual checks. That evidence belongs to the previous modal-based version; it does not certify the newer route flow.

Final verification: `pnpm lint` and `pnpm build` pass. All **18 Playwright tests pass against the production server**: semantic content/images, five-card controls, side-card modal open/close and focus return, drag suppression, enquiry navigation/download, custom dropdown keyboard behaviour, direct route loads, fog navigation, Back/Forward scroll restoration, mobile menu cleanup, reduced motion, overflow and the continuous hero handoff. The hero entrance was tested with delayed hydration and with JavaScript disabled. A Firefox smoke check also passed carousel modal interaction and fog navigation without page errors or horizontal overflow.

Desktop and 390px screenshots were inspected for page typography, rounded form controls, carousel composition and modal layout. Hero cut boundaries are traced at all 1,672 source columns using local image contrast around art-directed guides; the centre ridge concealed by the canopy is feathered through the mist. Regenerate the contour data with `node scripts/trace-hero-contours.mjs` if the source artwork changes.

## Commands

```sh
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

The test server defaults to port 3000 and reuses an existing local dev server. For production, run `pnpm start --port 3100` and use `PLAYWRIGHT_BASE_URL=http://localhost:3100 pnpm test:e2e`. An existing Chromium binary can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.
