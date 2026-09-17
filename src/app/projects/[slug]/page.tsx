import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailPage from "@/components/projects/ProjectDetailPage";
import { managedFarmlandProjects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

function getProject(slug: string) {
  const project = managedFarmlandProjects.find((item) => item.id === slug);
  if (!project) notFound();
  return project;
}

export function generateStaticParams() {
  return managedFarmlandProjects.map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  return {
    title: `${project.name} · Managed Farmlands | Star Managed Farmlands`,
    description: `Explore ${project.name}, an ${project.status === "ongoing" ? "ongoing" : "established"} project in ${project.location}. Discover its setting and project details with Star Managed Farmlands.`,
    alternates: { canonical: `/managed-farmlands/${project.id}` },
  };
}

export default async function ManagedProjectPage({ params }: Props) {
  return <ProjectDetailPage project={getProject((await params).slug)} />;
}
