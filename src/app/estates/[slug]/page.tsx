import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import EstateDetailPage from "@/components/estates/EstateDetailPage";
import ProjectDetailPage from "@/components/projects/ProjectDetailPage";
import { estateListings, getEstateListing } from "@/data/estate-listings";
import { completedProjects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };
function resolveEstate(slug: string) {
  if (slug === "sln-plantations") permanentRedirect("/estates/madikeri-estate");
  if (slug === "6-acre-kisan-jv") permanentRedirect("/estates/kishan-6-acres");
  const estate = getEstateListing(slug);
  if (!estate) notFound();
  return estate;
}
export function generateStaticParams() {
  return [...estateListings, ...completedProjects, { id: "sln-plantations" }, { id: "6-acre-kisan-jv" }].map(({ id }) => ({ slug: id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const project = completedProjects.find((item) => item.id === slug);
  if (project) {
    return {
      title: `${project.name} · Estates | Star Managed Farmlands`,
      description: `Explore ${project.name}, an established estate in ${project.location}.`,
      alternates: { canonical: `/estates/${project.id}` },
    };
  }
  const estate = resolveEstate(slug);
  return { title: `${estate.name} · Estates | Star Managed Farmlands`, description: estate.summary, alternates: { canonical: `/estates/${estate.id}` } };
}
export default async function EstatePage({ params }: Props) {
  const slug = (await params).slug;
  const project = completedProjects.find((item) => item.id === slug);
  if (project) return <ProjectDetailPage project={project} />;
  return <EstateDetailPage estate={resolveEstate(slug)} />;
}
