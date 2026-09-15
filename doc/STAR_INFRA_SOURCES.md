# Star Infra Developers: Coorg portfolio adaptation

Source: [Star Infra Developers — Star Groups](https://www.stargroups.info/companies/star-infra-developers). Retrieved 11 September 2026 from the rendered HTML and its embedded project records. The user's current request authorizes adapting the relevant project information and still images for Land in Coorg.

## Scope and factual status

The source explicitly places the following three Madikeri projects in its completed-project section (embedded status: `finished`). It provides no price, area, precise coordinates, project-specific public contact, sale inventory or legal documentation for any of them. Completion is separate from sales availability: the source establishes neither **Sold out** nor **Available**. The user separately confirmed Sold out for all three on 11 September 2026. No separate project-detail links are supplied for these projects; their source URL is the company page above.

On 11 September 2026, the user requested **Ongoing Projects first** and supplied **Star Garden**, a coffee estate plot development at Madikeri, to replace the previous ongoing project entirely. The active Managed Farmlands collection now presents Star Garden before the three completed Coorg estates. The former ongoing project record and its three public image assets have been removed. Star Garden's details come from the user's supplied copy, not the developer website. Other unrelated city projects and group-wide delivery statistics have not been imported. Statistics for the wider developer must not be attributed to these estates.

`src/data/projects.ts` stores the completed estates as `source-portfolio` records and Star Garden as a `user-provided-project` record. All retain `publicReady: false` for property-listing purposes, with unknown values set to `null`. The completed estates' visible editorial summaries are newly written thematic copy, not extra property specifications. Their descriptions and features paraphrase the source. A source association confirms where an image was published; it does not certify that the image documents an actual site.

## Relevant project information

| Project | Source location and category | Source-supported description | Lifecycle | Sale availability |
| --- | --- | --- | --- | --- |
| Star Woods Estate | Madikeri; premium farmland development | Agricultural parcels with internal access roads; marketed around natural surroundings, weekend use and long-term land ownership. | Completed | Sold out — user-confirmed |
| Star Coffee County | Madikeri; managed farmland | Separate farmland parcels, plantation surroundings and internal pathways; positioned for private farm retreats. | Completed | Sold out — user-confirmed |
| Star Misty Acres | Madikeri; luxury farmland and weekend retreat development | Farmland amid Coorg's greenery and mist, marketed for private land ownership, plantation living and weekend visits. | Completed | Sold out — user-confirmed |

The descriptions of weekend use and retreats are marketing positioning, not evidence of building permission, approved use or completed homes. Do not derive bedroom counts, plot measurements, amenities, ownership rights or financial returns from the imagery.

## Managed Farmlands and requested price

The user previously requested ongoing work under Farm Management, now Managed Farmlands, and a temporary **₹999 per sq ft** price. The data model records `{ amount: 999, basis: "sq-ft", status: "user-placeholder" }` independently of individual projects. It is not a price from Star Infra Developers.

`managedFarmlandsPreview` is a programme preview, with no invented project name, map, availability or lifecycle. The user subsequently specified that the temporary price should appear in the hero as a starting price. It is not assigned to Star Garden or the completed estates. A user-approved inventory update can subsequently set `availability` to `available` or `sold-out` independently of project lifecycle.

## Ongoing project: Star Garden — user supplied 2026-09-11

Source: the user's project copy and replacement instruction supplied on 11 September 2026. No separate site photographs, approval documents or project source URL were supplied. The user places this project in the ongoing collection at `/managed-farmlands/star-garden`.

Star Garden is described as **Premium Coffee Estate Plots at Madikeri**, comprising 10 acres and 33 exclusive plots (updated from 30 per user correction on 2026-09-15), including 9 premium stream-attached plots. The stated 12 plots sold is a user-supplied snapshot; do not infer current available inventory by subtraction. Current `availability` remains `null`.

The supplied facilities are developed CC internal roads, partition registration, and a LAP loan facility subject to lender eligibility and approval. Listed amenities are a 5,500 sq. ft. clubhouse, community kitchen, dining hall, swimming pool, dense plantation and natural coffee estate surroundings. These are user-supplied descriptions, without independent construction or legal verification.

The supplied distances are NH 274 at 700 metres, Madikeri at 9 km, Mysore at 110 km and Bengaluru at 220 km. They are contextual distances, not a verified map pin or surveyed location. `coordinates`, `legalStatus`, `publicContact`, `sourceUrl` and exact plot sale pricing (`price`) remain `null`; unknown registration conditions and exact sale terms remain TBC. `verificationStatus` is `partial`, and `publicReady` remains `false`.

### Investment proposals and qualifications

The user supplied an approximately **₹50,000 per annum** coffee-cultivation income projection, subject to production and market conditions. No per-plot, gross/net or cost basis was supplied; do not invent one.

The optional 4BHK villa proposal describes construction through a reputed construction partner, with **₹1 crore land investment** and **₹1 crore villa construction investment**. These amounts belong to the proposed investment structure and are not a confirmed plot asking price, price basis, construction quotation or guaranteed return.

The **approximately 18-month expected ROI timeline** is a user-supplied projection, subject to occupancy, rental income, market conditions and project performance. It must not be presented as an established payback period. Preserve the user's full disclaimer alongside these proposals:

> All income and ROI figures are projections and are not guaranteed. Final returns may vary based on market conditions, operating costs, approvals, construction expenses, and actual revenue.

## Image provenance and presentation

All nine still images associated with the three Coorg projects were downloaded. No video was downloaded or added. The original PNGs are 1448 × 1086 pixels. WebP derivatives preserve those dimensions, using Sharp at quality 88 without enlargement; the nine files total approximately 3.5 MB, compared with approximately 24 MB of originals.

The originals were retained for the working session under `/tmp/coorg-star-infra-originals/`; canonical permanent provenance is each original source URL below. No app runtime depends on that temporary directory. All publicly served derivatives are under `public/images/coorg/star-infra/`.

Use **Source marketing imagery** as the visible media label and **Illustrative imagery from Star Infra Developers** where a longer caption fits. Several images visibly resemble visualizations, while the source does not specify capture authenticity. No imported image should be called a verified property photograph or used as legal evidence. Alt text describes visible features without asserting constructed amenities.

| Local file | Original source | Visible content / caution |
| --- | --- | --- |
| `star-woods-estate-1.webp` | [Original PNG](https://www.stargroups.info/starinfradeveloper/completed/star-woods-estate-1.png) | Landscaped road and contemporary houses; source marketing association only. |
| `star-woods-estate-2.webp` | [Original PNG](https://www.stargroups.info/starinfradeveloper/completed/star-woods-estate-2.png) | Stone cottage, tiled roof and planting at sunset. |
| `star-woods-estate-3.webp` | [Original PNG](https://www.stargroups.info/starinfradeveloper/completed/star-woods-estate-3.png) | Misty planted hillside, winding access track and small buildings. |
| `star-coffee-county-1.webp` | [Original PNG](https://www.stargroups.info/starinfradeveloper/completed/star-coffee-county-1.png) | Aerial layout of green parcels and roads; not a sanctioned plan. |
| `star-coffee-county-2.webp` | [Original PNG](https://www.stargroups.info/starinfradeveloper/completed/star-coffee-county-2.png) | Multistorey urban-looking building; source maps it here, but do not infer apartment specifications for the farmland project. |
| `star-coffee-county-3.webp` | [Original PNG](https://www.stargroups.info/starinfradeveloper/completed/star-coffee-county-3.png) | Planted hillsides, tracks and scattered buildings. |
| `star-misty-acres-1.webp` | [Original PNG](https://www.stargroups.info/starinfradeveloper/completed/star-misty-acres-1.png) | Stone and timber villa, landscaped stream and misty hills. |
| `star-misty-acres-2.webp` | [Original PNG](https://www.stargroups.info/starinfradeveloper/completed/star-misty-acres-2.png) | Two-storey villa, lawn and stream in a wooded landscape. |
| `star-misty-acres-3.webp` | [Original PNG](https://www.stargroups.info/starinfradeveloper/completed/star-misty-acres-3.png) | Lit villa and pond at dusk. |

The data model prioritizes Woods image 3, Coffee image 3 and Misty image 1 for the card composition. All remaining source images are preserved without modifying their contents. No completed-Coorg-project image has been assigned to the ongoing project or used to imply that the preview has a completed villa, pond, waterfall or road.

### Star Garden concept image

Exactly one new image was generated with the built-in `image_gen.imagegen` tool on 11 September 2026 and saved at `public/images/coorg/conceptual/star-garden.webp`. It is 1672 × 941 pixels, approximately 480 KB, optimized with the existing Next.js Sharp dependency at WebP quality 86 without enlargement. The original PNG is retained at `output/imagegen/star-garden.png`; the [final prompt and complete tool provenance](../output/imagegen/star-garden-prompt.md) are recorded alongside it.

The image depicts a conceptual coffee plantation, stream, concrete estate road, clubhouse and swimming pool amid misty hills. Display **AI-generated concept imagery** visibly on the project card and detail hero. `association: "conceptual"`, `mediaKind: "ai-concept"`, `sourceUrl: null` and `factualCaptureConfirmed: false` distinguish it from the completed estates' source marketing images. It is not a site photograph, evidence of actual amenities, a surveyed layout or an approved plan.

## Client DOCX / SLN price-basis review

Also read `/home/dhanushkr/Downloads/Land_in_Coorg_Client_Data_Extraction_and_Asset_Mapping.docx` and the original `doc/01_SOURCE_DOCUMENTS/COORG/SLN_Plantations_Madapur.pdf` for the user's follow-up about per-acre pricing. The extraction DOCX flags three specific sale-price notes with unknown bases: ₹55 lakh for the raw “50 caree” lead, ₹60 lakh for the 23.50-acre lead and ₹45 lakh for the 23-acre lead. It provides no SLN sale/asking price.

The SLN PDF also provides no asking price. Its conflicting figures concern avocado crop revenue: page 1 describes 300 MT at ₹100/kg as ₹2.5 crore annually, while page 2 uses ₹3 crore and mixes current wording with a 2030 heading. Sale-price clarification does not reconcile these crop-revenue statements. Do not assign one of the separate land-lead prices to SLN or reinterpret crop revenue as an asking price.

### SLN rate explicitly confirmed by the user — 11 September 2026

The user answered the direct question about SLN's sale price with **“999 per sq”**. This latest specific basis supersedes the earlier vague per-acre wording: SLN's display rate is recorded as **₹999 per sq ft (user-confirmed display rate)**, with `priceBasisConfirmed: true`. The rate comes from the user, not the PDF. Only SLN's opportunity record was updated; the other land leads retain their prior unknown price bases. SLN remains `publicReady: false` while map, legal wording and public contact are unresolved. Its separate crop-revenue caution remains intact.

## User-confirmed estate availability · 2026-09-11

The user explicitly requested a Sold out tag alongside Completed for all three pictured Coorg estates. Star Woods Estate, Star Coffee County and Star Misty Acres now have availability `sold-out`, with `availabilitySource: user-confirmed`. This is a user confirmation, not an availability statement extracted from Star Infra Developers. Star Garden's overall current availability remains `null` despite the user-supplied snapshot of 12 sold plots.
