"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { LuDownload, LuCopy, LuCheck, LuExternalLink } from "react-icons/lu";
import styles from "./BrandShowcase.module.css";

interface LogoItem {
  id: string;
  name: string;
  usage: string;
  category: "horizontal" | "stacked" | "mark" | "banner";
  previewSrc: string;
  defaultSurface: string;
  pngUrl: string;
  svgUrl?: string;
  isBanner?: boolean;
  aspect?: "wide" | "tall" | "banner";
}

const LOGO_ITEMS: LogoItem[] = [
  {
    id: "horizontal-dark",
    name: "Primary Horizontal · Dark Ink",
    usage: "Main identity for light surfaces, print collateral, and official stationary.",
    category: "horizontal",
    previewSrc: "/images/brand/star-managed-farmlands-logo-dark-transparent.png",
    defaultSurface: "#fbf9f4",
    pngUrl: "/images/brand/star-managed-farmlands-logo-dark-transparent.png",
    svgUrl: "/images/brand/star-managed-farmlands-logo-dark.svg",
    aspect: "wide",
  },
  {
    id: "horizontal-white",
    name: "Primary Horizontal · Mist White",
    usage: "Reverse lockup for hero banners, dark photography, and night aesthetics.",
    category: "horizontal",
    previewSrc: "/images/brand/star-managed-farmlands-logo-white-transparent.png",
    defaultSurface: "#142e24",
    pngUrl: "/images/brand/star-managed-farmlands-logo-white-transparent.png",
    svgUrl: "/images/brand/star-managed-farmlands-logo-white.svg",
    aspect: "wide",
  },
  {
    id: "horizontal-gold",
    name: "Primary Horizontal · Plantation Gold",
    usage: "Luxury edition for bespoke estate portfolios, deeds, and VIP invitations.",
    category: "horizontal",
    previewSrc: "/images/brand/star-managed-farmlands-logo-gold-transparent.png",
    defaultSurface: "#142e24",
    pngUrl: "/images/brand/star-managed-farmlands-logo-gold-transparent.png",
    svgUrl: "/images/brand/star-managed-farmlands-logo-gold.svg",
    aspect: "wide",
  },
  {
    id: "stacked-dark",
    name: "Emblem Lockup · Dark Ink",
    usage: "Centered composition for wax seals, square formats, and signage.",
    category: "stacked",
    previewSrc: "/images/brand/star-managed-farmlands-logo-stacked-dark-transparent.png",
    defaultSurface: "#fbf9f4",
    pngUrl: "/images/brand/star-managed-farmlands-logo-stacked-dark-transparent.png",
    svgUrl: "/images/brand/star-managed-farmlands-logo-stacked-dark.svg",
    aspect: "tall",
  },
  {
    id: "stacked-white",
    name: "Emblem Lockup · Mist White",
    usage: "Centered composition for dark badges, video title cards, and covers.",
    category: "stacked",
    previewSrc: "/images/brand/star-managed-farmlands-logo-stacked-white-transparent.png",
    defaultSurface: "#142e24",
    pngUrl: "/images/brand/star-managed-farmlands-logo-stacked-white-transparent.png",
    svgUrl: "/images/brand/star-managed-farmlands-logo-stacked-white.svg",
    aspect: "tall",
  },
  {
    id: "mark-dark",
    name: "Brand Mark · 4K Dark Ink",
    usage: "Standalone symbol for app icons, avatars, and discreet architectural pins.",
    category: "mark",
    previewSrc: "/images/brand/star-managed-farmlands-mark-dark-4k.png",
    defaultSurface: "#fbf9f4",
    pngUrl: "/images/brand/star-managed-farmlands-mark-dark-4k.png",
    svgUrl: "/images/brand/star-managed-farmlands-mark-dark.svg",
    aspect: "tall",
  },
  {
    id: "mark-white",
    name: "Brand Mark · 4K Mist White",
    usage: "Standalone symbol for dark web interfaces, mobile headers, and favicons.",
    category: "mark",
    previewSrc: "/images/brand/star-managed-farmlands-mark-white-4k.png",
    defaultSurface: "#142e24",
    pngUrl: "/images/brand/star-managed-farmlands-mark-white-4k.png",
    svgUrl: "/images/brand/star-managed-farmlands-mark-white.svg",
    aspect: "tall",
  },
  {
    id: "mark-gold",
    name: "Brand Mark · 4K Plantation Gold",
    usage: "Standalone gold emblem for luxury packaging and estate stone engravings.",
    category: "mark",
    previewSrc: "/images/brand/star-managed-farmlands-mark-gold-4k.png",
    defaultSurface: "#142e24",
    pngUrl: "/images/brand/star-managed-farmlands-mark-gold-4k.png",
    svgUrl: "/images/brand/star-managed-farmlands-mark-gold.svg",
    aspect: "tall",
  },
  {
    id: "forest-banner",
    name: "Cinematic Showcase Banner · 4K",
    usage: "Ultra-wide banner with mist canopy vignette for presentations & headers.",
    category: "banner",
    previewSrc: "/images/brand/star-managed-farmlands-forest-banner-4k.png",
    defaultSurface: "#0d1713",
    pngUrl: "/images/brand/star-managed-farmlands-forest-banner-4k.png",
    isBanner: true,
    aspect: "banner",
  },
];

