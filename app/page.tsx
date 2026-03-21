import Hero from "@/components/home/Hero";
import ProjectReel from "@/components/home/ProjectReel";
import SectionSnap from "@/components/home/SectionSnap";

export default function HomePage(): React.ReactElement {
  return (
    <main>
      <Hero />
      <ProjectReel />

      {/* Placeholder for Phase 10+ sections */}
      <section
        data-section
        className="flex h-screen items-center justify-center bg-bg"
      >
        <p className="font-body text-sm text-text-secondary">
          Marquee + Services go here (Phase 10)
        </p>
      </section>

      <SectionSnap />
    </main>
  );
}
