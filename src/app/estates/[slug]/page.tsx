import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailPage from "@/components/projects/ProjectDetailPage";
import { estateProjects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

function getProject(slug: string) {
  const project = estateProjects.find((item) => item.id === slug);
  if (!project) notFound();
  return project;
}

export function generateStaticParams() {
  return estateProjects.map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  return { title: `${project.name} · Completed Estate | Land in Coorg`, description: `${project.name}, a completed project in ${project.location} from the Star Infra Developers portfolio. ${project.summary}` };
}

export default async function EstatePage({ params }: Props) {
  return <ProjectDetailPage project={getProject((await params).slug)} />;
}
