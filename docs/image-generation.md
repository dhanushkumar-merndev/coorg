# Conceptual image provenance

Generated on 2026-09-10 for the Land in Coorg implementation using the **built-in image_gen tool** in generate mode. Five separate prompts/calls were used, with no input/reference images and no CLI/API fallback.

All five images are AI-generated conceptual editorial artwork. None is a photograph of a listed property. Category cards and detail views must visibly disclose “Conceptual imagery”. The hero must be presented as Coorg-inspired conceptual atmosphere. No image establishes any listing's location, condition, acreage, crop, building, amenity, legal status or approval.

Art direction follows `doc/DOC.md` sections 3–5. Supplied files and confidence rules remain governed by `doc/ASSET_MANIFEST.csv`; conceptual art is not added to a listing's supplied-media gallery.

## Production outputs

The original PNG outputs remain at their generated-image paths below. Production WebP derivatives were made with the existing Sharp dependency, quality 82, effort 6, aspect ratio preserved and no enlargement. Hero keeps source dimensions; category width is reduced from 1586 to 1440 pixels. No aesthetic edits or compositing were applied during optimization.

| Asset | Production dimensions | File bytes |
| --- | --- | --- |
| `public/images/coorg/conceptual/hero-mist-valley.webp` | 1672 × 941 | 88016 |
| `public/images/coorg/conceptual/plantation-estates.webp` | 1440 × 901 | 229014 |
| `public/images/coorg/conceptual/private-hill-retreats.webp` | 1440 × 901 | 267726 |
| `public/images/coorg/conceptual/curated-estate-plots.webp` | 1440 × 901 | 275848 |
| `public/images/coorg/conceptual/forest-mountain-land.webp` | 1440 × 901 | 309332 |

## Inspection

All five outputs were visually reviewed. They contain no people, overlaid text, logos or visible watermarks, and have a cohesive natural green palette with mist and soft dawn light.

- **hero-mist-valley:** Broad layered valley and dark foreground forest with generous grey-gold dawn sky. Use as conceptual atmosphere/static fallback beneath the procedural scene.
- **plantation-estates:** Wet winding road, coffee foliage and avocado foreground, misty hills and warm dawn. Road remains legible in a centered portrait crop.
- **private-hill-retreats:** Fictional stone/timber retreat with warm interior, reflecting pool and surrounding forest. House and pool remain legible in a centered portrait crop.
- **curated-estate-plots:** Fictional gently winding estate roads, lawn clearings, trees and small water feature. Has no labels or measurements; must never be described as a legal or approved plan.
- **forest-mountain-land:** Open grassy ridgeline framed by trees, with layered forest valley and mist. Center meadow and valley remain legible in a portrait crop.

## Exact prompt set and source mapping

### hero-mist-valley

- Production file: `public/images/coorg/conceptual/hero-mist-valley.webp`
- Original built-in output: `/home/dhanush/.codex/generated_images/01a08c79-2370-7200-b96a-7c82bf36325c/exec-734c59e5-261f-4431-bcd6-7899116d4fea.png`
- Association: conceptual; no identified property.

```text
Use case: photorealistic-natural. Asset type: cinematic website atmospheric hero backdrop and static fallback, wide 16:9 landscape. Create a conceptual Coorg-inspired dawn valley in the Western Ghats of Karnataka. Four layers of soft rounded forest-covered mountain ridges recede into pale low cloud and rain mist, with dark evergreen forest canopy forming the bottom foreground. Broad serene central valley, nuanced natural foliage, fine atmospheric depth; distant ridges are low-contrast sage green, nearest forest is deep charcoal green. Composition: upper half includes generous hazy open sky and distant soft silhouettes for later oversized white HTML typography; darkest textured foliage occupies the bottom quarter, with wisps of mist between the mid-ground slopes. Photorealistic premium natural editorial photography, restrained muted green and warm grey palette, soft dawn light, quiet expansive mood. No buildings, no roads, no people, no birds, no text, no logo, no borders, no watermark. This is original conceptual landscape art, not a depiction of an identified property.
```

### plantation-estates

- Production file: `public/images/coorg/conceptual/plantation-estates.webp`
- Original built-in output: `/home/dhanush/.codex/generated_images/01a08c79-2370-7200-b96a-7c82bf36325c/exec-a5e0f340-f27e-4235-8b61-839f7366877f.png`
- Association: conceptual; no identified property.

```text
Use case: photorealistic-natural. Asset type: conceptual category image for a premium Coorg real-estate website; 16:10 landscape. Cinematic high-altitude Coorg plantation in Karnataka, lush avocado and coffee estate across rolling hills, narrow wet estate road disappearing into soft morning fog, deep emerald foliage, monsoon moisture in the air, layered Western Ghats mountains in the distance, premium natural editorial photography, realistic but poetic, subtle warm dawn highlights, extremely detailed foliage, atmospheric depth, restrained luxury real-estate campaign aesthetic. Keep the winding road and rich canopy readable in a centered portrait crop as well as the wide composition. No people, no text, no logos, no border, no watermark. This is fictional conceptual category art; it must not depict or claim to depict any specific actual listed estate.
```

