import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import TransitionLink from "@/components/navigation/TransitionLink";
import { LuArrowRight } from "react-icons/lu";
import HeroScrollIndicator from "@/components/ui/HeroScrollIndicator";
import styles from "./pages.module.css";

type HeroProps = { chapter: string; label: string; lines: string[]; italicLast?: boolean; description: string; image: string; alt: string; variant?: "left" | "center" | "wide"; anchor: string; disclosure?: ReactNode; children?: ReactNode; className?: string };

export function ChapterHero({ chapter, label, lines, italicLast = true, description, image, alt, variant = "left", anchor, disclosure, children, className = "" }: HeroProps) {
  return <section className={`${styles.hero} ${styles[`hero_${variant}`]} ${className}`} data-chapter-hero aria-labelledby="chapter-title">
    <div className={styles.heroVisual}><div className={styles.heroImage} data-chapter-image><Image src={image} alt={alt} fill sizes="(max-width: 700px) 220vw, 100vw" preload className={styles.coverImage} /></div></div>
    <div className={styles.heroShade} aria-hidden="true" />
    <div className={styles.heroText} data-chapter-depth>
      <p className={styles.eyebrow} data-chapter-intro>{chapter} <span>/</span> {label}</p>
      <h1 id="chapter-title" className={styles.heroTitle}>{lines.map((line, index) => <span className={styles.lineMask} key={line}><span data-chapter-entry>{italicLast && index === lines.length - 1 ? <em>{line}</em> : line}</span></span>)}</h1>
      <p className={styles.heroDescription} data-chapter-intro>{description}</p>
      {children}
    </div>
    {disclosure && <div className={styles.heroFoot} data-chapter-intro><span className={styles.imageDisclosure}>{disclosure}</span></div>}
    <HeroScrollIndicator anchor={anchor} />
  </section>;
}

export function WordHeading({ children, className = "", id, treatment }: { children: string; className?: string; id?: string; treatment?: "ink" | "wipe" | "settle" | "rise" }) {
  return <h2 id={id} className={`${styles.sectionTitle} ${className}`} data-chapter-words={treatment ?? ""}>{children.split(" ").map((word, index) => <Fragment key={`${word}-${index}`}><span className={styles.wordMask}><span data-chapter-word>{word}</span></span>{" "}</Fragment>)}</h2>;
}

export function LandscapeImage({ src, alt, caption, className = "", disclosure }: { src: string; alt: string; caption?: string; className?: string; disclosure?: ReactNode }) {
  return <figure className={`${styles.landscapeFigure} ${className}`}><div className={styles.landscapeCrop} data-chapter-image-frame><div className={styles.landscapeImage} data-chapter-image><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 65vw" className={styles.coverImage} /></div></div>{(caption || disclosure) && <figcaption>{caption && <span>{caption}</span>}{disclosure && <span>{disclosure}</span>}</figcaption>}</figure>;
}

export function RouteButton({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return <TransitionLink href={href} className={`${styles.routeButton} ${light ? styles.routeButtonLight : ""}`}>{children}<LuArrowRight size={20} aria-hidden="true" /></TransitionLink>;
}

export function NextChapter({ href, eyebrow, title, line }: { href: string; eyebrow: string; title: string; line: string }) {
  return <section className={styles.nextChapter} aria-label="Continue exploring"><span className={styles.rule} data-chapter-rule /><p className={styles.eyebrow}>{eyebrow}</p><TransitionLink href={href} className={styles.nextLink}><span data-chapter-rise>{title}</span><LuArrowRight size={56} aria-hidden="true" /></TransitionLink><p className={styles.nextDescription}>{line}</p></section>;
}

export function ContourMark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 320 230" fill="none" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <path key={index} d="M44 178C9 144 44 110 67 105C82 94 60 57 111 47C145 40 162 14 198 31C239 50 221 71 267 90C305 105 306 160 277 179C246 199 236 226 183 210C135 194 103 226 77 198Z" stroke="currentColor" strokeWidth=".8" transform={`translate(${160 * (index * .085)} ${119 * (index * .085)}) scale(${1 - index * .085})`} />)}</svg>;
}
