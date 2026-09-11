// Real elevation for the Kodagu (Coorg) stretch of the Western Ghats, baked from
// Tilezen Terrain Tiles (SRTM-derived, zoom 10, ≈150 m) and average-pooled to
// ≈300 m cells. Row 0 is the northern edge and column 0 the western edge; each
// value is metres above sea level as a little-endian Uint16.
// Indicative landscape context only: not a survey, boundary or property map.
export const kodaguTerrain = {
  src: "/data/kodagu-elevation-240x192.bin",
  reliefImage: "/images/coorg/terrain/kodagu-relief.webp",
  cols: 240,
  rows: 192,
  minMetres: 18,
  maxMetres: 1679,
  bounds: { west: 75.3442, east: 76.0034, north: 12.643, south: 12.1279 },
  widthKm: 71.7,
  heightKm: 57,
  cellMetres: 299,
  source: "SRTM via Tilezen Terrain Tiles",
} as const;
