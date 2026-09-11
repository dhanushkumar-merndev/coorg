import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import EstateDetailPage from "@/components/estates/EstateDetailPage";
import { estateListings, getEstateListing } from "@/data/estate-listings";
import { completedProjects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };
function resolveEstate(slug: string) {
  if (completedProjects.some((project) => project.id === slug)) permanentRedirect(`/managed-farmlands/${slug}`);
  const estate = getEstateListing(slug);
  if (!estate) notFound();
  return estate;
}
export function generateStaticParams() {
  return [...estateListings, ...completedProjects].map(({ id }) => ({ slug: id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const estate = resolveEstate((await params).slug);
  return { title: `${estate.name} · Estates | Land in Coorg`, description: estate.summary, alternates: { canonical: `/estates/${estate.id}` } };
}
export default async function EstatePage({ params }: Props) {
  return <EstateDetailPage estate={resolveEstate((await params).slug)} />;
}
