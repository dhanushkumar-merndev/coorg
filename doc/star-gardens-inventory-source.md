# Star Gardens interactive inventory: source record

The inventory geometry and measurements come from the supplied **Star Gardens - Plots Only Master Plan - Revision 04 - Checked Measurements**, dated **10 October 2026**. An unchanged copy is served at `/documents/star-gardens-master-plan.pdf`. The source describes a proposed concept layout at Kedakal, with 46 farmhouse plots and a proposed 20 ft CC road network. It expressly states that it is **not a construction or approval drawing**.

## Provenance and schema

- Page 1: all 46 plot outlines, plot identifiers, areas, length spans, calculated equivalent average widths, overall boundary and connected road polygon.
- Pages 2-3: per-plot schedule, including road frontage.
- Pages 4-11: numbered side-length schedules and individual plot sketches.
- `src/data/star-gardens-plan.json`: extracted geometry and source-labelled measurements.
- `scripts/extract-star-gardens-plan.py`: repeatable vector/text extraction and validation. Uses PyMuPDF and Shapely; no raster tracing or invented polygons.

The JSON has `viewBox: [minX, minY, width, height]`, `plots`, `boundary`, `roads` and `metadata`. Coordinates remain PDF page units: x increases right, y increases down, and north is up. They are **not cadastral coordinates, latitude/longitude, metres or feet**. The viewBox is tightly cropped to the boundary with 5% padding on each side. `roads` contains one connected polygon.

Each plot contains its original `P01`-`P46` identifier, source `areaSqFt`, source `spanFt`, calculated `averageWidthFt`, source `roadFrontageFt`, polygon `points`, an interior `centroid`, `sideLengthsFt`, source detail page and geometry notes. `salesStatus` and `price` remain `null`. The metadata likewise leaves overall availability, pricing and approval status `null`.

`sideLengthsFt` follows the numbered order on each **source detail sketch**. It does not index the exported polygon edges. The equivalent average width is area divided by span; it is not a measured side or an inferred rectangular plot width. Road frontage is measured along the proposed corridor, not gate-opening width.

## Source discrepancies retained

The PDF summary states **465,524 sq ft total land**, **410,564 sq ft private plots**, and **54,960 sq ft roads**. Adding the 46 individually displayed whole-square-foot plot labels gives **410,566 sq ft**, a 2 sq ft rounding discrepancy. The JSON preserves the individual labels and the printed summary separately, with no arbitrary adjustment to a plot.

P39, P42 and P44 contain out-and-back, effectively zero-area boundary spurs in their source vector paths. These spurs are also visible in the individual sketches. Finite PDF coordinate precision turns them into minute self-intersections. The interactive polygons omit those spurs so triangulation and hit testing use valid filled land areas. Their printed side-length schedules remain unaltered, including the source spur segments; these should not be presented as an independently surveyed perimeter.

The extractor uses `make_valid`, retains the main polygon and removes redundant collinear vertices within **0.001 PDF page units**. The discarded artifact area per repaired plot is less than **0.001 square PDF units**. No substantive land area is moved between plots or roads. All other 43 plots' geometric side lengths match their source schedules within 0.006 ft after accounting for printed rounding and PDF scale.

## Verification

The extraction asserts:

1. The input is the expected 11-page Revision 04 document.
2. Exactly 46 filled plot paths, one boundary and one connected road polygon are present.
3. Each plot contains exactly one original `Pxx` label; all identifiers P01-P46 are present once. Matching uses geometric point containment rather than the PDF drawing order.
4. The page 1 area/span/average-width labels exactly match the pages 2-3 schedule.
5. Every plot has a populated side-length schedule on pages 4-11.
6. Every exported polygon is valid, has no holes and has an interior centroid.
7. The only source polygons requiring spur repair are P39, P42 and P44.
8. Road/plot overlap, plot/plot overlap and combined coverage differences stay below 0.1 square PDF units, accounting for finite PDF coordinate precision.

The extracted plot-and-road rendering was visually compared with page 1. The source detail sheet for P37-P42 was also rendered and inspected to confirm the spur issue. The untouched public PDF is byte-identical to the supplied file, with its SHA-256 recorded in JSON metadata.

To regenerate without adding Python packages to the application:

```bash
python3 -m venv /tmp/star-plan-venv
/tmp/star-plan-venv/bin/pip install pymupdf shapely
/tmp/star-plan-venv/bin/python scripts/extract-star-gardens-plan.py
```

Use `--source PATH` or `--output PATH` to override the source copy or generated JSON location. The extractor is deliberately specific to this revision and fails if expected source structure changes.

## Publication limits

These are source-plan measurements, not a fresh survey or verification of sanctioned/legal status. The source says its boundary was calibrated to a survey area statement in local coordinates, not the original cadastral frame. Terrain gradients, road levels, cut/fill, retaining walls, drainage and buildable farmhouse pads remain unverified. Additional drains, verges or junction widening may change allocations beyond the present 20 ft concept corridor. The document calls for verification on site before setting out. It supplies no sale prices or availability statuses.
