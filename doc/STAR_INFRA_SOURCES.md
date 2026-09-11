# Star Infra Developers: Coorg portfolio adaptation

Source: [Star Infra Developers — Star Groups](https://www.stargroups.info/companies/star-infra-developers). Retrieved 11 September 2026 from the rendered HTML and its embedded project records. The user's current request authorizes adapting the relevant project information and still images for Land in Coorg.

## Scope and factual status

The source explicitly places the following three Madikeri projects in its completed-project section (embedded status: `finished`). It provides no price, area, precise coordinates, project-specific public contact, sale inventory or legal documentation for any of them. Completion is separate from sales availability: neither **Sold out** nor **Available** is established. No separate project-detail links are supplied for these projects; their source URL is the company page above.

The website names no ongoing Coorg project. In a follow-up to the explicit Coorg-preview-versus-Arkha question, the user asked to retain the website's ongoing projects for now. This expands the source portfolio to **Arkha Sanctuary**, with its Bengaluru location and residential classification preserved. It does not authorize relabelling city apartments as a Coorg farm. Other unrelated city projects and group-wide delivery statistics have not been imported. In particular, statistics for the wider developer must not be attributed to these three estates.

`src/data/projects.ts` stores these as source portfolio records, with `publicReady: false` for property-listing purposes and unknown values set to `null`. Visible editorial summaries are newly written thematic copy, not extra property specifications. Descriptions and features paraphrase the source. A source association confirms where an image was published; it does not certify that the image documents an actual site.

## Relevant project information

| Project | Source location and category | Source-supported description | Lifecycle | Sale availability |
| --- | --- | --- | --- | --- |
| Star Woods Estate | Madikeri; premium farmland development | Agricultural parcels with internal access roads; marketed around natural surroundings, weekend use and long-term land ownership. | Completed | Not supplied |
| Star Coffee County | Madikeri; managed farmland | Separate farmland parcels, plantation surroundings and internal pathways; positioned for private farm retreats. | Completed | Not supplied |
| Star Misty Acres | Madikeri; luxury farmland and weekend retreat development | Farmland amid Coorg's greenery and mist, marketed for private land ownership, plantation living and weekend visits. | Completed | Not supplied |

The descriptions of weekend use and retreats are marketing positioning, not evidence of building permission, approved use or completed homes. Do not derive bedroom counts, plot measurements, amenities, ownership rights or financial returns from the imagery.

## Farm Management and requested price

The current user requested ongoing work under Farm Management and a temporary **₹999 per sq ft** price. The data model records `{ amount: 999, basis: "sq-ft", status: "user-placeholder" }` independently of the completed projects. It is not a price from Star Infra Developers.

`farmManagementPreview` is a programme preview, with no invented project name, map, availability or lifecycle. The user subsequently specified that the temporary price should appear in the hero as a starting price. It is not assigned to Arkha Sanctuary. The supplied source does not establish any ongoing Coorg project or a management-service specification. A user-approved inventory update can subsequently set `availability` to `available` or `sold-out` independently of project lifecycle.

## Ongoing source project: Arkha Sanctuary

The source labels **Arkha Sanctuary** `ongoing` and locates it at **BHCS Layout, Banashankari VI Stage, Bengaluru**. The cover also mentions Uttarahalli. It describes 2 and 3 BHK apartments, vastu-compliant layouts and no common walls. The website names swimming pools, a gym, landscaping, a jogging track and 24-hour security. No price, sale availability, exact map pin or project-specific contact is supplied.

The downloaded amenities brochure additionally describes a toddlers' pool, children's play area, multipurpose hall, indoor/outdoor gym, shuttle court, rainwater harvesting, STP, water supply, power backup, a 14-passenger lift, parking and CCTV. Treat these as proposed marketing specifications, not evidence of completed facilities.

The website claims BBMP approval; the brochure cover also claims CC and OC. No supporting approval document was supplied. The amenities brochure explicitly identifies itself as conceptual and not a legal offering. Actual `legalStatus` remains `null`; the artwork and typical floor plan are marketing references, not sanctioned plans. No unit-size table has been used to imply available inventory.

`farmProjects` exports this record using the same project schema. Its location must stay visible when presented within the user-requested Farm Management / ongoing area. It is a residential source portfolio record and not a farm management service. Its price and availability remain `null`.

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

### Arkha assets added after the scope clarification

The following source-native WebPs retain their 3508 × 2480 dimensions and source encoding without enlargement or recompression. They total approximately 1.7 MB. These three assets are associated only with Arkha Sanctuary.

| Local file | Original source | Presentation |
| --- | --- | --- |
| `arkha-sanctuary-exterior.webp` | [Source WebP](https://www.stargroups.info/starinfradeveloper/1.webp) | Branded exterior visualization and brochure cover. |
| `arkha-sanctuary-floor-plan.webp` | [Source WebP](https://www.stargroups.info/starinfradeveloper/2.webp) | Illustrative typical floor plan; not verified legal documentation or availability. |
| `arkha-sanctuary-amenities.webp` | [Source WebP](https://www.stargroups.info/starinfradeveloper/arkha-sanctuary-amenities.webp) | Conceptual amenities, apartment cutaways and courtyard rendering. |

## Client DOCX / SLN price-basis review

Also read `/home/dhanushkr/Downloads/Land_in_Coorg_Client_Data_Extraction_and_Asset_Mapping.docx` and the original `doc/01_SOURCE_DOCUMENTS/COORG/SLN_Plantations_Madapur.pdf` for the user's follow-up about per-acre pricing. The extraction DOCX flags three specific sale-price notes with unknown bases: ₹55 lakh for the raw “50 caree” lead, ₹60 lakh for the 23.50-acre lead and ₹45 lakh for the 23-acre lead. It provides no SLN sale/asking price.

The SLN PDF also provides no asking price. Its conflicting figures concern avocado crop revenue: page 1 describes 300 MT at ₹100/kg as ₹2.5 crore annually, while page 2 uses ₹3 crore and mixes current wording with a 2030 heading. Sale-price clarification does not reconcile these crop-revenue statements. Do not assign one of the separate land-lead prices to SLN or reinterpret crop revenue as an asking price.

### SLN rate explicitly confirmed by the user — 11 September 2026

The user answered the direct question about SLN's sale price with **“999 per sq”**. This latest specific basis supersedes the earlier vague per-acre wording: SLN's display rate is recorded as **₹999 per sq ft (user-confirmed display rate)**, with `priceBasisConfirmed: true`. The rate comes from the user, not the PDF. Only SLN's opportunity record was updated; the other land leads retain their prior unknown price bases. SLN remains `publicReady: false` while map, legal wording and public contact are unresolved. Its separate crop-revenue caution remains intact.

## User-confirmed estate availability · 2026-09-11

The user explicitly requested a Sold out tag alongside Completed for all three pictured Coorg estates. Star Woods Estate, Star Coffee County and Star Misty Acres now have availability `sold-out`, with `availabilitySource: user-confirmed`. This is a user confirmation, not an availability statement extracted from Star Infra Developers. Arkha Sanctuary availability remains null.
