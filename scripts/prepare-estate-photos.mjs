import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const root = 'doc/Land_in_Coorg_Website_Source_Pack/03_ASSETS';
const photos = [
  ['02_SLN_PLANTATIONS_CONFIRMED/sln_01_lychee_from_farm.jpg', 'sln/lychee'],
  ['02_SLN_PLANTATIONS_CONFIRMED/sln_03_avocado_from_farm_a.jpg', 'sln/avocado-a'],
  ['02_SLN_PLANTATIONS_CONFIRMED/sln_04_avocado_from_farm_b.jpg', 'sln/avocado-b'],
  ['01_VILLA_26_CENT_PROBABLE/villa_05_driveway.jpg', 'villa/driveway'],
  ['01_VILLA_26_CENT_PROBABLE/villa_01_gate.jpg', 'villa/gate'],
  ['01_VILLA_26_CENT_PROBABLE/villa_03_pool_vertical.jpg', 'villa/pool-vertical'],
  ['01_VILLA_26_CENT_PROBABLE/villa_04_side_path.jpg', 'villa/side-path'],
  ['04_FOREST_LAND_GENERIC_TBC/forest_03_internal_road_dense.jpg', 'generic/forest-dense'],
  ['04_FOREST_LAND_GENERIC_TBC/forest_05_landscaped_pond_road.jpg', 'generic/pond-road'],
  ['04_FOREST_LAND_GENERIC_TBC/forest_07_waterfall.jpg', 'generic/waterfall'],
];
for (const [source, target] of photos) {
  const dest = `public/images/coorg/supplied/${target}.webp`;
  await mkdir(dest.slice(0, dest.lastIndexOf('/')), { recursive: true });
  await sharp(`${root}/${source}`).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 88 }).toFile(dest);
}
console.log(`Prepared ${photos.length} supplied photos; no upscaling or property reassignment.`);
