"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import TransitionLink from "@/components/navigation/TransitionLink";
import { LuArrowRight } from "react-icons/lu";
import styles from "./pages.module.css";

type Props = { image: string; alt: string; title: string; line: string; href: string; index: string; className?: string };

export default function DepthCard({ image, alt, title, line, href, index, className = "" }: Props) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 150, damping: 25 });
  const rotateY = useSpring(y, { stiffness: 150, damping: 25 });

  return <div className={`${styles.depthFrame} ${className}`} data-chapter-rise>
    <motion.div className={styles.depthCard} style={{ rotateX, rotateY }}
      onPointerMove={(event) => {
        if (reduced || !finePointer) return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set((0.5 - (event.clientY - box.top) / box.height) * 5);
        y.set(((event.clientX - box.left) / box.width - 0.5) * 7);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}>
      <TransitionLink href={href} className={styles.depthLink}>
        <Image src={image} alt={alt} fill sizes="(max-width: 700px) 90vw, 44vw" className={styles.coverImage} />
        <span className={styles.cardShade} aria-hidden="true" />
        <span className={styles.cardTop}><span>{index} / A WAY TO BELONG</span><LuArrowRight size={20} aria-hidden="true" /></span>
        <div className={styles.cardContent} data-card-copy><h3>{title}</h3><span className={styles.cardLine}>{line}</span><span className={styles.cardRule} data-chapter-rule /><span className={styles.cardAction}>Explore this perspective <LuArrowRight size={20} aria-hidden="true" /></span><span className={styles.imageDisclosure}>AI-generated conceptual imagery</span></div>
      </TransitionLink>
    </motion.div>
  </div>;
}
