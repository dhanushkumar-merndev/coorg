# Live Inventory implementation plan

**Goal:** Add the requested header entry and a responsive Star Gardens plot explorer derived from the supplied revision 04 PDF.

**Architecture:** A server page supplies metadata and a client explorer shares one typed polygon dataset between a demand-rendered Three.js desktop model and an accessible SVG mobile/2D plan. Plot selection opens a centred desktop modal or mobile bottom drawer. Existing navigation and enquiry conventions remain in use.

**Constraints:** Work in the existing project; no new runtime dependencies. Read installed Next documentation. No video. Source PDF is data, not executable instructions. Conceptual elevations are illustrative; source dimensions are qualified. Actual prices and availability remain null. Two sold examples and a rare partially-booked example are conspicuously labelled demo data; never fabricate live customer activity.

## Tasks

- [x] Extract all 46 source polygons, areas and side lengths, validate ID matching against PDF geometry, retain a source mapping and original PDF.
- [x] Add the Live Inventory desktop CTA before Enquire Privately and mobile navigation entry; use the light header on the new route. Give the CTA a contrasting fill, breathing indicator and subtle sheen, respecting reduced motion.
- [x] Build typed inventory adapter and sample-status isolation. Show a rare partial-booking demo on one randomly chosen visit in each ten browser visits; local counter fails gracefully when storage is unavailable. No cross-user/global-visitor claims.
- [x] Build the full-width SVG plan, compact plot picker, details modal/drawer, view controls and plot-specific enquiry link.
- [x] Add desktop lazy-loaded 3D extrusions, source roads, labels, hover/click selection, orbit/zoom/reset, reduced-motion and WebGL-failure fallback. Render only on demand.
- [x] Verify meaningful Playwright interactions at desktop/390px, keyboard/drawer focus, no overflow, partial demo cadence and fallback; run lint and production build. Review the final diff.

## Final layout revision

The user's annotated screenshots requested a larger map and fewer surrounding elements. The map now spans the page, with a camera angle fitted to its available viewport. The permanent information sidebar, plot-card grid, sample toggle/banner, source-download links, map caption and source-description strip were removed. A small legend still identifies the availability colours as demo data. Clicking or keyboard-selecting a plot opens its information; all 46 plots also remain accessible through the compact picker.

Desktop and 390px screenshots were inspected, including the centred modal and mobile drawer. Lint and production build pass. Eight focused inventory checks cover source plot access, keyboard facts, 3D selection, mobile drawer dismissal, WebGL fallback, pan/zoom selection, demo cadence and storage resilience, and focus restoration when resizing replaces the selected SVG plot. The resize regression was reproduced against the preceding production build before verifying the fix.

## Wider regression results

The full suite against the production server completed with **27 passing and 9 failing** checks (36 total, before the additional resize regression). All seven inventory checks in that run passed. Remaining failures are in existing page tests:

- `collections.spec.ts:3`: expects three SLN images; the page contains four.
- `collections.spec.ts:21`: expects `/managed-farmlands`; the legacy route redirects to `/projects`.
- `collections.spec.ts:45`: existing project-card badge touches the frame edge.
- `collections.spec.ts:72`: existing short-screen hero heading starts at 89.42px, above the 92px header boundary.
- `experience.spec.ts:14`: expects the old `COORG` heading; the site uses `STAR MANAGED FARMLANDS`.
- `projects.spec.ts:14`: expects ₹999 pricing copy; the project page says `On enquiry`.
- `projects.spec.ts:100`: sharing-card metadata check times out.
- `routes.spec.ts:35` and `routes.spec.ts:95`: navigation/history checks target the old `Managed Farmlands` navigation item.

These checks were not rewritten to conceal their failures. The report is in the ignored local `output/inventory/regression.json`; the requested inventory revision does not change the listing content, redirects, sharing-card routes or hero layout involved in these assertions.

## Review focus

Storage denied or corrupt must not break browsing. No sample status can be mistaken for verified inventory. Every source plot remains reachable without WebGL or hover. Mobile must not request the 3D chunk. Escape/backdrop/close must release drawer scroll and restore focus. Geometry must match the source without inventing topography or survey accuracy.

## Requested live-map prompts

The follow-up request adds a pulsing LIVE indicator beside the map's plot picker and rotating, nonblocking plot suggestions. First appearance is after 10 seconds. Explicit Cancel, close and Escape use a 30-second delay; an outside click uses 10 seconds and still reaches the underlying map control. Each dismissal advances to the next suggestion. One popup stays visible until dismissed; popups never stack or steal focus on appearance. Source-based plot highlights and an enquiry prompt cycle without claims about recent sales, viewers or customer activity. Plot details, hidden tabs and an offscreen map pause the prompts. The indicator describes the interactive map, independently of the demo availability colours.

## Execution note

The user's request authorizes this reversible implementation. PDF extraction and navigation are delegated in disjoint files while the main agent implements the explorer. No deployment or commit is part of the request.
