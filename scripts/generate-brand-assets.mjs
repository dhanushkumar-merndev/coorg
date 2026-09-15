import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const potrace = require('potrace');
const nextReq = createRequire(require.resolve('next/package.json'));
const sharp = nextReq('sharp');
const { chromium } = require('@playwright/test');

const ARTIFACTS_DIR = '/home/dhanushkr/.gemini/antigravity-ide/brain/e98aeea8-b635-4f86-8639-fb4d310f7b6c';
const BRAND_DIR = path.resolve('public/images/brand');

if (!fs.existsSync(BRAND_DIR)) {
  fs.mkdirSync(BRAND_DIR, { recursive: true });
}

console.log('--- 1. Vectorizing mark with smooth cubic Bezier curves ---');
const { data, info } = await sharp('public/logo.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width, h = info.height;

const starBuf = Buffer.alloc(w * h);
const redBuf = Buffer.alloc(w * h);

for (let i = 0; i < w * h; i++) {
  const r = data[i * 4];
  const g = data[i * 4 + 1];
  const b = data[i * 4 + 2];
  const a = data[i * 4 + 3];

  if (a > 60) {
    if (r > g * 1.5 && r > b * 1.5) {
      redBuf[i] = 0; // foreground
      starBuf[i] = 255;
    } else {
      starBuf[i] = 0;
      redBuf[i] = 255;
    }
  } else {
    starBuf[i] = 255;
    redBuf[i] = 255;
  }
}

const starPng = await sharp(starBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
const redPng = await sharp(redBuf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();

const trace = (buffer) => new Promise((resolve, reject) => {
  potrace.trace(buffer, { optTolerance: 0.4, optCurve: true, alphaMax: 1.0 }, (err, svg) => {
    if (err) reject(err); else resolve(svg);
  });
});

const starSvg = await trace(starPng);
const redSvg = await trace(redPng);

const starPath = starSvg.match(/<path d="([^"]+)"/)[1];
const redPath = redSvg.match(/<path d="([^"]+)"/)[1];

// Update public/brand-logo.svg and public/brand-logo-on-light.svg
const smoothWhiteMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill-rule="evenodd"><path fill="#ffffff" d="${starPath}"/><path fill="#e0142c" d="${redPath}"/></svg>\n`;
const smoothDarkMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill-rule="evenodd"><path fill="#173c32" d="${starPath}"/><path fill="#e0142c" d="${redPath}"/></svg>\n`;

fs.writeFileSync('public/brand-logo.svg', smoothWhiteMarkSvg);
fs.writeFileSync('public/brand-logo-on-light.svg', smoothDarkMarkSvg);
console.log('✓ Updated public/brand-logo.svg and public/brand-logo-on-light.svg with smooth Bezier vectors.');

console.log('--- 2. Launching Chromium for Ultra-HD Rendering ---');
const browser = await chromium.launch();
const page = await browser.newPage({ 
  viewport: { width: 2800, height: 1200 },
  deviceScaleFactor: 2 
});

const lockupTemplate = ({ markWhite, markAccent, titleColor, subtitleColor, subtitleOpacity }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      margin: 0;
      padding: 0;
      display: inline-flex;
      background: transparent;
    }
    .brand-lockup {
      display: inline-flex;
      align-items: center;
      gap: 112px;
      padding: 40px;
    }
    .logo-icon {
      width: 448px;
      height: 448px;
      flex-shrink: 0;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      white-space: nowrap;
    }
    .brand-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 176px;
      line-height: 1.05;
      letter-spacing: 0.06em;
      color: ${titleColor};
      font-weight: 400;
      text-transform: uppercase;
    }
    .brand-tagline {
      font-family: 'Manrope', sans-serif;
      font-size: 80px;
      font-weight: 600;
      letter-spacing: 0.10em;
      color: ${subtitleColor};
      opacity: ${subtitleOpacity || 0.95};
      margin-top: 32px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="brand-lockup" id="brand">
    <svg class="logo-icon" viewBox="0 0 512 512" fill-rule="evenodd">
      <path fill="${markWhite}" d="${starPath}"/>
      <path fill="${markAccent}" d="${redPath}"/>
    </svg>
    <div class="brand-text">
      <div class="brand-title">LAND IN COORG</div>
      <div class="brand-tagline">A DIFFERENT KIND OF BELONGING</div>
    </div>
  </div>
</body>
</html>
`;

// Render 1: White on Transparent
await page.setContent(lockupTemplate({
  markWhite: '#ffffff',
  markAccent: '#e0142c',
  titleColor: '#ffffff',
  subtitleColor: '#ffffff',
  subtitleOpacity: 0.96
}));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);
const brandTarget1 = page.locator('#brand');
const whiteLockupBuffer = await brandTarget1.screenshot({ omitBackground: true });

const whiteLogoPath = path.join(BRAND_DIR, 'land-in-coorg-logo-white-transparent.png');
fs.writeFileSync(whiteLogoPath, whiteLockupBuffer);
fs.writeFileSync('/tmp/land-in-coorg-logo.png', whiteLockupBuffer);
fs.writeFileSync(path.join(ARTIFACTS_DIR, 'land-in-coorg-logo-white-transparent.png'), whiteLockupBuffer);
console.log('✓ Rendered Ultra-HD White Transparent Logo (4086x896)');

// Render 2: Dark Ink on Transparent (#173c32)
await page.setContent(lockupTemplate({
  markWhite: '#173c32',
  markAccent: '#e0142c',
  titleColor: '#173c32',
  subtitleColor: '#173c32',
  subtitleOpacity: 0.92
}));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);
const brandTarget2 = page.locator('#brand');
const darkLockupBuffer = await brandTarget2.screenshot({ omitBackground: true });

const darkLogoPath = path.join(BRAND_DIR, 'land-in-coorg-logo-dark-transparent.png');
fs.writeFileSync(darkLogoPath, darkLockupBuffer);
fs.writeFileSync(path.join(ARTIFACTS_DIR, 'land-in-coorg-logo-dark-transparent.png'), darkLockupBuffer);
console.log('✓ Rendered Ultra-HD Dark Transparent Logo (4086x896)');

// Render 3: Standalone 4K Mark (White)
const markPage = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 2 });
await markPage.setContent(`
  <body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;height:100vh;">
    <div id="mark" style="width:1024px;height:1024px;">
      ${smoothWhiteMarkSvg}
    </div>
  </body>
`);
const markWhiteBuf = await markPage.locator('#mark').screenshot({ omitBackground: true });
fs.writeFileSync(path.join(BRAND_DIR, 'land-in-coorg-mark-white-4k.png'), markWhiteBuf);
fs.writeFileSync(path.join(ARTIFACTS_DIR, 'land-in-coorg-mark-white-4k.png'), markWhiteBuf);

// Render 4: Standalone 4K Mark (Dark)
await markPage.setContent(`
  <body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;height:100vh;">
    <div id="mark" style="width:1024px;height:1024px;">
      ${smoothDarkMarkSvg}
    </div>
  </body>
`);
const markDarkBuf = await markPage.locator('#mark').screenshot({ omitBackground: true });
fs.writeFileSync(path.join(BRAND_DIR, 'land-in-coorg-mark-dark-4k.png'), markDarkBuf);
fs.writeFileSync(path.join(ARTIFACTS_DIR, 'land-in-coorg-mark-dark-4k.png'), markDarkBuf);
await markPage.close();

await browser.close();

console.log('--- 3. Creating 4K Forest Banner (Exact Match to Snippet) ---');
const whiteLogoMeta = await sharp(whiteLockupBuffer).metadata();
const bannerWidth = whiteLogoMeta.width + 360;
const bannerHeight = whiteLogoMeta.height + 260;

const forestBase = await sharp('public/images/coorg/supplied/generic/forest-dense.webp')
  .resize(bannerWidth, bannerHeight, { fit: 'cover' })
  .blur(18)
  .modulate({ brightness: 0.52, saturation: 0.82 })
  .toBuffer();

const vignetteSvg = `
  <svg width="${bannerWidth}" height="${bannerHeight}">
    <rect width="${bannerWidth}" height="${bannerHeight}" fill="rgba(14, 22, 18, 0.48)"/>
    <radialGradient id="vig" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.68"/>
    </radialGradient>
    <rect width="${bannerWidth}" height="${bannerHeight}" fill="url(#vig)"/>
  </svg>
`;

const forestBannerBuffer = await sharp(forestBase)
  .composite([
    { input: Buffer.from(vignetteSvg), top: 0, left: 0 },
    { input: whiteLockupBuffer, top: 130, left: 180 }
  ])
  .png()
  .toBuffer();

const bannerPath = path.join(BRAND_DIR, 'land-in-coorg-logo-forest-banner-4k.png');
fs.writeFileSync(bannerPath, forestBannerBuffer);
fs.writeFileSync(path.join(ARTIFACTS_DIR, 'land-in-coorg-logo-forest-banner-4k.png'), forestBannerBuffer);
console.log('✓ Created 4K Forest Banner PNG (4446x1156)');

console.log('--- 4. Writing Scalable Vector SVGs ---');
const createVectorSvg = (titleColor, subtitleColor, markFill, redFill) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 448" width="2048" height="448">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&amp;family=Manrope:wght@600&amp;display=swap');
      .title {
        font-family: 'DM Serif Display', Georgia, serif;
        font-size: 176px;
        font-weight: 400;
        letter-spacing: 0.06em;
        text-anchor: middle;
        fill: ${titleColor};
      }
      .subtitle {
        font-family: 'Manrope', sans-serif;
        font-size: 80px;
        font-weight: 600;
        letter-spacing: 0.10em;
        text-anchor: middle;
        fill: ${subtitleColor};
      }
    </style>
  </defs>
  <g transform="translate(0, 0)">
    <svg x="0" y="0" width="448" height="448" viewBox="0 0 512 512" fill-rule="evenodd">
      <path fill="${markFill}" d="${starPath}"/>
      <path fill="${redFill}" d="${redPath}"/>
    </svg>
    <text class="title" x="1260" y="220">LAND IN COORG</text>
    <text class="subtitle" x="1260" y="340">A DIFFERENT KIND OF BELONGING</text>
  </g>
</svg>
`;

fs.writeFileSync(path.join(BRAND_DIR, 'land-in-coorg-logo-white.svg'), createVectorSvg('#ffffff', '#ffffff', '#ffffff', '#e0142c'));
fs.writeFileSync(path.join(BRAND_DIR, 'land-in-coorg-logo-dark.svg'), createVectorSvg('#173c32', '#173c32', '#173c32', '#e0142c'));
console.log('✓ Created Vector SVGs in public/images/brand/');

console.log('All brand assets successfully generated!');
