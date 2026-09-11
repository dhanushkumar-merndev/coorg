import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailPage from "@/components/projects/ProjectDetailPage";
import { farmProjects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

function getProject(slug: string) {
  const project = farmProjects.find((item) => item.id === slug);
  if (!project) notFound();
  return project;
}

export function generateStaticParams() {
  return farmProjects.map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  return { title: `${project.name} · Ongoing Project | Land in Coorg`, description: `${project.name}, an ongoing project in ${project.location} from the Star Infra Developers portfolio.` };
}

export default async function FarmProjectPage({ params }: Props) {
  return <ProjectDetailPage project={getProject((await params).slug)} />;
}
