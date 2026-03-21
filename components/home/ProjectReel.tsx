"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, DrawSVGPlugin, SplitText } from "@/lib/gsap";
import { featuredProjects } from "@/lib/project-data";
import { getLenis } from "@/lib/lenis-instance";
import ProjectReelSlide from "./ProjectReelSlide";
import ProjectReelTextGroup from "./ProjectReelTextGroup";
import ProjectReelProgress from "./ProjectReelProgress";

void ScrollTrigger;
void DrawSVGPlugin;
void SplitText;

const PROJECTS = featuredProjects;
const TOTAL = PROJECTS.length;
const TRANSITION_VH = 350;
const HOLD_VH = 200;
const BUFFER_VH = 60; // dead zone between transitions for clean snapping
const END_HOLD_VH = 160;
const TOTAL_VH =
  HOLD_VH +
  (TOTAL - 1) * (TRANSITION_VH + BUFFER_VH) -
  BUFFER_VH + // no buffer after last transition
  END_HOLD_VH;
const SEGMENT_VH = TRANSITION_VH + BUFFER_VH;
const TRANS_DURATION = TRANSITION_VH / TOTAL_VH;
const SEGMENT_DURATION = SEGMENT_VH / TOTAL_VH;
const HOLD_DURATION = HOLD_VH / TOTAL_VH;
const BUFFER_DURATION = BUFFER_VH / TOTAL_VH;
const END_HOLD_DURATION = END_HOLD_VH / TOTAL_VH;

const SNAP_PROGRESS_POINTS = [
  HOLD_DURATION * 0.5,
  ...Array.from({ length: TOTAL - 1 }, (_, i) =>
    HOLD_DURATION +
    i * SEGMENT_DURATION +
    TRANS_DURATION +
    BUFFER_DURATION * 0.5,
  ),
  1 - END_HOLD_DURATION * 0.5,
];
const AUTO_PAUSE_MS = 4000;
const AUTO_SCROLL_S = 3;

