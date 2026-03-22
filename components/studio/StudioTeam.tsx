"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

void ScrollTrigger;
void SplitText;

export default function StudioTeam(): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoImageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const tagline = section.querySelector("[data-team-tagline]");
      const members = section.querySelectorAll("[data-team-member]");
      const photo = section.querySelector("[data-team-photo]");

      if (reduced) {
        if (tagline) gsap.set(tagline, { opacity: 1 });
        gsap.set(members, { opacity: 1, y: 0 });
        if (photo)
          gsap.set(photo, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          });
        return;
      }

      // Tagline SplitText — scrub-linked (forward and backward)
      if (tagline) {
        gsap.set(tagline, { opacity: 1 });
        const split = SplitText.create(tagline, {
          type: "words",
          mask: "words",
        });

        gsap.set(split.words, { yPercent: 100 });

        gsap.to(split.words, {
          yPercent: 0,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: tagline,
            start: "top 85%",
            end: "top 50%",
            scrub: 0.3,
          },
        });
      }

      // Team members stagger
      gsap.set(members, { opacity: 0, y: 20 });
      if (members.length > 0) {
        ScrollTrigger.create({
          trigger: members[0],
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(members, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.2,
              ease: "power3.out",
            });
          },
        });
      }

      // Photo: diagonal clip-path wipe from left
      if (photo) {
        gsap.set(photo, {
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        });

        ScrollTrigger.create({
          trigger: photo,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(photo, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.0,
              ease: "power3.inOut",
            });
          },
        });
      }

      // Photo: intense parallax — image drifts upward as you scroll
      const photoImage = photoImageRef.current;
      if (photoImage) {
        gsap.to(photoImage, {
          yPercent: -25,
          ease: "none",
          scrollTrigger: {
            trigger: photo || section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="px-8 py-16 md:px-16 md:py-20 lg:px-24"
    >
      <div className="mb-16 h-px w-full bg-white/[0.06] md:mb-20" />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
        {/* Left: Tagline + Team */}
        <div className="lg:col-span-6">
          <h2
            data-team-tagline
            className="mb-14 font-display text-3xl font-bold leading-[1.05]
                       text-white opacity-0 md:text-4xl lg:text-5xl"
          >
            Two directors. One pipeline.
          </h2>

          <div className="space-y-10">
            <div data-team-member>
              <p
                className="mb-2 font-body text-[11px] uppercase tracking-[0.2em]
                           text-white/25"
              >
                Co-Director &amp; Creative Lead
              </p>
              <p className="font-display text-xl font-bold text-white md:text-2xl">
                [Co-Director Name]
              </p>
              <p className="mt-2 max-w-[360px] font-body text-sm text-white/30">
                Directs the eye. Obsesses over light, shadow, and every frame.
              </p>
            </div>

            <div data-team-member>
              <p
                className="mb-2 font-body text-[11px] uppercase tracking-[0.2em]
                           text-white/25"
              >
                Co-Director &amp; Technical Lead
              </p>
              <p className="font-display text-xl font-bold text-white md:text-2xl">
                [Co-Director Name]
              </p>
              <p className="mt-2 max-w-[360px] font-body text-sm text-white/30">
                Builds the pipeline. Makes impossible timelines possible.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Photo with intense parallax */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div
            data-team-photo
            className="group/photo relative aspect-[3/4] overflow-hidden rounded-sm"
          >
            <div
              ref={photoImageRef}
              className="absolute inset-[-20%] h-[140%] w-[140%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/studio/team.jpg"
                alt="Studio team"
                className="h-full w-full object-cover grayscale transition-all
                           duration-700 group-hover/photo:grayscale-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
