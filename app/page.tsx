import Hero from "@/components/home/Hero";
import ProjectReel from "@/components/home/ProjectReel";
import LogoMarquee from "@/components/home/LogoMarquee";
import ServicesSection from "@/components/home/ServicesSection";
import ProcessSection from "@/components/home/ProcessSection";
import SectionSnap from "@/components/home/SectionSnap";

export default function HomePage(): React.ReactElement {
  return (
    <main>
      <Hero />
      <ProjectReel />
      {/* <LogoMarquee /> */}
      <ServicesSection />
      <ProcessSection />

      <SectionSnap />
    </main>
  );
}
