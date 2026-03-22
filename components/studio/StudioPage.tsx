"use client";

import StudioHero from "./StudioHero";
import StudioManifesto from "./StudioManifesto";
import StudioVisualBreak from "./StudioVisualBreak";
import StudioProcess from "./StudioProcess";
import StudioTeam from "./StudioTeam";
import StudioPhilosophy from "./StudioPhilosophy";
import StudioCTA from "./StudioCTA";
import Footer from "@/components/shared/Footer";

export default function StudioPage(): React.ReactElement {
  return (
    <div data-transition-in="fade">
      <StudioHero />
      <StudioManifesto />
      <StudioVisualBreak />
      <StudioProcess />
      <StudioTeam />
      <StudioPhilosophy />
      <StudioCTA />
      <Footer />
    </div>
  );
}
