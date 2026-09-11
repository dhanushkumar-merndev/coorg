"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowIcon } from "./Icons";
import TransitionLink from "../navigation/TransitionLink";

const MotionLink = motion.create(TransitionLink);

export default function MagneticButton({ href, children, variant = "light" }: { href: string; children: ReactNode; variant?: "light" | "line" }) {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 24 });
  const y = useSpring(0, { stiffness: 260, damping: 24 });
  return <MotionLink href={href} className={`button button--${variant}`} style={{ x, y }}
    onPointerMove={(event) => {
      if (reduced || event.pointerType !== "mouse") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - bounds.left - bounds.width / 2) * 0.06);
      y.set((event.clientY - bounds.top - bounds.height / 2) * 0.1);
    }} onPointerLeave={() => { x.set(0); y.set(0); }} whileTap={{ scale: reduced ? 1 : 0.98 }}>
    <span>{children}</span><ArrowIcon />
  </MotionLink>;
}
