export const navLinks = [
  { label: "Farm Management", href: "/farm-management" },
  { label: "Estates", href: "/estates" },
  { label: "Land & Living", href: "/land-and-living" },
  { label: "About Coorg", href: "/about-coorg" },
] as const;

export function isNavigationActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
