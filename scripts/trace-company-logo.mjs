import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
const { data, info } = await sharp('public/logo.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
// Trace the supplied mark itself, keeping its silhouette and red brush accent.
// SVG edges render cleanly at header size and at high device pixel ratios.
function trace(red) {
  const { width: w, height: h } = info;
  const filled = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    const i = (y * w + x) * 4;
    return data[i + 3] > 100 && (red ? data[i] > data[i + 1] * 1.6 : data[i] <= data[i + 1] * 1.6);
  };
  const edges = new Map();
  const put = (a, b) => edges.set(a.join(','), b);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (filled(x, y)) {
    if (!filled(x, y - 1)) put([x, y], [x + 1, y]);
    if (!filled(x + 1, y)) put([x + 1, y], [x + 1, y + 1]);
    if (!filled(x, y + 1)) put([x + 1, y + 1], [x, y + 1]);
    if (!filled(x - 1, y)) put([x, y + 1], [x, y]);
  }
  const paths = [];
  while (edges.size) {
    const start = edges.keys().next().value;
    let key = start;
    const points = [];
    do {
      points.push(key.split(',').map(Number));
      const next = edges.get(key);
      edges.delete(key);
      if (!next) break;
      key = next.join(',');
    } while (key !== start && points.length < w * h);
    if (points.length < 25) continue; // source specks vanish below one header pixel
    const simple = simplify([...points, points[0]], .8);
    paths.push(`M${simple.map(p => p.join(',')).join('L')}Z`);
  }
  return paths.join('');
}
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0], [bx, by] = points.at(-1);
  const dx = bx - ax, dy = by - ay, length = dx * dx + dy * dy;
  let max = 0, split = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const t = length ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / length)) : 0;
    const distance = Math.hypot(x - ax - t * dx, y - ay - t * dy);
    if (distance > max) { max = distance; split = i; }
  }
  return max > tolerance ? [...simplify(points.slice(0, split + 1), tolerance).slice(0, -1), ...simplify(points.slice(split), tolerance)] : [points[0], points.at(-1)];
}
const mark = trace(false), accent = trace(true);
for (const [file, ink] of [['brand-logo.svg', '#ffffff'], ['brand-logo-on-light.svg', '#173c32']]) {
  await writeFile(`public/${file}`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${info.width} ${info.height}" fill-rule="evenodd"><path fill="${ink}" d="${mark}"/><path fill="#e00000" d="${accent}"/></svg>\n`);
}
console.log('Traced the original company mark to two transparent SVG variants.');
