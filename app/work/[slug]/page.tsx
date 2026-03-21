import { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects-data";
import ProjectDetail from "@/components/work/ProjectDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} - ${project.client}`,
    description:
      project.tagline || `${project.categoryLabel} for ${project.client}`,
  };
}

export default async function ProjectPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  // Related: same category first, fill with others, max 3
  const related = projects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  if (related.length < 3) {
    const others = projects
      .filter(
        (p) => p.id !== project.id && !related.find((r) => r.id === p.id),
      )
      .slice(0, 3 - related.length);
    related.push(...others);
  }

  // Next/Previous for linear navigation (wraps around)
  const currentIdx = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIdx + 1) % projects.length];
  const prevProject =
    projects[(currentIdx - 1 + projects.length) % projects.length];

  return (
    <ProjectDetail
      project={project}
      relatedProjects={related}
      nextProject={nextProject}
      prevProject={prevProject}
    />
  );
}
