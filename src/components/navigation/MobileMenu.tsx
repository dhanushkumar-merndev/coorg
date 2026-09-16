"use client";

import BrandWordmark from "../ui/BrandWordmark";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isNavigationActive, navLinks } from "@/data/navigation";
import TransitionLink from "./TransitionLink";
import { LuX } from "react-icons/lu";
import CompanyLogo from "../ui/CompanyLogo";

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = ref.current?.querySelectorAll<HTMLElement>("a,button");
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", key); previous?.focus(); };
  }, [onClose]);
  return <motion.div ref={ref} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation" data-lenis-prevent
    initial={{ opacity: 0, y: reduced ? 0 : -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -18 }} transition={{ duration: reduced ? 0.15 : 0.4 }}>
    <div className="mobile-menu-top"><TransitionLink href="/" className="brand" aria-label="Star Managed Farmlands home" onClick={onClose}><CompanyLogo /><BrandWordmark /></TransitionLink><button className="menu-close" aria-label="Close navigation" onClick={onClose}><LuX size={20} aria-hidden="true" /></button></div>
    <nav aria-label="Mobile navigation">{[...navLinks, { label: "Enquire Privately", href: "/enquiry" }].map((link, i) => <TransitionLink key={link.label} href={link.href} aria-current={isNavigationActive(pathname, link.href) ? "page" : undefined} onClick={onClose}><span>0{i + 1}</span>{link.label}</TransitionLink>)}</nav>
    <p>Find a little more room.<br /><em>To simply be.</em></p><span className="eyebrow">COORG · KARNATAKA · INDIA</span>
  </motion.div>;
}
