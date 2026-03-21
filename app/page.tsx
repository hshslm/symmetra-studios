import Hero from "@/components/home/Hero";
import ProjectReel from "@/components/home/ProjectReel";
import LogoMarquee from "@/components/home/LogoMarquee";
import ServicesSection from "@/components/home/ServicesSection";
import SectionSnap from "@/components/home/SectionSnap";

export default function HomePage(): React.ReactElement {
  return (
    <main>
      <Hero />
      <ProjectReel />
      {/* <LogoMarquee /> */}
      <ServicesSection />

      {/* Placeholder for Phase 10c+ */}
      <section
        data-section
        className="flex h-dvh items-center justify-center bg-bg"
      >
        <p className="font-body text-sm text-text-secondary">
          Process goes here (Phase 10c)
        </p>
      </section>

      <SectionSnap />
    </main>
  );
}
