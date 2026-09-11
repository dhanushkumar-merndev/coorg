"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps } from "react";
import { usePageTransition } from "./PageTransition";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Keep native anchors, prefetch, modified clicks and downloads intact. */
const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(function TransitionLink(
  { href, onNavigate, replace, scroll, ...props }, ref,
) {
  const transition = usePageTransition();
  return <Link {...props} ref={ref} href={href} replace={replace} scroll={scroll} onNavigate={(event) => {
    let prevented = false;
    onNavigate?.({ preventDefault: () => { prevented = true; event.preventDefault(); } });
    if (prevented || !transition) return;
    if (transition.navigate(href, { replace, scroll })) event.preventDefault();
  }} />;
});

export default TransitionLink;
