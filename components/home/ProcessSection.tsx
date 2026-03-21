"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, DrawSVGPlugin, SplitText } from "@/lib/gsap";
import { processSteps } from "@/lib/process-data";
import ProcessStep from "./ProcessStep";
import ProcessStepMobile from "./ProcessStepMobile";
import ProcessCounter from "./ProcessCounter";

void ScrollTrigger;
void DrawSVGPlugin;
void SplitText;

const TOTAL = processSteps.length;

export default function ProcessSection(): React.ReactElement {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // ── Section entrance divider line — scrub-driven, reversible ──
      const entranceDivider = section.querySelector(
        "#process-entrance-divider",
      );
      if (entranceDivider) {
        gsap.set(entranceDivider, { drawSVG: "0% 0%" });
        gsap.to(entranceDivider, {
          drawSVG: "0% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 40%",
            scrub: 0.5,
          },
        });
      }

      // ─── MOBILE: skip horizontal scroll ───
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const mobileLine = document.getElementById("process-mobile-line");
        if (mobileLine) {
          gsap.set(mobileLine, { scaleY: 0, transformOrigin: "top center" });
          gsap.to(mobileLine, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 0.5,
            },
          });
        }

        const mobileSteps = section.querySelectorAll(
          "[data-process-step-mobile]",
        );
        mobileSteps.forEach((step) => {
          const title = step.querySelector(".process-title");
          const desc = step.querySelector(".process-description");
          const keywords = step.querySelectorAll(".process-keyword");
          const number = step.querySelector(".process-number");
          const ghostNum = step.querySelector(".process-ghost-number");
          const videoContainer = step.querySelector(".process-video-mobile");

          if (number) gsap.set(number, { opacity: 0, y: 8 });
          if (ghostNum) gsap.set(ghostNum, { opacity: 0, y: 10 });
          if (title) gsap.set(title, { opacity: 0 });
          if (desc) gsap.set(desc, { opacity: 0, y: 10 });
          if (keywords.length) gsap.set(keywords, { opacity: 0, y: 6 });
          if (videoContainer) {
            gsap.set(videoContainer, { clipPath: "inset(0 100% 0 0)" });
          }

          ScrollTrigger.create({
            trigger: step,
            start: "top 80%",
            once: true,
            onEnter: () => {
              const tl = gsap.timeline();

              if (ghostNum) {
                tl.to(
                  ghostNum,
                  {
                    opacity: 0.08,
                    y: 0,
                    duration: reduced ? 0.01 : 0.6,
                    ease: "power2.out",
                  },
                  0,
                );
              }
              if (number) {
                tl.to(
                  number,
                  {
                    opacity: 1,
                    y: 0,
                    duration: reduced ? 0.01 : 0.4,
                    ease: "power3.out",
                  },
                  0.1,
                );
              }
              if (title && !reduced) {
                gsap.set(title, { opacity: 1 });
                const split = SplitText.create(title, {
                  type: "words",
                  mask: "words",
                });
                tl.from(
                  split.words,
                  {
                    yPercent: 100,
                    duration: 0.6,
                    stagger: 0.06,
                    ease: "power3.out",
                    onComplete: () => split.revert(),
                  },
                  0.15,
                );
              } else if (title) {
                tl.to(title, { opacity: 1, duration: 0.01 }, 0);
              }
              if (desc) {
                tl.to(
                  desc,
                  {
                    opacity: 1,
                    y: 0,
                    duration: reduced ? 0.01 : 0.5,
                    ease: "power3.out",
                  },
                  0.35,
                );
              }
              if (keywords.length) {
                tl.to(
                  keywords,
                  {
                    opacity: 1,
                    y: 0,
                    duration: reduced ? 0.01 : 0.3,
                    stagger: 0.06,
                    ease: "power3.out",
                  },
                  0.5,
                );
              }
              if (videoContainer && !reduced) {
                tl.to(
                  videoContainer,
                  {
                    clipPath: "inset(0 0% 0 0)",
                    duration: 0.8,
                    ease: "power2.inOut",
                  },
                  0.2,
                );
                const video = videoContainer.querySelector("video");
                if (video) (video as HTMLVideoElement).play().catch(() => {});
              } else if (videoContainer) {
                gsap.set(videoContainer, { clipPath: "inset(0 0% 0 0)" });
              }
            },
          });
        });

        return;
      }

      // ─── DESKTOP: Horizontal scroll system ───

      // ── Heading entrance + fade-out ──
      const heading = section.querySelector("[data-process-heading]");
      const headingLabel = section.querySelector("[data-process-label]");

      // Label: scrub-driven fade
      if (headingLabel) {
        gsap.set(headingLabel, { opacity: 0, y: 8 });
        gsap.to(headingLabel, {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 60%",
            scrub: 0.5,
          },
        });
      }

      // Heading: scrub-driven letter-by-letter color reveal
      if (heading && !reduced) {
        SplitText.create(heading, {
          type: "chars",
          autoSplit: true,
          onSplit(self: SplitText) {
            gsap.set(self.chars, { color: "rgba(255,255,255,0.12)" });

            return gsap.to(self.chars, {
              color: "rgba(255,255,255,1)",
              stagger: 0.05,
              duration: 0.5,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "top 10%",
                scrub: 0.5,
              },
            });
          },
        });
      } else if (heading) {
        gsap.set(heading, { color: "rgba(255,255,255,1)" });
      }


      // ─── QUERY STEPS + COLLECT VIDEOS (before scrollTween so onUpdate can reference them) ───
      const steps = section.querySelectorAll("[data-process-step]");
      const stepVideos: (HTMLVideoElement | null)[] = [];

      steps.forEach((step) => {
        const video = step.querySelector(
          ".process-video",
        ) as HTMLVideoElement | null;
        stepVideos.push(video);
        // Set initial video scale — GSAP manages transform, not inline CSS
        if (video) gsap.set(video, { scale: 1.2 });
      });

      // Live measurement: scroll distance so last panel lands with 8vw left inset
      // (matching track paddingLeft), balancing the gap on both sides
      const getMaxScroll = (): number => {
        const last = steps[steps.length - 1] as HTMLElement | undefined;
        if (!last) return track.scrollWidth - window.innerWidth;
        return last.offsetLeft - window.innerWidth * 0.08;
      };

      // ─── MAIN HORIZONTAL SCROLL ───
      const scrollTween = gsap.to(track, {
        x: () => -getMaxScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getMaxScroll() + window.innerHeight}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          id: "process-scroll",
          invalidateOnRefresh: true,
          snap: {
            // Snap to each panel's left edge aligned with viewport left
            snapTo: (progress: number) => {
              const ms = getMaxScroll();
              if (ms <= 0) return 0;
              let best = 0;
              let bestDist = Infinity;
              steps.forEach((step) => {
                const el = step as HTMLElement;
                const p = Math.min(el.offsetLeft / ms, 1);
                const d = Math.abs(progress - p);
                if (d < bestDist) {
                  bestDist = d;
                  best = p;
                }
              });
              return Math.max(0, Math.min(best, 1));
            },
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            // Counter — find which panel is closest to viewport left
            const ms = getMaxScroll();
            let idx = 0;
            steps.forEach((step, si) => {
              const p = ms > 0 ? Math.min((step as HTMLElement).offsetLeft / ms, 1) : 0;
              if (self.progress >= p - 0.02) idx = si;
            });
            const current = document.getElementById(
              "process-counter-current",
            );
            if (current) {
              current.textContent = String(idx + 1).padStart(2, "0");
            }
            const fill = document.getElementById("process-counter-fill");
            if (fill) {
              fill.style.width = `${self.progress * 100}%`;
            }

            // Video horizontal parallax
            if (!reduced) {
              steps.forEach((step, si) => {
                const vid = stepVideos[si];
                if (!vid) return;
                const rect = (step as HTMLElement).getBoundingClientRect();
                const centerX =
                  (rect.left + rect.width / 2) / window.innerWidth - 0.5;
                // ±40px at viewport edges, 0 at center
                gsap.set(vid, { x: centerX * 80 });
              });
            }
          },
        },
      });



      // ─── STEP CONTENT REVEALS + VIDEO + EXIT TRANSITIONS ───
      steps.forEach((step, i) => {
        const ghostNum = step.querySelector(".process-ghost-number");
        const number = step.querySelector(".process-number");
        const title = step.querySelector(".process-title");
        const desc = step.querySelector(".process-description");
        const keywordTags = step.querySelectorAll(".process-keyword");
        const videoContainer = step.querySelector(
          ".process-video-container",
        );
        const video = stepVideos[i];

        // Pre-set hidden (ghost number only — text uses scrub-driven color reveals)
        if (ghostNum) gsap.set(ghostNum, { opacity: 0, y: 15 });

        // ── SCRUB-DRIVEN TEXT REVEALS (all reversible) ──
        // Number
        if (number && !reduced) {
          gsap.set(number, { color: "rgba(255,255,255,0.08)" });
          gsap.to(number, {
            color: "rgba(255,255,255,0.4)",
            ease: "none",
            scrollTrigger: {
              trigger: step,
              containerAnimation: scrollTween,
              start: "left 85%",
              end: "left 55%",
              scrub: 0.5,
            },
          });
        }

        // Title: char-by-char
        if (title && !reduced) {
          const titleSplit = SplitText.create(title as HTMLElement, {
            type: "chars",
          });
          gsap.set(titleSplit.chars, { color: "rgba(255,255,255,0.1)" });
          gsap.to(titleSplit.chars, {
            color: "rgba(255,255,255,1)",
            stagger: 0.03,
            duration: 0.3,
            ease: "none",
            scrollTrigger: {
              trigger: step,
              containerAnimation: scrollTween,
              start: "left 80%",
              end: "left 30%",
              scrub: 0.5,
            },
          });
        }

        // Description: char-by-char
        if (desc && !reduced) {
          const descSplit = SplitText.create(desc as HTMLElement, {
            type: "chars",
          });
          gsap.set(descSplit.chars, { color: "rgba(255,255,255,0.08)" });
          gsap.to(descSplit.chars, {
            color: "rgba(255,255,255,0.5)",
            stagger: 0.01,
            duration: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: step,
              containerAnimation: scrollTween,
              start: "left 70%",
              end: "left 20%",
              scrub: 0.5,
            },
          });
        }

        // Keywords
        if (keywordTags.length && !reduced) {
          gsap.set(keywordTags, { opacity: 0.08 });
          gsap.to(keywordTags, {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: step,
              containerAnimation: scrollTween,
              start: "left 60%",
              end: "left 25%",
              scrub: 0.5,
            },
          });
        }

        // ── ENTRANCE: reveal when step enters viewport ──
        ScrollTrigger.create({
          trigger: step,
          containerAnimation: scrollTween,
          start: "left 75%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();

            if (ghostNum) {
              tl.to(
                ghostNum,
                {
                  opacity: 0.08,
                  y: 0,
                  duration: reduced ? 0.01 : 0.8,
                  ease: "power2.out",
                },
                0,
              );
            }

            if (videoContainer && !reduced) {
              tl.to(
                videoContainer,
                {
                  clipPath: "inset(0 0% 0 0)",
                  duration: 0.9,
                  ease: "power2.inOut",
                },
                0.2,
              );
              if (video) {
                tl.to(
                  video,
                  { scale: 1.12, duration: 1.2, ease: "power2.out" },
                  0.2,
                );
              }
            } else if (videoContainer) {
              gsap.set(videoContainer, { clipPath: "inset(0 0% 0 0)" });
            }
          },
        });

        // Preload next video when approaching
        if (i + 1 < TOTAL) {
          ScrollTrigger.create({
            trigger: step,
            containerAnimation: scrollTween,
            start: "center center",
            once: true,
            onEnter: () => {
              const nextVideo = steps[i + 1]?.querySelector(
                ".process-video",
              ) as HTMLVideoElement | null;
              if (nextVideo && nextVideo.preload === "none") {
                nextVideo.preload = "auto";
                nextVideo.load();
              }
            },
          });
        }

        // ── EXIT TRANSITION: dim panels that scroll past ──
        gsap.to(step, {
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: step,
            containerAnimation: scrollTween,
            start: "right 30%",
            end: "right 10%",
            scrub: true,
            toggleActions: "play reverse play reverse",
          },
        });
      });

      // ── PLAY ALL VIDEOS WHEN SECTION ENTERS, KEEP PLAYING ──
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          stepVideos.forEach((vid) => {
            if (!vid) return;
            if (vid.preload === "none") {
              vid.preload = "auto";
              vid.load();
            }
            vid.play().catch(() => {});
          });
        },
        onEnterBack: () => {
          stepVideos.forEach((vid) => {
            if (vid) vid.play().catch(() => {});
          });
        },
      });

      // ── RESIZE HANDLER ──
      const handleResize = (): void => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      data-section
      className="relative w-full overflow-hidden"
    >
      {/* Entrance divider line */}
      <div className="absolute left-0 right-0 top-0 z-10 px-8 md:px-16 lg:px-24">
        <svg
          width="100%"
          height="1"
          viewBox="0 0 1000 1"
          preserveAspectRatio="none"
        >
          <line
            id="process-entrance-divider"
            x1="0"
            y1="0.5"
            x2="1000"
            y2="0.5"
            stroke="white"
            strokeWidth="1"
            opacity="0.15"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* ─── DESKTOP LAYOUT ─── */}
      <div className="hidden md:block">
        {/* Section heading */}
        <div
          className="absolute left-8 top-10 z-10 md:left-16 md:top-14
                     lg:left-24"
          data-process-heading-container
        >
          <p
            className="mb-3 font-body text-[10px] uppercase tracking-[0.25em]
                       text-white/30"
            data-process-label
          >
            Process
          </p>
          <h2
            className="font-display text-3xl font-bold leading-[1.1]
                       text-white md:text-4xl"
            data-process-heading
          >
            How We Work
          </h2>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="relative flex h-dvh items-center"
          style={{ paddingLeft: "8vw" }}
        >
          {processSteps.map((step, i) => (
            <ProcessStep key={step.id} step={step} index={i} />
          ))}

          {/* End spacer — minimal DOM buffer, scroll math ignores this */}
          <div className="shrink-0" style={{ width: "1px" }} />
        </div>

        {/* Counter (fixed during pin, NOT inside track) */}
        <ProcessCounter total={TOTAL} />
      </div>

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="px-8 py-16 md:hidden">
        <p
          className="mb-3 font-body text-[10px] uppercase tracking-[0.25em]
                     text-white/30"
        >
          Process
        </p>
        <h2
          className="mb-10 font-display text-3xl font-bold leading-[1.1]
                     text-white"
        >
          How We Work
        </h2>

        <div className="relative pl-8">
          {/* Vertical connecting line */}
          <div
            id="process-mobile-line"
            className="absolute left-0 top-0 h-full w-[1px] bg-white/[0.12]"
            style={{
              transformOrigin: "top center",
              transform: "scaleY(0)",
            }}
          />

          {processSteps.map((step, i) => (
            <ProcessStepMobile key={step.id} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
