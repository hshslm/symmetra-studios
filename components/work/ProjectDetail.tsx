"use client";

import type { Project } from "@/lib/projects-data";
import ProjectVideoHero from "./ProjectVideoHero";
import ProjectInfo from "./ProjectInfo";
import RelatedProjects from "./RelatedProjects";
import ProjectNav from "./ProjectNav";
import Footer from "@/components/shared/Footer";

interface ProjectDetailProps {
  project: Project;
  relatedProjects: Project[];
  nextProject: Project;
  prevProject: Project;
}

export default function ProjectDetail({
  project,
  relatedProjects,
  nextProject,
  prevProject,
}: ProjectDetailProps): React.ReactElement {
  return (
    <div data-transition-in="fade">
      <ProjectVideoHero project={project} />
      <ProjectInfo project={project} />
      <RelatedProjects projects={relatedProjects} />
      <ProjectNav next={nextProject} prev={prevProject} />
      <Footer />
    </div>
  );
}
