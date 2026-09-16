// One definition of the public origin, shared by the metadata base, the
// sitemap, robots.txt and llms.txt so every absolute URL agrees on the host.
// The apex redirects to www, so canonical URLs must resolve to the www origin.
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL
  ?? (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000")
).replace(/\/$/, "");

export const siteName = "Star Managed Farmlands";
export const siteTagline = "Thoughtful farmland. A life closer to nature.";
export const siteDescription =
  "Explore the landscapes of Coorg, from coffee plantations and private hill retreats to estate plots and forest land. Find your own kind of quiet.";

export function absoluteUrl(path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