### private-hill-retreats

- Production file: `public/images/coorg/conceptual/private-hill-retreats.webp`
- Original built-in output: `/home/dhanush/.codex/generated_images/01a08c79-2370-7200-b96a-7c82bf36325c/exec-de5198ee-31dd-4e04-b342-7dfbb011695e.png`
- Association: conceptual; no identified property.

```text
Use case: photorealistic-natural. Asset type: conceptual category image for a premium Coorg real-estate website; cinematic 16:10 landscape. A refined contemporary private estate retreat in Coorg hidden among dense tropical mountain forest, dark stone and warm timber architecture, warm interior glow, subtle infinity pool reflection, wet monsoon surfaces, low drifting mist between trees, layered hills beyond, understated luxury, realistic architectural photography, not futuristic, premium resort editorial lighting. Keep the intimate house and subtle pool reflection centered so both survive a portrait crop. Natural emerald forest, matte basalt, quiet warm timber, cloudy dawn. No people, no text, no logos, no border, no watermark. Fictional architectural concept for category storytelling only; this is not an actual listing or an existing property's photograph.
```

### curated-estate-plots

- Production file: `public/images/coorg/conceptual/curated-estate-plots.webp`
- Original built-in output: `/home/dhanush/.codex/generated_images/01a08c79-2370-7200-b96a-7c82bf36325c/exec-5b199fc5-e647-451f-8c1d-32fa0859de2a.png`
- Association: conceptual; no identified property.

```text
Use case: stylized-concept. Asset type: conceptual category image for a premium Coorg real-estate website; 16:10 landscape. Premium plotted estate integrated into the rolling green landscape of Coorg, elegant winding internal roads, generous green buffers, native trees, small landscaped open spaces and water feature, seen from an elevated oblique viewpoint, misty Western Ghats beyond, realistic masterplan visualization blended with natural photography, refined and believable, muted natural colors, high-end property campaign aesthetic. Use a naturalistic landscape rendering: softly delineated open grassy spaces among canopy, understated roads gracefully following the hills. Keep a winding road through green parcels centered to read in a portrait crop. No text, no labels, no site numbers, no measurements, no logos, no border, no watermark. This is a fictional conceptual landscape, not a legal plan or depiction of any specific approved or listed development.
```

### forest-mountain-land

- Production file: `public/images/coorg/conceptual/forest-mountain-land.webp`
- Original built-in output: `/home/dhanush/.codex/generated_images/01a08c79-2370-7200-b96a-7c82bf36325c/exec-7e492fca-8e93-4e11-9445-3a0580571436.png`
- Association: conceptual; no identified property.

```text
Use case: photorealistic-natural. Asset type: conceptual category image for a premium Coorg real-estate website; 16:10 landscape. Untouched forest-edge land in Coorg, dramatic layered green mountain ridges, tall native trees framing an open meadow and valley, clouds moving low through the hills, post-rain atmosphere, rich natural textures, cinematic realistic landscape photography, quiet and expansive, premium editorial color grading. The visual focus is an open grassy ridgeline in the center foreground and a green mist-filled valley beyond, with softly layered rounded Western Ghats mountains. Deep natural forest green with delicate sage mist and subtle warm highlights. Compose the central ridgeline to remain legible when cropped to a portrait card. No buildings, no people, no text, no logos, no border, no watermark. Original conceptual category art, not an identified property's photograph.
```



## Sixth asset — Countryside Homes (requested fifth carousel card)

Built-in `image_gen` mode. Original: `/home/dhanush/.codex/generated_images/01a08c77-5839-7950-8c87-4bf0542456cf/exec-617c167b-0633-43b3-8c52-cafabd110624.png`.
Production: `public/images/coorg/conceptual/countryside-homes.webp`, 1440 × 901, 367076 bytes. Visually inspected; conceptual tiled-roof home among coffee plants, never an actual listing.

Prompt:
> Use case: photorealistic-natural. Asset type: conceptual category editorial photograph for Land in Coorg website, matching quiet premium natural Coorg landscape imagery. Subject: Countryside Homes. A small beautiful traditional Kodagu countryside home with terracotta pitched roof, lime plaster walls and a shaded timber veranda, nestled among lush coffee shrubs and native trees in rolling Coorg hills, Karnataka, Western Ghats. Narrow wet stone path curving to the house, soft morning mist through surrounding trees, gentle warm light, lived-in understated architecture, no people. Realistic natural architectural editorial photography, muted emerald green, warm stone, earthy terracotta, restrained grading, no HDR. Landscape 16:10 composition with the home centered and clear enough to survive a portrait crop. No swimming pool, no European architecture, no text, no logos, no watermarks. This is a conceptual image of a possible lifestyle, not an actual property listing.
