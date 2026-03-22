"use client";

import ContactMarquee from "./ContactMarquee";
import ContactContent from "./ContactContent";
import Footer from "@/components/shared/Footer";

export default function ContactPage(): React.ReactElement {
  return (
    <div data-transition-in="fade">
      <div className="relative flex min-h-dvh flex-col">
        <ContactMarquee />
        <ContactContent />
      </div>
      <Footer />
    </div>
  );
}
