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
    title: `${project.name} · Managed Farmlands | Land in Coorg`,
    description: `${project.name}, a ${project.status} project in ${project.location} from the Star Infra Developers portfolio.`,
    alternates: { canonical: `/managed-farmlands/${project.id}` },
  };
}

export default async function ManagedProjectPage({ params }: Props) {
  return <ProjectDetailPage project={getProject((await params).slug)} />;
}
