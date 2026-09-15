import type { MetadataRoute } from "next";
import { estateListings } from "@/data/estate-listings";
import { completedProjects, indexedManagedFarmlandProjects } from "@/data/projects";
import { coorgWorlds } from "@/data/worlds";
import { absoluteUrl } from "@/lib/site";

// Only canonical URLs belong here. The legacy /farm-management, /plantations,
// /land-and-living routes and the /estates/sln-plantations alias all issue
// permanent redirects, so listing them would send crawlers to a 308.
type Entry = MetadataRoute.Sitemap[number];

function entry(path: string, priority: number, changeFrequency: Entry["changeFrequency"]): Entry {
  return { url: absoluteUrl(path), lastModified: new Date(), changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/", 1, "weekly"),
    entry("/managed-farmlands", 0.9, "weekly"),
    entry("/estates", 0.9, "weekly"),
    entry("/opportunities", 0.8, "monthly"),
    entry("/gallery", 0.6, "monthly"),
    entry("/about-coorg", 0.6, "monthly"),
    entry("/enquiry", 0.7, "yearly"),
    ...coorgWorlds.map((world) => entry(`/opportunities/${world.id}`, 0.7, "monthly")),
    ...indexedManagedFarmlandProjects.map((project) =>
      entry(`/managed-farmlands/${project.id}`, 0.9, "weekly"),
    ),
    ...estateListings.map((estate) => entry(`/estates/${estate.id}`, 0.6, "monthly")),
    // Completed developments render under /estates/<id>, not /managed-farmlands.
    ...completedProjects.map((project) => entry(`/estates/${project.id}`, 0.5, "monthly")),
  ];
}
