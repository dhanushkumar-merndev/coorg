"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LuArrowUpRight } from "react-icons/lu";
import type { MouseEvent } from "react";
import TransitionLink from "../navigation/TransitionLink";
import type { CoorgWorld } from "@/data/worlds";
import { coorgWorlds } from "@/data/worlds";
import styles from "./worlds.module.css";

type WorldCardProps = {
  world: CoorgWorld;
  index: number;
  distance: number;
  width: number;
  reducedMotion: boolean;
  selected: boolean;
  onSelect: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function WorldCard({
  world,
  index,
  distance,
  width,
  reducedMotion,
  selected,
  onSelect,
}: WorldCardProps) {
  const depth = Math.abs(distance);
  const active = distance === 0;
  // Five DOM cards form a balanced shallow arc; only this wrapper owns its transform.
  const x = reducedMotion ? distance * (width + 20) : distance * width * 0.93;
  const y = reducedMotion ? 0 : depth * 22;
  const z = reducedMotion ? 0 : -depth * 135;
  const rotateY = reducedMotion ? 0 : distance * -17;
  const scale = reducedMotion ? 1 : 1 - depth * 0.055;

  return (
    <motion.article
      className={styles.cardPosition}
      initial={false}
      animate={{
        x,
        y,
        z,
        rotateY,
        scale,
        opacity: depth > 1 ? 0.74 : 1,
      }}
      transition={reducedMotion ? { duration: 0.16 } : { type: "spring", stiffness: 145, damping: 25, mass: 0.9 }}
      style={{ zIndex: 10 - depth, width, visibility: selected ? "hidden" : "visible" }}
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${coorgWorlds.length}`}
    >
      <TransitionLink
        href={`/opportunities/${world.id}`}
        className={styles.cardButton}
        onClick={onSelect}
        tabIndex={active ? 0 : -1}
        aria-label={`Explore ${world.title}`}
        aria-haspopup="dialog"
        draggable={false}
        data-active={active}
        data-world-id={world.id}
      >
        <div
          className={styles.cardImage}
          style={{ borderRadius: 6 }}
        >
          <Image src={world.image} alt={world.imageAlt} fill sizes="(max-width: 600px) 80vw, 360px" draggable={false} />
          <span className={styles.imageShade} />
        </div>
        <span className={styles.cardTopline}>
          <span>0{index + 1} / COORG WORLDS</span>
          {active && <LuArrowUpRight className={styles.cornerMark} size={22} aria-hidden="true" data-card-arrow />}
        </span>
        <span className={styles.cardCopy}>
          <span className={styles.cardTitle}>{world.title}</span>
          <span className={styles.cardLine}>{world.line}</span>
          <span className={styles.cardExplore}>Explore this world {active && <LuArrowUpRight size={18} aria-hidden="true" data-card-arrow />}</span>
        </span>
        <span className={styles.conceptualLabel}>Conceptual imagery</span>
      </TransitionLink>
    </motion.article>
  );
}
