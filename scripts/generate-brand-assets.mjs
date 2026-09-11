import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve('next/package.json'));
const sharp = nextRequire('sharp');

// Keep logo.png untouched. Give its white strokes forest ink only in variants
// displayed on light backgrounds; preserve the source's red accent and alpha.
const original = await readFile('public/logo.png');
const { data, info } = await sharp(original).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  if (data[i] > 210 && data[i + 1] > 210 && data[i + 2] > 210) {
    data[i] = 23; data[i + 1] = 60; data[i + 2] = 50;
  }
}
const darkLogo = await sharp(data, { raw: info }).png().toBuffer();
await writeFile('public/logo-on-light.png', darkLogo);
const iconMark = await sharp(original).resize(428, 428).png().toBuffer();
const circle = Buffer.from('<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><circle cx="256" cy="256" r="252" fill="#080808"/></svg>');
const master = await sharp(circle).composite([{ input: iconMark, left: 42, top: 42 }]).png().toBuffer();
const outputs = [
  ['favicon-16x16.png',16], ['favicon-32x32.png',32], ['favicon-48x48.png',48],
  ['apple-touch-icon.png',180], ['android-chrome-192x192.png',192], ['android-chrome-512x512.png',512],
];
for(const [name,size] of outputs) await sharp(master).resize(size,size).png().toFile(`public/${name}`);
// ICO directory with PNG frames, supported by modern browsers and Windows.
const frames = await Promise.all([16,32,48].map(size=>sharp(master).resize(size,size).png().toBuffer()));
const directory = Buffer.alloc(6 + 16 * frames.length);
directory.writeUInt16LE(1,2); directory.writeUInt16LE(frames.length,4);
let offset = directory.length;
frames.forEach((frame,index)=>{
  const base=6+index*16; const size=[16,32,48][index];
  directory[base]=size; directory[base+1]=size;
  directory.writeUInt16LE(1,base+4); directory.writeUInt16LE(32,base+6);
  directory.writeUInt32LE(frame.length,base+8); directory.writeUInt32LE(offset,base+12); offset+=frame.length;
});
await writeFile('public/favicon.ico',Buffer.concat([directory,...frames]));
// Satori decodes JPEG for OG cards; the original conceptual WebP stays intact.
await sharp('public/images/coorg/conceptual/hero-mist-valley.webp').resize(1200,630,{fit:'cover'}).jpeg({quality:88}).toFile('public/images/coorg/hero/share-mist-valley.jpg');
console.log('Generated transparent light-background logo, six circular PNG icons, multi-size ICO, and OG landscape JPEG.');
