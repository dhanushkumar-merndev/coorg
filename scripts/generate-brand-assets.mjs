import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const potrace = require('potrace');
const nextReq = createRequire(require.resolve('next/package.json'));
const sharp = nextReq('sharp');
const { chromium } = require('@playwright/test');

const CONVERSATION_ID = '5c71b72c-8525-4aee-9ca5-e589e4968c9d';
const ARTIFACTS_DIR = `/home/dhanushkr/.gemini/antigravity-ide/brain/${CONVERSATION_ID}`;
const BRAND_DIR = path.resolve('public/images/brand');
const PUBLIC_DIR = path.resolve('public');

if (!fs.existsSync(BRAND_DIR)) {
  fs.mkdirSync(BRAND_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

console.log('=== 1. Vectorizing Master Star Mark with Potrace ===');
const { data, info } = await sharp('public/logo.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;

const starBuf = Buffer.alloc(w * h);
const redBuf = Buffer.alloc(w * h);

for (let i = 0; i < w * h; i++) {
  const r = data[i * 4];
  const g = data[i * 4 + 1];
  const b = data[i * 4 + 2];
  const a = data[i * 4 + 3];

  if (a > 50) {
    if (r > g * 1.4 && r > b * 1.4) {
      redBuf[i] = 0;   // foreground (red swoop)
      starBuf[i] = 255;
    } else {
      starBuf[i] = 0;  // foreground (star loops)
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
  potrace.trace(buffer, { optTolerance: 0.35, optCurve: true, alphaMax: 1.0 }, (err, svg) => {
    if (err) reject(err); else resolve(svg);
  });
});

const starSvg = await trace(starPng);
const redSvg = await trace(redPng);

const starPath = starSvg.match(/<path d="([^"]+)"/)[1];
const redPath = redSvg.match(/<path d="([^"]+)"/)[1];

console.log('✓ Master vector paths extracted smoothly.');

// Generate Core Brand Marks
const markWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill-rule="evenodd"><path fill="#ffffff" d="${starPath}"/><path fill="#e0142c" d="${redPath}"/></svg>\n`;
const markDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill-rule="evenodd"><path fill="#173c32" d="${starPath}"/><path fill="#e0142c" d="${redPath}"/></svg>\n`;
const markGoldSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill-rule="evenodd"><path fill="#c5a467" d="${starPath}"/><path fill="#e0142c" d="${redPath}"/></svg>\n`;
const markMonoWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill-rule="evenodd"><path fill="#ffffff" d="${starPath}"/><path fill="#ffffff" d="${redPath}"/></svg>\n`;
const markMonoDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill-rule="evenodd"><path fill="#173c32" d="${starPath}"/><path fill="#173c32" d="${redPath}"/></svg>\n`;

fs.writeFileSync('public/brand-logo.svg', markWhiteSvg);
fs.writeFileSync('public/brand-logo-on-light.svg', markDarkSvg);
fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-mark-white.svg'), markWhiteSvg);
fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-mark-dark.svg'), markDarkSvg);
fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-mark-gold.svg'), markGoldSvg);
fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-mark-mono-white.svg'), markMonoWhiteSvg);
fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-mark-mono-dark.svg'), markMonoDarkSvg);

console.log('✓ Updated public/brand-logo.svg & public/brand-logo-on-light.svg with smooth Bezier vectors.');

console.log('=== 2. Launching Chromium for Ultra-HD Brand Renders ===');
const browser = await chromium.launch();
const page = await browser.newPage({ 
  viewport: { width: 3200, height: 1600 },
  deviceScaleFactor: 2 
});

// HTML Template for Horizontal Brand Lockup
const horizontalLockupHtml = ({ markWhite, markAccent, titleColor, subtitleColor, subtitleOpacity }) => `
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
      gap: 72px;
      padding: 48px 64px;
    }
    .logo-icon {
      width: 320px;
      height: 320px;
      flex-shrink: 0;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      white-space: nowrap;
    }
    .brand-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 136px;
      line-height: 1.08;
      letter-spacing: 0.02em;
      color: ${titleColor};
      font-weight: 400;
    }
    .brand-divider {
      width: 100%;
      height: 2px;
      background: ${subtitleColor};
      opacity: 0.25;
      margin: 18px 0 16px 0;
    }
    .brand-tagline {
      font-family: 'Manrope', sans-serif;
      font-size: 44px;
      font-weight: 600;
      letter-spacing: 0.12em;
      color: ${subtitleColor};
      opacity: ${subtitleOpacity || 0.92};
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="brand-lockup" id="brand-horizontal">
    <svg class="logo-icon" viewBox="0 0 512 512" fill-rule="evenodd">
      <path fill="${markWhite}" d="${starPath}"/>
      <path fill="${markAccent}" d="${redPath}"/>
    </svg>
    <div class="brand-text">
      <div class="brand-title">Star Managed Farmlands</div>
      <div class="brand-divider"></div>
      <div class="brand-tagline">Thoughtful farmland. A life closer to nature.</div>
    </div>
  </div>
</body>
</html>
`;

// HTML Template for Stacked / Emblem Lockup
const stackedLockupHtml = ({ markWhite, markAccent, titleColor, subtitleColor, subtitleOpacity }) => `
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
    .brand-stacked {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 80px;
      gap: 36px;
    }
    .logo-icon {
      width: 360px;
      height: 360px;
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
      font-size: 148px;
      line-height: 1.1;
      letter-spacing: 0.02em;
      color: ${titleColor};
      font-weight: 400;
    }
    .brand-ornament {
      display: flex;
      align-items: center;
      gap: 24px;
      margin: 24px 0 20px 0;
    }
    .brand-line {
      width: 140px;
      height: 2px;
      background: ${subtitleColor};
      opacity: 0.35;
    }
    .brand-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e0142c;
    }
    .brand-tagline {
      font-family: 'Manrope', sans-serif;
      font-size: 46px;
      font-weight: 600;
      letter-spacing: 0.14em;
      color: ${subtitleColor};
      opacity: ${subtitleOpacity || 0.92};
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="brand-stacked" id="brand-stacked">
    <svg class="logo-icon" viewBox="0 0 512 512" fill-rule="evenodd">
      <path fill="${markWhite}" d="${starPath}"/>
      <path fill="${markAccent}" d="${redPath}"/>
    </svg>
    <div class="brand-text">
      <div class="brand-title">Star Managed Farmlands</div>
      <div class="brand-ornament">
        <div class="brand-line"></div>
        <div class="brand-dot"></div>
        <div class="brand-line"></div>
      </div>
      <div class="brand-tagline">Thoughtful farmland • A life closer to nature</div>
    </div>
  </div>
</body>
</html>
`;

// Helper for rendering with Playwright
async function captureElement(html, selector, outFiles) {
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const buffer = await page.locator(selector).screenshot({ omitBackground: true });
  for (const f of outFiles) {
    fs.writeFileSync(f, buffer);
  }
  return buffer;
}

// 1. Horizontal White on Transparent
console.log('Rendering Horizontal White on Transparent...');
const whiteHorizontalBuffer = await captureElement(
  horizontalLockupHtml({
    markWhite: '#ffffff',
    markAccent: '#e0142c',
    titleColor: '#ffffff',
    subtitleColor: '#e5ece8',
    subtitleOpacity: 0.94
  }),
  '#brand-horizontal',
  [
    path.join(BRAND_DIR, 'star-managed-farmlands-logo-white-transparent.png'),
    path.join(ARTIFACTS_DIR, 'star-managed-farmlands-logo-white-transparent.png')
  ]
);

// 2. Horizontal Dark Ink on Transparent
console.log('Rendering Horizontal Dark Ink on Transparent...');
await captureElement(
  horizontalLockupHtml({
    markWhite: '#173c32',
    markAccent: '#e0142c',
    titleColor: '#173c32',
    subtitleColor: '#2b5446',
    subtitleOpacity: 0.90
  }),
  '#brand-horizontal',
  [
    path.join(BRAND_DIR, 'star-managed-farmlands-logo-dark-transparent.png'),
    path.join(ARTIFACTS_DIR, 'star-managed-farmlands-logo-dark-transparent.png')
  ]
);

// 3. Horizontal Gold Luxury on Transparent
console.log('Rendering Horizontal Gold Luxury on Transparent...');
await captureElement(
  horizontalLockupHtml({
    markWhite: '#c5a467',
    markAccent: '#e0142c',
    titleColor: '#c5a467',
    subtitleColor: '#e0c99a',
    subtitleOpacity: 0.95
  }),
  '#brand-horizontal',
  [
    path.join(BRAND_DIR, 'star-managed-farmlands-logo-gold-transparent.png'),
    path.join(ARTIFACTS_DIR, 'star-managed-farmlands-logo-gold-transparent.png')
  ]
);

// 4. Stacked Emblem White on Transparent
console.log('Rendering Stacked White Emblem on Transparent...');
await captureElement(
  stackedLockupHtml({
    markWhite: '#ffffff',
    markAccent: '#e0142c',
    titleColor: '#ffffff',
    subtitleColor: '#e5ece8',
    subtitleOpacity: 0.94
  }),
  '#brand-stacked',
  [
    path.join(BRAND_DIR, 'star-managed-farmlands-logo-stacked-white-transparent.png'),
    path.join(ARTIFACTS_DIR, 'star-managed-farmlands-logo-stacked-white-transparent.png')
  ]
);

// 5. Stacked Emblem Dark Ink on Transparent
console.log('Rendering Stacked Dark Ink Emblem on Transparent...');
await captureElement(
  stackedLockupHtml({
    markWhite: '#173c32',
    markAccent: '#e0142c',
    titleColor: '#173c32',
    subtitleColor: '#2b5446',
    subtitleOpacity: 0.90
  }),
  '#brand-stacked',
  [
    path.join(BRAND_DIR, 'star-managed-farmlands-logo-stacked-dark-transparent.png'),
    path.join(ARTIFACTS_DIR, 'star-managed-farmlands-logo-stacked-dark-transparent.png')
  ]
);

// 6. Standalone 4K Mark PNGs (White, Dark, Gold)
console.log('Rendering Standalone 4K Marks...');
const markPage = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 2 });

const renderMarkPng = async (svgContent, outNames) => {
  await markPage.setContent(`
    <body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;height:100vh;">
      <div id="mark" style="width:1024px;height:1024px;display:flex;align-items:center;justify-content:center;">
        <div style="width:960px;height:960px;">${svgContent}</div>
      </div>
    </body>
  `);
  const buf = await markPage.locator('#mark').screenshot({ omitBackground: true });
  for (const name of outNames) {
    fs.writeFileSync(path.join(BRAND_DIR, name), buf);
    fs.writeFileSync(path.join(ARTIFACTS_DIR, name), buf);
  }
  return buf;
};

await renderMarkPng(markWhiteSvg, ['star-managed-farmlands-mark-white-4k.png']);
await renderMarkPng(markDarkSvg, ['star-managed-farmlands-mark-dark-4k.png']);
await renderMarkPng(markGoldSvg, ['star-managed-farmlands-mark-gold-4k.png']);
await markPage.close();
await browser.close();

console.log('✓ Ultra-HD Transparent PNG lockups and 4K marks rendered successfully.');

console.log('=== 3. Writing Scalable Vector SVGs ===');

// Scalable Vector SVG for Horizontal Lockup
const createHorizontalVectorSvg = (titleColor, subtitleColor, dividerColor, markFill, redFill) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2800 480" width="2800" height="480">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&amp;family=Manrope:wght@600&amp;display=swap');
      .title {
        font-family: 'DM Serif Display', Georgia, serif;
        font-size: 136px;
        font-weight: 400;
        letter-spacing: 0.02em;
        fill: ${titleColor};
      }
      .tagline {
        font-family: 'Manrope', sans-serif;
        font-size: 42px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        fill: ${subtitleColor};
      }
      .divider {
        stroke: ${dividerColor};
        stroke-width: 2;
        stroke-linecap: round;
        opacity: 0.35;
      }
    </style>
  </defs>
  <g transform="translate(48, 48)">
    <svg x="0" y="0" width="384" height="384" viewBox="0 0 512 512" fill-rule="evenodd">
      <path fill="${markFill}" d="${starPath}"/>
      <path fill="${redFill}" d="${redPath}"/>
    </svg>
    <text class="title" x="480" y="195">Star Managed Farmlands</text>
    <line class="divider" x1="480" y1="242" x2="2650" y2="242" />
    <text class="tagline" x="480" y="325">Thoughtful farmland. A life closer to nature.</text>
  </g>
</svg>
`;

// Scalable Vector SVG for Stacked Lockup
const createStackedVectorSvg = (titleColor, subtitleColor, dividerColor, markFill, redFill) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" width="1600" height="1200">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&amp;family=Manrope:wght@600&amp;display=swap');
      .stacked-title {
        font-family: 'DM Serif Display', Georgia, serif;
        font-size: 116px;
        font-weight: 400;
        letter-spacing: 0.02em;
        text-anchor: middle;
        fill: ${titleColor};
      }
      .stacked-tagline {
        font-family: 'Manrope', sans-serif;
        font-size: 34px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        text-anchor: middle;
        fill: ${subtitleColor};
      }
      .stacked-divider {
        stroke: ${dividerColor};
        stroke-width: 2;
        stroke-linecap: round;
        opacity: 0.35;
      }
    </style>
  </defs>
  <g transform="translate(0, 0)">
    <svg x="580" y="90" width="440" height="440" viewBox="0 0 512 512" fill-rule="evenodd">
      <path fill="${markFill}" d="${starPath}"/>
      <path fill="${redFill}" d="${redPath}"/>
    </svg>
    <text class="stacked-title" x="800" y="680">Star Managed Farmlands</text>
    <line class="stacked-divider" x1="560" y1="740" x2="740" y2="740" />
    <circle cx="800" cy="740" r="4" fill="#e0142c" />
    <line class="stacked-divider" x1="860" y1="740" x2="1040" y2="740" />
    <text class="stacked-tagline" x="800" y="830">Thoughtful farmland • A life closer to nature</text>
  </g>
</svg>
`;

fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-logo-white.svg'), createHorizontalVectorSvg('#ffffff', '#e5ece8', '#ffffff', '#ffffff', '#e0142c'));
fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-logo-dark.svg'), createHorizontalVectorSvg('#173c32', '#2b5446', '#173c32', '#173c32', '#e0142c'));
fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-logo-gold.svg'), createHorizontalVectorSvg('#c5a467', '#dfcb9d', '#c5a467', '#c5a467', '#e0142c'));

fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-logo-stacked-white.svg'), createStackedVectorSvg('#ffffff', '#e5ece8', '#ffffff', '#ffffff', '#e0142c'));
fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-logo-stacked-dark.svg'), createStackedVectorSvg('#173c32', '#2b5446', '#173c32', '#173c32', '#e0142c'));

console.log('✓ Created SVG vector lockups in public/images/brand/');

console.log('=== 4. Creating 4K Cinematic Forest Banner ===');
const whiteMeta = await sharp(whiteHorizontalBuffer).metadata();
const bannerWidth = Math.max(whiteMeta.width + 480, 4400);
const bannerHeight = 1400;

// High quality forest mist background
const forestBase = await sharp('public/images/coorg/supplied/generic/forest-dense.webp')
  .resize(bannerWidth, bannerHeight, { fit: 'cover' })
  .blur(14)
  .modulate({ brightness: 0.44, saturation: 0.88 })
  .toBuffer();

const vignetteSvg = `
  <svg width="${bannerWidth}" height="${bannerHeight}">
    <rect width="${bannerWidth}" height="${bannerHeight}" fill="rgba(12, 24, 18, 0.58)"/>
    <radialGradient id="vig" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="60%" stop-color="#08140f" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#030806" stop-opacity="0.82"/>
    </radialGradient>
    <rect width="${bannerWidth}" height="${bannerHeight}" fill="url(#vig)"/>
  </svg>
`;

const leftPos = Math.round((bannerWidth - whiteMeta.width) / 2);
const topPos = Math.round((bannerHeight - whiteMeta.height) / 2);

const forestBannerBuffer = await sharp(forestBase)
  .composite([
    { input: Buffer.from(vignetteSvg), top: 0, left: 0 },
    { input: whiteHorizontalBuffer, top: topPos, left: leftPos }
  ])
  .png()
  .toBuffer();

fs.writeFileSync(path.join(BRAND_DIR, 'star-managed-farmlands-forest-banner-4k.png'), forestBannerBuffer);
fs.writeFileSync(path.join(ARTIFACTS_DIR, 'star-managed-farmlands-forest-banner-4k.png'), forestBannerBuffer);
console.log('✓ Created 4K Cinematic Forest Banner PNG (4400x1400)');

console.log('=== 5. Generating Clean Favicons & App Icons ===');
const appIconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="104" fill="#142e24"/>
  <g transform="translate(64, 64) scale(0.75)">
    <svg viewBox="0 0 512 512" fill-rule="evenodd">
      <path fill="#ffffff" d="${starPath}"/>
      <path fill="#e0142c" d="${redPath}"/>
    </svg>
  </g>
</svg>
`;

const appIconBase = await sharp(Buffer.from(appIconSvg)).png().toBuffer();

fs.writeFileSync(path.join(PUBLIC_DIR, 'android-chrome-512x512.png'), appIconBase);
fs.writeFileSync(path.join(PUBLIC_DIR, 'android-chrome-192x192.png'), await sharp(appIconBase).resize(192, 192).png().toBuffer());
fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), await sharp(appIconBase).resize(180, 180).png().toBuffer());
fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-48x48.png'), await sharp(appIconBase).resize(48, 48).png().toBuffer());
fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), await sharp(appIconBase).resize(32, 32).png().toBuffer());
fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-16x16.png'), await sharp(appIconBase).resize(16, 16).png().toBuffer());

// Generate standard ICO file
const png32 = await sharp(appIconBase).resize(32, 32).png().toBuffer();
const icoHeader = Buffer.from([
  0, 0, // reserved
  1, 0, // icon type
  1, 0, // image count
  32,   // width
  32,   // height
  0,    // color palette
  0,    // reserved
  1, 0, // color planes
  32, 0,// bits per pixel
]);
const icoDirEntry = Buffer.alloc(8);
icoDirEntry.writeUInt32LE(png32.length, 0);
icoDirEntry.writeUInt32LE(6 + 16, 4);

const icoFile = Buffer.concat([icoHeader, icoDirEntry, png32]);
fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoFile);

console.log('✓ Generated all crisp web and app icons in public/');

console.log('=== All Star Managed Farmlands Brand Assets Generated Successfully! ===');
