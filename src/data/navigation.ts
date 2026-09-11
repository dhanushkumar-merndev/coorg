export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Managed Farmlands", href: "/managed-farmlands" },
  { label: "Estates", href: "/estates" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Coorg", href: "/about-coorg" },
] as const;

export function isNavigationActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