const SURFACES = [
  { id: "auto", name: "Context Surface", color: "transparent" },
  { id: "canopy", name: "Deep Canopy", color: "#142e24" },
  { id: "mist", name: "Mist White", color: "#fbf9f4" },
  { id: "sand", name: "Dawn Sand", color: "#f4f0e7" },
  { id: "charcoal", name: "Charcoal Ink", color: "#0d1713" },
];

const COLOR_SWATCHES = [
  { name: "Forest Ink", hex: "#173C32", rgb: "23, 60, 50", role: "Primary Brand Authority" },
  { name: "Crimson Ember", hex: "#E0142C", rgb: "224, 20, 44", role: "Dynamic Dawn Swoop Accent" },
  { name: "Plantation Gold", hex: "#C5A467", rgb: "197, 164, 103", role: "Luxury & Estate Tier" },
  { name: "Deep Canopy", hex: "#142E24", rgb: "20, 46, 36", role: "Night Atmosphere & Nav Surface" },
  { name: "Dawn Sand", hex: "#F4F0E7", rgb: "244, 240, 231", role: "Editorial Warm Neutral" },
  { name: "Mist White", hex: "#FBF9F4", rgb: "251, 249, 244", role: "Clean Background & Contrast" },
];

export default function BrandShowcase() {
  const [activeSurface, setActiveSurface] = useState<string>("auto");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback if permission is blocked
    }
  }, []);

  const getCardSurface = (item: LogoItem) => {
    if (activeSurface === "auto") {
      return item.defaultSurface;
    }
    const found = SURFACES.find((s) => s.id === activeSurface);
    return found ? found.color : item.defaultSurface;
  };

  return (
    <div className={styles.container}>
      {/* Intro Philosophy */}
      <div className={styles.intro}>
        <p>
          The <strong>Star Managed Farmlands</strong> visual identity unites the raw poetry of Coorg’s 
          highland landscape with refined architectural restraint. The master emblem features four organic, 
          fluid loops representing the hills, coffee plantations, native canopy, and living earth — unified 
          by a vibrant crimson dawn stroke capturing the first light cresting the Western Ghats.
        </p>
      </div>

      {/* Surface Theme Switcher */}
      <div className={styles.themeSelector} role="group" aria-label="Preview background switcher">
        <span className={styles.themeLabel}>Test Background:</span>
        {SURFACES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`${styles.themeButton} ${activeSurface === s.id ? styles.active : ""}`}
            onClick={() => setActiveSurface(s.id)}
          >
            {s.color !== "transparent" && (
              <span className={styles.swatchDot} style={{ backgroundColor: s.color }} />
            )}
            {s.name}
          </button>
        ))}
      </div>

      {/* 1. Horizontal Primary Lockups */}
      <section className={styles.section} aria-labelledby="horizontal-title">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Core Identity</span>
          <h2 id="horizontal-title" className={styles.sectionTitle}>
            Primary Horizontal Lockups
          </h2>
          <p className={styles.sectionDescription}>
            The primary mark pairing the calligraphic star with DM Serif Display wordmark and tracked uppercase Manrope tagline.
          </p>
        </div>

        <div className={styles.gridCards}>
          {LOGO_ITEMS.filter((i) => i.category === "horizontal").map((item) => (
            <div key={item.id} className={styles.logoCard}>
              <div
                className={`${styles.previewSurface} ${item.aspect === "tall" ? styles.tall : ""}`}
                style={{ backgroundColor: getCardSurface(item) }}
              >
                <Image
                  src={item.previewSrc}
                  alt={item.name}
                  width={600}
                  height={150}
                  className={styles.previewImage}
                  unoptimized
                />
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.cardMeta}>
                  <h3 className={styles.cardName}>{item.name}</h3>
                  <p className={styles.cardUsage}>{item.usage}</p>
                </div>
                <div className={styles.cardActions}>
                  {item.svgUrl && (
                    <a
                      href={item.svgUrl}
                      download
                      className={`${styles.actionButton} ${styles.primary}`}
                    >
                      <LuDownload size={14} /> Vector SVG
                    </a>
                  )}
                  <a
                    href={item.pngUrl}
                    download
                    className={`${styles.actionButton} ${styles.secondary}`}
                  >
                    <LuDownload size={14} /> 4K PNG
                  </a>
                  <a
                    href={item.svgUrl || item.pngUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`${styles.actionButton} ${styles.secondary}`}
                    title="Open in new tab"
                  >
                    <LuExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Stacked & Emblem Lockups */}
      <section className={styles.section} aria-labelledby="stacked-title">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Vertical & Seals</span>
          <h2 id="stacked-title" className={styles.sectionTitle}>
            Stacked Emblem Lockups
          </h2>
          <p className={styles.sectionDescription}>
            Centered, symmetrical arrangement with crimson jewel divider ornament, tailored for certificates, plot deed folders, and physical architectural plaques.
          </p>
        </div>

        <div className={styles.gridCards}>
          {LOGO_ITEMS.filter((i) => i.category === "stacked").map((item) => (
            <div key={item.id} className={styles.logoCard}>
              <div
                className={`${styles.previewSurface} ${styles.tall}`}
                style={{ backgroundColor: getCardSurface(item) }}
              >
                <Image
                  src={item.previewSrc}
                  alt={item.name}
                  width={360}
                  height={260}
                  className={styles.previewImage}
                  unoptimized
                />
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.cardMeta}>
                  <h3 className={styles.cardName}>{item.name}</h3>
                  <p className={styles.cardUsage}>{item.usage}</p>
                </div>
                <div className={styles.cardActions}>
                  {item.svgUrl && (
                    <a
                      href={item.svgUrl}
                      download
                      className={`${styles.actionButton} ${styles.primary}`}
                    >
                      <LuDownload size={14} /> Vector SVG
                    </a>
                  )}
                  <a
                    href={item.pngUrl}
                    download
                    className={`${styles.actionButton} ${styles.secondary}`}
                  >
                    <LuDownload size={14} /> 4K PNG
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Standalone 4K Brand Marks */}
      <section className={styles.section} aria-labelledby="marks-title">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Monogram & Symbol</span>
          <h2 id="marks-title" className={styles.sectionTitle}>
            Standalone Brand Marks
          </h2>
          <p className={styles.sectionDescription}>
            High-density vector and 4K raster symbols for responsive headers, app touch icons, social media avatars, and luxury stationery.
          </p>
        </div>

        <div className={styles.gridCards}>
          {LOGO_ITEMS.filter((i) => i.category === "mark").map((item) => (
            <div key={item.id} className={styles.logoCard}>
              <div
                className={`${styles.previewSurface} ${styles.tall}`}
                style={{ backgroundColor: getCardSurface(item) }}
              >
                <Image
                  src={item.previewSrc}
                  alt={item.name}
                  width={220}
                  height={220}
                  className={styles.previewImage}
                  unoptimized
                />
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.cardMeta}>
                  <h3 className={styles.cardName}>{item.name}</h3>
                  <p className={styles.cardUsage}>{item.usage}</p>
                </div>
                <div className={styles.cardActions}>
                  {item.svgUrl && (
                    <a
                      href={item.svgUrl}
                      download
                      className={`${styles.actionButton} ${styles.primary}`}
                    >
                      <LuDownload size={14} /> Vector SVG
                    </a>
                  )}
                  <a
                    href={item.pngUrl}
                    download
                    className={`${styles.actionButton} ${styles.secondary}`}
                  >
                    <LuDownload size={14} /> 4K PNG
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Cinematic Showcase Banner */}
      <section className={styles.section} aria-labelledby="banner-title">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Key Visual</span>
          <h2 id="banner-title" className={styles.sectionTitle}>
            Cinematic 4K Forest Banner
          </h2>
          <p className={styles.sectionDescription}>
            Luminous white brand identity composited over high-resolution misty Coorg forest canopy with atmospheric vignette.
          </p>
        </div>

        <div className={styles.logoCard}>
          <div className={`${styles.previewSurface} ${styles.banner}`}>
            <Image
              src="/images/brand/star-managed-farmlands-forest-banner-4k.png"
              alt="Star Managed Farmlands 4K Forest Banner"
              width={1200}
              height={380}
              className={styles.previewImage}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              unoptimized
            />
          </div>
          <div className={styles.cardDetails}>
            <div className={styles.cardMeta}>
              <h3 className={styles.cardName}>Ultra-HD 4K Presentation Banner (4400 × 1400)</h3>
              <p className={styles.cardUsage}>
                High-impact asset for project presentations, marketing displays, social banners, and keynote decks.
              </p>
            </div>
            <div className={styles.cardActions}>
              <a
                href="/images/brand/star-managed-farmlands-forest-banner-4k.png"
                download
                className={`${styles.actionButton} ${styles.primary}`}
              >
                <LuDownload size={14} /> Download 4K Banner PNG
              </a>
              <a
                href="/images/brand/star-managed-farmlands-forest-banner-4k.png"
                target="_blank"
                rel="noreferrer"
                className={`${styles.actionButton} ${styles.secondary}`}
              >
                <LuExternalLink size={14} /> View Full 4K Asset
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Brand Color Tokens */}
      <section className={styles.section} aria-labelledby="palette-title">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Color Space</span>
          <h2 id="palette-title" className={styles.sectionTitle}>
            Official Color Palette
          </h2>
          <p className={styles.sectionDescription}>
            Curated earth tones rooted in the Western Ghats landscape. Click any HEX code to copy.
          </p>
        </div>

        <div className={styles.paletteGrid}>
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.hex} className={styles.colorSwatch}>
              <div
                className={styles.swatchPreview}
                style={{ backgroundColor: swatch.hex }}
              />
              <div className={styles.swatchInfo}>
                <span className={styles.swatchTitle}>{swatch.name}</span>
                <button
                  type="button"
                  className={styles.swatchHex}
                  onClick={() => copyToClipboard(swatch.hex, swatch.hex)}
                  title="Click to copy HEX code"
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <span>{swatch.hex}</span>
                  {copiedId === swatch.hex ? (
                    <LuCheck size={14} color="#173c32" />
                  ) : (
                    <LuCopy size={13} />
                  )}
                </button>
                <span className={styles.swatchRole}>{swatch.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Typography System */}
      <section className={styles.section} aria-labelledby="type-title">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Typography Hierarchy</span>
          <h2 id="type-title" className={styles.sectionTitle}>
            Primary Typefaces
          </h2>
          <p className={styles.sectionDescription}>
            A deliberate pairing of classical serif grandeur and contemporary geometric clarity.
          </p>
        </div>

        <div className={styles.typeGrid}>
          <div className={styles.typeCard}>
            <div className={styles.typeFamilyDisplay}>DM Serif Display</div>
            <p className={styles.typeSpec}>
              <strong>Primary Brand Headline Font</strong>
              <br />
              Weights: 400 Regular, 400 Italic.
              <br />
              Used for the brand name &ldquo;Star Managed Farmlands&rdquo;, chapter titles, and editorial quotes. Conveys permanence, prestige, and literary depth.
            </p>
          </div>

          <div className={styles.typeCard}>
            <div className={styles.typeFamilySans}>Manrope Sans</div>
            <p className={styles.typeSpec}>
              <strong>Interface, Navigation &amp; Tagline Font</strong>
              <br />
              Weights: 400, 500, 600 Semi-Bold, 700 Bold.
              <br />
              Used for the tagline &ldquo;Thoughtful farmland. A life closer to nature&rdquo;, technical specifications, navigation items, and body narrative.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Clear Space & Usage Rules */}
      <section className={styles.section} aria-labelledby="rules-title">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Brand Integrity</span>
          <h2 id="rules-title" className={styles.sectionTitle}>
            Clear Space &amp; Usage Rules
          </h2>
          <p className={styles.sectionDescription}>
            Guidelines to preserve clarity, legibility, and architectural precision across all mediums.
          </p>
        </div>

        <div className={styles.guidelinesList}>
          <div className={styles.guidelineCard}>
            <span className={styles.guidelineTitle}>Clear Space Margin</span>
            <p className={styles.guidelineBody}>
              Maintain an exclusion zone around the lockup equal to at least 50% of the Star mark&rsquo;s width. Never crowd the logo with text, borders, or competing imagery.
            </p>
          </div>

          <div className={styles.guidelineCard}>
            <span className={styles.guidelineTitle}>Minimum Digital Scale</span>
            <p className={styles.guidelineBody}>
              Horizontal lockup minimum width: <strong>160px</strong>. Standalone Star mark minimum width: <strong>28px</strong>. Below 28px, use the favicon badge vector.
            </p>
          </div>

          <div className={styles.guidelineCard}>
            <span className={styles.guidelineTitle}>No Distortions</span>
            <p className={styles.guidelineBody}>
              Do not skew, stretch, or alter the proportional relationship between the Star mark loops and the Crimson Swoop. Always scale uniformly with aspect ratio locked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
