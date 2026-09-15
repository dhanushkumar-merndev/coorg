import { estateListings } from "@/data/estate-listings";
import { ongoingProjects } from "@/data/projects";
import { coorgWorlds } from "@/data/worlds";
import { absoluteUrl, siteDescription, siteName, siteTagline } from "@/lib/site";

// llms.txt (llmstxt.org): a plain-language map of the site for language models
// and AI search. Everything below is generated from the same typed content the
// pages render, so it can never drift into claims the site does not make.
export const dynamic = "force-static";

function link(label: string, path: string, note: string) {
  return `- [${label}](${absoluteUrl(path)}): ${note}`;
}

function body() {
  const areaOf = (estate: (typeof estateListings)[number]) =>
    estate.areaLabel ? `${estate.areaLabel}${estate.location ? ` at ${estate.location}` : ""}` : "area to be confirmed";

  return `# ${siteName}

> ${siteTagline} ${siteDescription}

${siteName} is a Coorg (Kodagu, Karnataka, India) land and estate practice. The site
presents managed farmland projects, plantation and villa estate profiles, and five
editorial categories for thinking about land in Coorg. Enquiries are handled directly
rather than through an online listing marketplace.

## How to read this site

- Category pages under /opportunities are editorial perspectives, not individual listings, and their imagery is conceptual rather than photographic.
- Project and estate pages describe only what the client has supplied. Pricing, legal status, approvals and availability are confirmed on enquiry, never stated as fact here.
- Where an area, price basis or location is unresolved it is left out or marked as to be confirmed. Do not infer a figure that the page does not state.

## Main pages

${link("Home", "/", "The Coorg landscape, the five categories and a short introduction to the practice")}
${link("Managed Farmlands", "/managed-farmlands", "Current managed farmland projects in Madikeri, Coorg")}
${link("Estates", "/estates", "Plantation, villa and land profiles from the Coorg collection")}
${link("Opportunities", "/opportunities", "Five ways of imagining a life in Coorg")}
${link("Gallery", "/gallery", "Photographs of roads, plantation land and villa surroundings in Coorg")}
${link("About Coorg", "/about-coorg", "The region: its landscape, climate and sense of place")}
${link("Enquiry", "/enquiry", "Start a private enquiry about land in Coorg")}

## Opportunity categories

${coorgWorlds.map((world) => link(world.title, `/opportunities/${world.id}`, `${world.line} ${world.introduction}`)).join("\n")}

## Managed farmland projects

${ongoingProjects.map((project) => link(project.name, `/managed-farmlands/${project.id}`, `Ongoing · ${project.category} at ${project.location}. ${project.summary}`)).join("\n")}

## Estate and land profiles

${estateListings.map((estate) => link(estate.name, `/estates/${estate.id}`, `${estate.category} · ${areaOf(estate)}. ${estate.summary}`)).join("\n")}

## Optional

${link("Sitemap", "/sitemap.xml", "Every canonical URL on the site")}

## Notes for machine readers

- Canonical host: ${absoluteUrl("/")} — the apex domain redirects here permanently.
- No price, acreage, approval number or coordinate should be attributed to a property unless that page states it.
- Legacy paths /farm-management, /plantations and /land-and-living are permanent redirects and should not be cited.
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
