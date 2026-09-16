"use client";

import BrandWordmark from "../ui/BrandWordmark";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isNavigationActive, navLinks } from "@/data/navigation";
import TransitionLink from "./TransitionLink";
import { LuMenu } from "react-icons/lu";
import { ArrowIcon } from "../ui/Icons";
import CompanyLogo from "../ui/CompanyLogo";
import MobileMenu from "./MobileMenu";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const close = useCallback(() => setMenuOpen(false), []);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1201px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };
    // The header persists between routes, so history and breakpoint changes
    // must dismiss its menu before the menu's cleanup releases the scroll lock.
    window.addEventListener("popstate", close);
    window.addEventListener("coorg:page-transition-start", close);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("popstate", close);
      window.removeEventListener("coorg:page-transition-start", close);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [close]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 70);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-header ${scrolled || pathname === "/enquiry" ? "is-scrolled" : ""}`}>
      <TransitionLink href="/" className="brand" aria-label="Star Managed Farmlands home"><CompanyLogo /><BrandWordmark /></TransitionLink>
      <nav aria-label="Main navigation" className="desktop-nav">{navLinks.map((link) => <TransitionLink key={link.label} href={link.href} aria-current={isNavigationActive(pathname, link.href) ? "page" : undefined}>{link.label}</TransitionLink>)}</nav>
      <TransitionLink href="/enquiry" className="nav-enquire" aria-current={pathname === "/enquiry" ? "page" : undefined}>Enquire Privately <ArrowIcon /></TransitionLink>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-label="Open navigation" onClick={() => setMenuOpen(true)}><LuMenu size={24} strokeWidth={1.2} aria-hidden="true" /></button>
    </header>
    <AnimatePresence>{menuOpen && <MobileMenu onClose={close} />}</AnimatePresence>
  </>;
}
