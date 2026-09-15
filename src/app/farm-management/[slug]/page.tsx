import { notFound, permanentRedirect } from "next/navigation";
import { completedProjects, managedFarmlandProjects } from "@/data/projects";

export default async function FormerProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (completedProjects.some((project) => project.id === slug)) permanentRedirect(`/estates/${slug}`);
  if (!managedFarmlandProjects.some((project) => project.id === slug)) notFound();
  permanentRedirect(`/managed-farmlands/${slug}`);
}
