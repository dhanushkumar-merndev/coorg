import { notFound, permanentRedirect } from "next/navigation";
import { managedFarmlandProjects } from "@/data/projects";

export default async function FormerProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!managedFarmlandProjects.some((project) => project.id === slug)) notFound();
  permanentRedirect(`/managed-farmlands/${slug}`);
}
