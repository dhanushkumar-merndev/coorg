export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Managed Farmlands", href: "/managed-farmlands" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
] as const;

export function isNavigationActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
