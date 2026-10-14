#!/usr/bin/env python3
"""Extract the supplied Revision 04 PDF; never infer survey or sales facts.

Requires Python 3.10+, PyMuPDF and Shapely. See the source note in doc/.
The assertions deliberately reject a different drawing/revision rather than
silently assigning its geometry to the present plot records.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from pathlib import Path

import pymupdf
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union
from shapely.validation import make_valid


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_IDS = {f"P{number:02d}" for number in range(1, 47)}
PLOT_STROKE = (97, 115, 93)
ROAD_FILL = (169, 174, 177)
BOUNDARY_FILL = (233, 238, 225)
GEOMETRY_TOLERANCE = 0.001  # PDF page units, not feet or survey precision.


def rgb(color):
    return tuple(round(value * 255) for value in color) if color else None


def spans(page):
    return [
        span
        for block in page.get_text("dict")["blocks"]
        for line in block.get("lines", [])
        for span in line["spans"]
    ]


def path_points(drawing):
    """Read an explicitly closed straight-edge PDF path without tracing pixels."""
    items = drawing["items"]
    if len(items) == 1 and items[0][0] == "re":
        rect = items[0][1]
        return [tuple(point) for point in (rect.tl, rect.tr, rect.br, rect.bl)]
    assert all(item[0] == "l" for item in items), "Unexpected curved polygon"
    for index, item in enumerate(items):
        assert math.dist(item[2], items[(index + 1) % len(items)][1]) < 0.001
    return [tuple(item[1]) for item in items]


def rounded_points(points):
    return [[round(x, 5), round(y, 5)] for x, y in points]


def polygon_parts(geometry):
    if geometry.geom_type == "Polygon":
        return [geometry]
    return [part for item in geometry.geoms for part in polygon_parts(item)]


def usable_polygon(points):
    """Remove zero-area PDF spurs and redundant collinear vertices only."""
    original = Polygon(points)
    repaired = not original.is_valid
    parts = polygon_parts(make_valid(original)) if repaired else [original]
    polygon = max(parts, key=lambda item: item.area)
    discarded_area = sum(part.area for part in parts if part is not polygon)
    assert discarded_area < 0.001, "Repair would discard a meaningful land area"
    polygon = polygon.simplify(GEOMETRY_TOLERANCE, preserve_topology=True)
    assert polygon.is_valid and not polygon.interiors
    assert abs(polygon.area - original.area) < 0.02
    return polygon, repaired


def extract_side_lengths(document):
    result = {}
    for page_index in range(3, len(document)):
        page = document[page_index]
        page_spans = spans(page)
        headings = [
            span for span in page_spans if re.match(r"P\d{2}\s+\|", span["text"])
        ]
        for heading in headings:
            x, y, _, title_bottom = heading["bbox"]
            next_row = min(
                [
                    other["bbox"][1]
                    for other in headings
                    if abs(other["bbox"][0] - x) < 1 and other["bbox"][1] > y + 1
                ]
                + [1135]
            )
            right = page.rect.width / 2 if x < page.rect.width / 2 else page.rect.width
            numbers = [
                span
                for span in page_spans
                if re.fullmatch(r"\d+\.\d+", span["text"])
                and x < span["bbox"][0] < right
                and title_bottom < span["bbox"][1] < next_row
            ]
            plot_id = heading["text"][:3]
            assert plot_id not in result
            result[plot_id] = {
                "lengths": [
                    float(span["text"])
                    for span in sorted(numbers, key=lambda item: item["bbox"][1])
                ],
                "page": page_index + 1,
            }
            assert 4 <= len(result[plot_id]["lengths"]) <= 12
    assert set(result) == EXPECTED_IDS
    return result


def extract_schedule(document):
    pattern = re.compile(
        r"(P\d{2})\n(\d+\.\d+)\n(\d+\.\d+)\n([\d,]+)\n(\d+\.\d+)\n"
    )
    result = {}
    for page in [document[1], document[2]]:
        for plot_id, span, width, area, frontage in pattern.findall(page.get_text()):
            assert plot_id not in result
            result[plot_id] = {
                "spanFt": float(span),
                "averageWidthFt": float(width),
                "areaSqFt": int(area.replace(",", "")),
                "roadFrontageFt": float(frontage),
            }
    assert set(result) == EXPECTED_IDS
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source", type=Path, default=ROOT / "public/documents/star-gardens-master-plan.pdf"
    )
    parser.add_argument(
        "--output", type=Path, default=ROOT / "src/data/star-gardens-plan.json"
    )
    args = parser.parse_args()
    document = pymupdf.open(args.source)
    assert len(document) == 11
    page = document[0]
    page_text = page.get_text()
    assert "REVISION 04 / 10 OCT 2026" in page_text
    assert "Not a construction or approval drawing." in page_text

    drawings = page.get_drawings()
    plot_drawings = [drawing for drawing in drawings if rgb(drawing["color"]) == PLOT_STROKE]
    boundary_drawings = [drawing for drawing in drawings if rgb(drawing["fill"]) == BOUNDARY_FILL]
    road_drawings = [drawing for drawing in drawings if rgb(drawing["fill"]) == ROAD_FILL]
    assert len(plot_drawings) == 46 and len(boundary_drawings) == 1 and len(road_drawings) == 1
    boundary = Polygon(path_points(boundary_drawings[0]))
    road = Polygon(path_points(road_drawings[0]))
    assert boundary.is_valid and road.is_valid and not road.interiors

    labelled_spans = [span for span in spans(page) if re.fullmatch(r"P\d{2}", span["text"])]
    assert len(labelled_spans) == 46
    schedule = extract_schedule(document)
    side_lengths = extract_side_lengths(document)
    hero_rows = {
        plot_id: (float(span), float(width), int(area.replace(",", "")))
        for plot_id, span, width, area in re.findall(
            r"(P\d{2})\nSpan (\d+\.\d+) ft\nAvg W (\d+\.\d+) ft\n([\d,]+) sq ft",
            page_text,
        )
    }
    assert set(hero_rows) == EXPECTED_IDS

    plots = []
    polygons = []
    repaired_ids = []
    for drawing in plot_drawings:
        source_points = path_points(drawing)
        polygon, repaired = usable_polygon(source_points)
        contained = []
        for label in labelled_spans:
            x0, y0, x1, y1 = label["bbox"]
            if polygon.contains(Point((x0 + x1) / 2, (y0 + y1) / 2)):
                contained.append(label)
        assert len(contained) == 1, "Plot label must match by geometric containment"
        plot_id = contained[0]["text"]
        record = schedule[plot_id]
        assert hero_rows[plot_id] == (record["spanFt"], record["averageWidthFt"], record["areaSqFt"])
        assert polygon.contains(polygon.centroid), "Centroid is not a safe label location"
        note = []
        if repaired:
            repaired_ids.append(plot_id)
            note.append(
                "Zero-area out-and-back source boundary segments removed for rendering. "
                "Printed side lengths are retained in source sketch order, not polygon-edge order."
            )
        plots.append(
            {
                "id": plot_id,
                "label": plot_id,
                **record,
                "points": rounded_points(list(polygon.exterior.coords)[:-1]),
                "centroid": [round(polygon.centroid.x, 5), round(polygon.centroid.y, 5)],
                "sideLengthsFt": side_lengths[plot_id]["lengths"],
                "detailSourcePage": side_lengths[plot_id]["page"],
                "salesStatus": None,
                "price": None,
                "geometryNotes": note,
            }
        )
        polygons.append(polygon)

    plots.sort(key=lambda plot: plot["id"])
    assert {plot["id"] for plot in plots} == EXPECTED_IDS
    assert repaired_ids == ["P39", "P42", "P44"]
    # The PDF's finite coordinate precision can create microscopic shared-edge slivers.
    overlap_area = sum(polygon.intersection(road).area for polygon in polygons)
    coverage_error = boundary.symmetric_difference(unary_union(polygons + [road])).area
    plot_overlap = sum(polygon.area for polygon in polygons) - unary_union(polygons).area
    assert max(overlap_area, coverage_error, plot_overlap) < 0.1
    assert all(polygon.difference(boundary).area < 0.02 for polygon in polygons)
    labelled_total = sum(plot["areaSqFt"] for plot in plots)
    assert labelled_total == 410566

    min_x, min_y, max_x, max_y = boundary.bounds
    width, height = max_x - min_x, max_y - min_y
    result = {
        "viewBox": [
            round(min_x - width * 0.05, 5),
            round(min_y - height * 0.05, 5),
            round(width * 1.1, 5),
            round(height * 1.1, 5),
        ],
        "plots": plots,
        "boundary": rounded_points(list(boundary.exterior.coords)[:-1]),
        "roads": [{"points": rounded_points(list(road.exterior.coords)[:-1])}],
        "metadata": {
            "project": "Star Gardens",
            "locationLabel": "Kedakal",
            "sourceTitle": "Star Gardens - Plots Only Master Plan - Revision 04 - Checked Measurements",
            "sourceFile": "/documents/star-gardens-master-plan.pdf",
            "sourceSha256": hashlib.sha256(args.source.read_bytes()).hexdigest(),
            "sourceRevision": "04",
            "sourceDate": "2026-10-10",
            "sourcePageCount": len(document),
            "geometrySourcePage": 1,
            "scheduleSourcePages": [2, 3],
            "detailSourcePages": list(range(4, 12)),
            "sourceStatus": "concept-proposal",
            "coordinateSystem": "PDF page units, x right, y down; north is up; not cadastral coordinates",
            "pageSize": [round(page.rect.width, 5), round(page.rect.height, 5)],
            "plotCount": 46,
            "summaryLandAreaSqFt": 465524,
            "summaryPlotAreaSqFt": 410564,
            "summaryRoadAreaSqFt": 54960,
            "sumOfDisplayedPlotAreasSqFt": labelled_total,
            "proposedRoadWidthFt": 20,
            "proposedRoadWidthMetres": 6.096,
            "entryLabel": "Entry via Part I",
            "availability": None,
            "pricing": None,
            "approvalStatus": None,
            "sideLengthOrder": "Numbered side order on the individual source detail sketch; not points array order",
            "geometryRepairedPlotIds": repaired_ids,
            "cautions": [
                "Proposed concept layout; not a construction or approval drawing.",
                "Areas and dimensions are transcribed from the supplied plan, not independently surveyed.",
                "Equivalent average width is area divided by span, not a measured boundary side.",
                "Source per-plot rounded area labels total 410,566 sq ft; its summary states 410,564 sq ft. Both are preserved.",
                "Source geometry is calibrated to a survey area statement and uses local coordinates, not the original cadastral frame.",
                "Road levels, terrain gradients, retaining walls, cut/fill, drainage and buildable pads remain unverified.",
                "Proposed 20 ft road corridors exclude additional drains, verges or junction widening that may change allocations.",
                "Road frontage is measured along the corridor, not gate-opening width.",
                "P39, P42 and P44 contain zero-area source boundary spurs removed from the interactive geometry; source side measurements are retained.",
                "Verify the concept against an approved survey and on site before setting out; sales availability and prices are not supplied.",
            ],
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2) + "\n")
    print(
        json.dumps(
            {
                "output": str(args.output),
                "plots": len(plots),
                "uniqueContainedLabels": len(plots),
                "repairedSourceSpurs": repaired_ids,
                "plotAreaLabelSumSqFt": labelled_total,
                "summaryPlotAreaSqFt": result["metadata"]["summaryPlotAreaSqFt"],
                "coverageDifferencePdfSquareUnits": round(coverage_error, 6),
                "roadPlotOverlapPdfSquareUnits": round(overlap_area, 6),
                "plotOverlapPdfSquareUnits": round(plot_overlap, 6),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