export default function ProjectReel(): React.ReactElement {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const slides = PROJECTS.map((_, i) =>
        document.getElementById(`reel-slide-${i}`),
      );
      const videos = PROJECTS.map((_, i) =>
        document.getElementById(`reel-video-${i}`),
      );
      const textGroups = PROJECTS.map((_, i) =>
        document.getElementById(`reel-text-${i}`),
      );
      const links = PROJECTS.map((_, i) =>
        document.getElementById(`reel-link-${i}`),
      );
      const linkArrows = PROJECTS.map((_, i) =>
        document.getElementById(`reel-link-arrow-${i}`),
      );
      const dividerLines = PROJECTS.map((_, i) =>
        document.getElementById(`reel-divider-line-${i}`),
      );
      const progressDigits = PROJECTS.map((_, i) =>
        document.getElementById(`reel-progress-digit-${i}`),
      );
      const progressFill = document.getElementById("reel-progress-fill");

      if (!slides[0]) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dur = (fraction: number): number =>
        reduced ? 0.01 : TRANS_DURATION * fraction;

      // SplitText: split client names into chars, titles into words
      // SplitText handles overflow masking via mask: "chars"/"words"
      const clientSplits = PROJECTS.map((_, i) => {
        const el = document.getElementById(`reel-client-${i}`);
        if (!el) return null;
        return SplitText.create(el, { type: "chars", mask: "chars" });
      });
      const titleSplits = PROJECTS.map((_, i) => {
        const el = document.getElementById(`reel-title-${i}`);
        if (!el) return null;
        return SplitText.create(el, { type: "chars", mask: "chars" });
      });

      const linkTextSplits = PROJECTS.map((_, i) => {
        const el = document.getElementById(`reel-link-text-${i}`);
        if (!el) return null;
        return SplitText.create(el, { type: "chars", mask: "chars" });
      });

      // Pre-set hidden text elements (projects 1+)
      for (let i = 1; i < TOTAL; i++) {
        const cs = clientSplits[i];
        const ts = titleSplits[i];
        const ls = linkTextSplits[i];
        if (cs) gsap.set(cs.chars, { yPercent: 110 });
        if (ts) gsap.set(ts.chars, { yPercent: 110 });
        if (ls) gsap.set(ls.chars, { yPercent: 110 });
        if (linkArrows[i]) gsap.set(linkArrows[i], { opacity: 0, x: -10, rotate: -45, scale: 0 });
      }

      // Pre-set progress digits: first visible, rest hidden below
      for (let i = 1; i < TOTAL; i++) {
        if (progressDigits[i]) {
          gsap.set(progressDigits[i], {
            y: "100%",
            rotateX: -35,
            opacity: 0,
          });
        }
      }

      // Pre-set all divider lines (including first) to not drawn
      for (let i = 0; i < TOTAL; i++) {
        if (dividerLines[i])
          gsap.set(dividerLines[i], { drawSVG: "0% 0%" });
      }

      let currentActive = 0;
      let autoTimer: ReturnType<typeof setTimeout> | null = null;
      let scrollDebounce: ReturnType<typeof setTimeout> | null = null;

      // ─── ENTRANCE (scroll-driven, not pinned) ───
      // Plays as section scrolls from below viewport into full view.
      const progressEl = document.getElementById("reel-progress");

      if (videos[0]) gsap.set(videos[0], { scale: 1.4, opacity: 0, yPercent: 10 });
      if (textGroups[0]) gsap.set(textGroups[0], { y: 30, opacity: 0 });
      if (progressEl) gsap.set(progressEl, { opacity: 0 });

      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: 0.3,
        },
      });

      // Video zooms out with parallax drift
      if (videos[0]) {
        entranceTl.to(
          videos[0],
          { scale: 1.1, opacity: 1, yPercent: -5, duration: 1, ease: "none" },
          0,
        );
      }

      // Divider draws in during second half
      if (dividerLines[0]) {
        entranceTl.fromTo(
          dividerLines[0],
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 0.4, ease: "none" },
          0.5,
        );
      }

      // Text content fades up in last 40%
      if (textGroups[0]) {
        entranceTl.to(
          textGroups[0],
          { y: 0, opacity: 1, duration: 0.4, ease: "none" },
          0.6,
        );
      }

      // Progress bar fades in last
      if (progressEl) {
        entranceTl.to(
          progressEl,
          { opacity: 1, duration: 0.2, ease: "none" },
          0.8,
        );
      }

      // Play first video when section is 50% into view
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        once: true,
        onEnter: () => {
          const firstVideo = videos[0] as HTMLVideoElement | null;
          if (firstVideo) firstVideo.play().catch(() => {});
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "project-reel-pin",
          trigger: section,
          start: "top top",
          end: `+=${TOTAL_VH}vh`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          refreshPriority: 1,
          snap: {
            // Snap to middle of each buffer zone (dead zone between transitions)
            snapTo: [
              HOLD_DURATION * 0.5, // middle of first hold
              ...Array.from({ length: TOTAL - 1 }, (_, i) =>
                HOLD_DURATION +
                i * SEGMENT_DURATION +
                TRANS_DURATION +
                BUFFER_DURATION * 0.5,
              ),
              1 - END_HOLD_DURATION * 0.5, // middle of end hold
            ],
            duration: { min: 1.8, max: 3.5 },
            delay: 0.3,
            ease: "expo.out",
          },
          onUpdate: (self) => {
            // Calculate active project index
            let idx = 0;
            if (self.progress > HOLD_DURATION + TRANS_DURATION * 0.5) {
              const elapsed =
                self.progress - HOLD_DURATION - TRANS_DURATION * 0.5;
              idx = Math.min(
                Math.floor(elapsed / SEGMENT_DURATION) + 1,
                TOTAL - 1,
              );
            }

            // Progress bar
            if (progressFill) {
              progressFill.style.width = `${self.progress * 100}%`;
            }

            // Video play/pause — brute force: every frame, ensure only
            // the active video plays, all others paused
            for (let vi = 0; vi < TOTAL; vi++) {
              const vid = videos[vi] as HTMLVideoElement | null;
              if (!vid) continue;
              if (vi === idx) {
                if (vid.preload === "none") {
                  vid.preload = "auto";
                  vid.load();
                }
                if (vid.paused) vid.play().catch(() => {});
              } else {
                if (!vid.paused) vid.pause();
              }
            }
            currentActive = idx;

            // Auto-play: restart countdown after scroll settles
            if (scrollDebounce) clearTimeout(scrollDebounce);
            scrollDebounce = setTimeout(scheduleAutoPlay, 400);
          },
          onLeave: () => {
            clearAutoPlay();
            if (scrollDebounce) {
              clearTimeout(scrollDebounce);
              scrollDebounce = null;
            }
          },
          onLeaveBack: () => {
            clearAutoPlay();
            if (scrollDebounce) {
              clearTimeout(scrollDebounce);
              scrollDebounce = null;
            }
          },
        },
      });

      // Hold on first project
      tl.to({}, { duration: HOLD_DURATION });

      // Transitions
      for (let i = 0; i < TOTAL - 1; i++) {
        const startPos = HOLD_DURATION + i * SEGMENT_DURATION;

        const exitSlide = slides[i];
        const enterSlide = slides[i + 1];
        const exitVideo = videos[i];
        const enterVideo = videos[i + 1];
        const exitText = textGroups[i];
        const enterText = textGroups[i + 1];
        const exitClientSplit = clientSplits[i];
        const enterClientSplit = clientSplits[i + 1];
        const exitTitleSplit = titleSplits[i];
        const enterTitleSplit = titleSplits[i + 1];
        const exitLink = links[i];
        const enterLink = links[i + 1];
        const exitLinkTextSplit = linkTextSplits[i];
        const enterLinkTextSplit = linkTextSplits[i + 1];
        const exitLinkArrow = linkArrows[i];
        const enterLinkArrow = linkArrows[i + 1];
        const exitDivider = dividerLines[i];
        const enterDivider = dividerLines[i + 1];
        const exitDigit = progressDigits[i];
        const enterDigit = progressDigits[i + 1];

        // Video crossfade with parallax
        if (exitSlide) {
          tl.to(
            exitSlide,
            { opacity: 0, duration: dur(0.6), ease: "none" },
            startPos + TRANS_DURATION * 0.15,
          );
        }
        if (exitVideo && !reduced) {
          tl.to(
            exitVideo,
            { scale: 1.18, yPercent: -8, duration: dur(0.7), ease: "none" },
            startPos + TRANS_DURATION * 0.1,
          );
        }

        if (enterSlide) {
          tl.fromTo(
            enterSlide,
            { opacity: 0 },
            { opacity: 1, duration: dur(0.6), ease: "none" },
            startPos + TRANS_DURATION * 0.2,
          );
        }
        if (enterVideo && !reduced) {
          tl.fromTo(
            enterVideo,
            { scale: 1.2, yPercent: 6 },
            { scale: 1.1, yPercent: 0, duration: dur(0.7), ease: "none" },
            startPos + TRANS_DURATION * 0.2,
          );
        }

        // Preload next video (2 ahead)
        if (i + 2 < TOTAL && videos[i + 2]) {
          const nextVideo = videos[i + 2] as HTMLVideoElement;
          tl.call(
            () => {
              if (nextVideo && nextVideo.preload === "none") {
                nextVideo.preload = "auto";
                nextVideo.load();
              }
            },
            [],
            startPos,
          );
        }

        // Text group crossfade (staggered via SplitText)
        // Stagger each is computed so total span is fixed regardless of char count
        const CLIENT_STAGGER_SPAN = TRANS_DURATION * 0.08;
        const TITLE_STAGGER_SPAN = TRANS_DURATION * 0.15;

        if (exitClientSplit) {
          const n = exitClientSplit.chars.length;
          tl.to(
            exitClientSplit.chars,
            {
              yPercent: 110,
              duration: dur(0.1),
              stagger: { each: n > 1 ? CLIENT_STAGGER_SPAN / (n - 1) : 0 },
              ease: "none",
            },
            startPos + TRANS_DURATION * 0.05,
          );
        }
        if (exitTitleSplit) {
          const n = exitTitleSplit.chars.length;
          tl.to(
            exitTitleSplit.chars,
            {
              yPercent: 110,
              duration: dur(0.1),
              stagger: { each: n > 1 ? TITLE_STAGGER_SPAN / (n - 1) : 0 },
              ease: "none",
            },
            startPos + TRANS_DURATION * 0.08,
          );
        }

        if (exitLinkTextSplit) {
          const n = exitLinkTextSplit.chars.length;
          tl.to(
            exitLinkTextSplit.chars,
            {
              yPercent: 110,
              duration: dur(0.1),
              stagger: { each: n > 1 ? CLIENT_STAGGER_SPAN / (n - 1) : 0 },
              ease: "none",
            },
            startPos + TRANS_DURATION * 0.03,
          );
        }
        if (exitLinkArrow) {
          tl.to(
            exitLinkArrow,
            { opacity: 0, x: 10, rotate: 45, scale: 0, duration: dur(0.1), ease: "none" },
            startPos + TRANS_DURATION * 0.05,
          );
        }
        if (exitLink) {
          tl.to(
            exitLink,
            { opacity: 0, duration: dur(0.05), ease: "none" },
            startPos + TRANS_DURATION * 0.2,
          );
        }

        // Disable clicks on exiting text group immediately
        if (exitText) {
          tl.set(
            exitText,
            { pointerEvents: "none" },
            startPos + TRANS_DURATION * 0.05,
          );
        }

        if (exitText) {
          tl.to(
            exitText,
            { opacity: 0, duration: dur(0.1), ease: "none" },
            startPos + TRANS_DURATION * 0.35,
          );
        }

        if (exitDivider) {
          tl.to(
            exitDivider,
            { drawSVG: "100% 100%", duration: dur(0.25), ease: "none" },
            startPos + TRANS_DURATION * 0.1,
          );
        }

        if (enterText) {
          tl.fromTo(
            enterText,
            { opacity: 0 },
            { opacity: 1, duration: dur(0.1), ease: "none" },
            startPos + TRANS_DURATION * 0.45,
          );
        }

        if (enterClientSplit) {
          const n = enterClientSplit.chars.length;
          tl.fromTo(
            enterClientSplit.chars,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: dur(0.1),
              stagger: { each: n > 1 ? CLIENT_STAGGER_SPAN / (n - 1) : 0 },
              ease: "none",
            },
            startPos + TRANS_DURATION * 0.55,
          );
        }
        if (enterTitleSplit) {
          const n = enterTitleSplit.chars.length;
          tl.fromTo(
            enterTitleSplit.chars,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: dur(0.1),
              stagger: { each: n > 1 ? TITLE_STAGGER_SPAN / (n - 1) : 0 },
              ease: "none",
            },
            startPos + TRANS_DURATION * 0.58,
          );
        }

        if (enterLink) {
          tl.fromTo(
            enterLink,
            { opacity: 0 },
            { opacity: 1, duration: dur(0.05), ease: "none" },
            startPos + TRANS_DURATION * 0.65,
          );
        }
        if (enterLinkTextSplit) {
          const n = enterLinkTextSplit.chars.length;
          tl.fromTo(
            enterLinkTextSplit.chars,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: dur(0.1),
              stagger: { each: n > 1 ? CLIENT_STAGGER_SPAN / (n - 1) : 0 },
              ease: "none",
            },
            startPos + TRANS_DURATION * 0.68,
          );
        }
        if (enterLinkArrow) {
          tl.fromTo(
            enterLinkArrow,
            { opacity: 0, x: -10, rotate: -45, scale: 0 },
            { opacity: 1, x: 0, rotate: 0, scale: 1, duration: dur(0.12), ease: "none" },
            startPos + TRANS_DURATION * 0.95,
          );
        }

        // Re-enable clicks on entering text group after fully visible
        if (enterText) {
          tl.set(
            enterText,
            { pointerEvents: "" },
            startPos + TRANS_DURATION * 0.85,
          );
        }

        if (enterDivider) {
          tl.fromTo(
            enterDivider,
            { drawSVG: "0% 0%" },
            { drawSVG: "0% 100%", duration: dur(0.25), ease: "none" },
            startPos + TRANS_DURATION * 0.55,
          );
        }

        // Progress digit barrel roll
        if (exitDigit) {
          tl.to(
            exitDigit,
            {
              opacity: 0,
              ...(reduced ? {} : { y: "-100%", rotateX: 35 }),
              duration: dur(0.3),
              ease: "none",
            },
            startPos + TRANS_DURATION * 0.4,
          );
        }
        if (enterDigit) {
          tl.fromTo(
            enterDigit,
            { opacity: 0, ...(reduced ? {} : { y: "100%", rotateX: -35 }) },
            {
              opacity: 1,
              ...(reduced ? {} : { y: "0%", rotateX: 0 }),
              duration: dur(0.3),
              ease: "none",
            },
            startPos + TRANS_DURATION * 0.55,
          );
        }

        // Buffer zone: dead space for clean snapping (no animations here)
        if (i < TOTAL - 2) {
          tl.to(
            {},
            { duration: BUFFER_DURATION },
            startPos + TRANS_DURATION,
          );
        }
      }

      // End hold on last project
      tl.to({}, { duration: END_HOLD_DURATION });

      // Keep active video playing even after scroll stops (snap settled)
      let inView = false;
      let videoRaf: number | null = null;

      const ensureVideoPlays = (): void => {
        if (!inView) return;
        const vid = videos[currentActive] as HTMLVideoElement | null;
        if (vid && vid.paused) vid.play().catch(() => {});
        videoRaf = requestAnimationFrame(ensureVideoPlays);
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => {
          inView = false;
          if (videoRaf) cancelAnimationFrame(videoRaf);
          videos.forEach((v) => {
            if (v) (v as HTMLVideoElement).pause();
          });
        },
        onLeaveBack: () => {
          inView = false;
          if (videoRaf) cancelAnimationFrame(videoRaf);
          videos.forEach((v) => {
            if (v) (v as HTMLVideoElement).pause();
          });
        },
        onEnter: () => {
          inView = true;
          ensureVideoPlays();
        },
        onEnterBack: () => {
          inView = true;
          ensureVideoPlays();
        },
      });

      // ─── AUTO-PLAY ───
      function advanceAutoPlay(): void {
        const lenis = getLenis();
        const pinST = ScrollTrigger.getById("project-reel-pin");
        if (!lenis || !pinST || !pinST.isActive) return;

        const nextIdx = (currentActive + 1) % TOTAL;
        const nextProgress = SNAP_PROGRESS_POINTS[nextIdx];
        const target = pinST.start + nextProgress * (pinST.end - pinST.start);

        const indicator = document.getElementById("reel-autoplay-indicator");
        if (indicator) gsap.to(indicator, { opacity: 1, duration: 0.3 });

        lenis.scrollTo(target, {
          duration: nextIdx === 0 ? 2.0 : AUTO_SCROLL_S,
          easing: (t: number) =>
            t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
        });
      }

      function scheduleAutoPlay(): void {
        clearAutoPlay();
        const pinST = ScrollTrigger.getById("project-reel-pin");
        if (!pinST || !pinST.isActive) return;
        autoTimer = setTimeout(advanceAutoPlay, AUTO_PAUSE_MS);
      }

      function clearAutoPlay(): void {
        if (autoTimer) {
          clearTimeout(autoTimer);
          autoTimer = null;
        }
        const indicator = document.getElementById("reel-autoplay-indicator");
        if (indicator) gsap.to(indicator, { opacity: 0, duration: 0.2 });
      }

      // User input immediately cancels pending auto-play;
      // Lenis cancels any in-progress programmatic scrollTo on its own.
      function onUserInput(): void {
        const pinST = ScrollTrigger.getById("project-reel-pin");
        if (pinST && pinST.isActive) clearAutoPlay();
      }

      window.addEventListener("wheel", onUserInput, { passive: true });
      window.addEventListener("touchmove", onUserInput, { passive: true });

      // Cleanup: revert SplitText splits + auto-play
      return () => {
        clientSplits.forEach((s) => s?.revert());
        titleSplits.forEach((s) => s?.revert());
        linkTextSplits.forEach((s) => s?.revert());
        if (videoRaf) cancelAnimationFrame(videoRaf);
        clearAutoPlay();
        if (scrollDebounce) clearTimeout(scrollDebounce);
        window.removeEventListener("wheel", onUserInput);
        window.removeEventListener("touchmove", onUserInput);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="project-reel"
      className="relative h-dvh w-full overflow-hidden"
    >
      {/* Video layers */}
      {PROJECTS.map((project, i) => (
        <ProjectReelSlide
          key={project.id}
          project={project}
          index={i}
          isFirst={i === 0}
        />
      ))}

      {/* Dark overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(6, 6, 6, 0.3) 0%,
            rgba(6, 6, 6, 0) 30%,
            rgba(6, 6, 6, 0) 60%,
            rgba(6, 6, 6, 0.4) 100%
          )`,
        }}
      />

      {/* Text groups — one per project, stacked */}
      {PROJECTS.map((project, i) => (
        <ProjectReelTextGroup
          key={project.id}
          project={project}
          index={i}
          isFirst={i === 0}
        />
      ))}

      {/* Progress bar */}
      <ProjectReelProgress total={TOTAL} />
    </section>
  );
}
