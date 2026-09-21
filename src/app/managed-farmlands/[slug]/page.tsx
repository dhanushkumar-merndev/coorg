import { permanentRedirect } from "next/navigation";

export default async function FormerManagedFarmlandProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  permanentRedirect(`/projects/${(await params).slug}`);
}
