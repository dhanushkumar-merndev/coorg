# Supplied asset provenance

Source-of-truth: `doc/ASSET_MANIFEST.csv`, `doc/DOC.md`, and the original `doc/01_SOURCE_DOCUMENTS/COORG/SLN_Plantations_Madapur.pdf`. The PDF was read with `pdftotext -layout`. Its inconsistent current/projected revenue claims are intentionally not reproduced in the application.

All consumed images were visually inspected. WebP derivatives use Sharp, quality 86, maximum width 1600, without enlargement. Full uncropped originals remain under `doc/03_ASSETS/`. No videos, technical plan photos or enhanced legal/reference images were ingested.

| Public derivative (under `public/images/coorg/supplied/`) | Source (under `doc/03_ASSETS/`) | Usage and confidence |
| --- | --- | --- |
| `generic/forest-road.webp` | `04_FOREST_LAND_GENERIC_TBC/forest_02_internal_road.jpg` | Why Coorg atmosphere only; not associated with a listing. |
| `generic/forest-curve.webp` | `04_FOREST_LAND_GENERIC_TBC/forest_04_internal_road_curve.jpg` | Land Story atmosphere only; not associated with a listing. |
| `sln/plantation.webp` | `02_SLN_PLANTATIONS_CONFIRMED/sln_02_estate_plantation.jpg` | Confirmed SLN source image; development preview only. |
| `abbelon/marketing-layout.webp` | `03_ABBELON_ESTATES_CONFIRMED/abbelon_01_layout_day.jpg` | Confirmed branded marketing render; development preview, explicitly illustrative. No legal approval or dimension claims. |
| `villa/pool-cluster.webp` | `01_VILLA_26_CENT_PROBABLE/villa_02_pool_main.jpg` | Probable villa media cluster, development preview only. Not publicly identified as the 26-cent lead. |

## Review finding

`forest_01_internal_road_tree_split.jpg` visibly contains an “AI-generated content” watermark despite its generic/TBC manifest classification. It is not ingested or used. Generic imagery remains atmosphere, without exact-location or specific-property claims.

## Publication boundary

All nine opportunity records have `publicReady: false`. `src/data/opportunities.ts` is marked `server-only`; the featured component renders source records only in `NODE_ENV=development`. Production shows general enquiry copy with no draft property claims. Imported stills are static files, not a listing publication approval. Price wording, source coordinates and cautions are kept internal; source-specific contact numbers are not included in application data.

No official general contact was supplied. The enquiry form prepares a local downloadable text brief, clearly explains that no enquiry is sent, and stores no form data in localStorage or on a server.
