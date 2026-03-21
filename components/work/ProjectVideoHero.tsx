"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis-instance";
import { useCursorState } from "@/hooks/useCursorState";
import type { Project } from "@/lib/projects-data";

void ScrollTrigger;

interface ProjectVideoHeroProps {
  project: Project;
}

export default function ProjectVideoHero({
  project,
}: ProjectVideoHeroProps): React.ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const { setState: setCursorState } = useCursorState();

  // ── Sync cursor shape when play state changes ──
  useEffect(() => {
    setCursorState({
      shape: isPlaying ? "pause" : "play",
      label: isPlaying ? "Pause" : "Play",
    });
  }, [isPlaying, setCursorState]);

  // ── Autoplay muted on mount ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => setIsPlaying(false));
  }, []);

  // ── Format time ──
  const formatTime = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  // ── Toggle play/pause ──
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // ── Toggle mute ──
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  // ── Progress bar update (direct DOM, no re-renders) ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const update = (): void => {
      const fill = progressFillRef.current;
      const time = timeRef.current;
      if (!fill) return;

      const pct = (video.currentTime / (video.duration || 1)) * 100;
      fill.style.width = `${pct}%`;

      if (time) {
        time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 0)}`;
      }
    };

    video.addEventListener("timeupdate", update);
    return () => video.removeEventListener("timeupdate", update);
  }, [formatTime]);

  // ── Seek on progress bar click ──
  const handleSeek = useCallback((e: React.MouseEvent) => {
    const video = videoRef.current;
    const track = progressTrackRef.current;
    if (!video || !track) return;

    const rect = track.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * (video.duration || 0);
  }, []);

  // ── Keyboard: Space = play/pause, M = mute ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent): void => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;

      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [togglePlay, toggleMute]);

  // ── Hero entrance animation ──
  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const bottomBar = section.querySelector("[data-hero-bottom]");
      const controls = section.querySelector("[data-hero-controls]");

      if (reduced) {
        if (bottomBar) gsap.set(bottomBar, { opacity: 1, y: 0 });
        if (controls) gsap.set(controls, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.6 });

      // Video zoom settle
      if (video) {
        gsap.set(video, { scale: 1.1 });
        tl.to(video, { scale: 1, duration: 1.4, ease: "power2.out" }, 0);
      }

      // Bottom bar slide up
      if (bottomBar) {
        gsap.set(bottomBar, { opacity: 0, y: 20 });
        tl.to(
          bottomBar,
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          0.5,
        );
      }

      // Controls fade in
      if (controls) {
        gsap.set(controls, { opacity: 0 });
        tl.to(
          controls,
          { opacity: 1, duration: 0.4, ease: "power2.out" },
          0.6,
        );
      }

      // Fade bottom bar on scroll — explicit fromTo so scroll-back restores
      if (bottomBar) {
        gsap.fromTo(
          bottomBar,
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "50px top",
              end: "150px top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh w-full cursor-pointer overflow-hidden"
      onClick={togglePlay}
      data-cursor={isPlaying ? "pause" : "play"}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="auto"
        poster={project.posterSrc}
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src={project.videoSrc} type="video/mp4" />
      </video>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, rgba(6,6,6,0.4) 0%, rgba(6,6,6,0) 35%),
            linear-gradient(to top, rgba(6,6,6,0.85) 0%, rgba(6,6,6,0) 50%)
          `,
        }}
      />

      {/* Paused overlay — subtle darkening only, play icon is on cursor */}
      {!isPlaying && (
        <div
          className="pointer-events-none absolute inset-0 bg-black/20
                     transition-opacity duration-300"
        />
      )}

      {/* Bottom info bar — 3 columns: title | details | mute */}
      <div
        data-hero-bottom
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10
                   grid grid-cols-3 items-end px-8 pb-14 md:px-16
                   md:pb-16 lg:px-24"
      >
        {/* Left: title */}
        <div>
          <p
            className="mb-3 font-body text-[11px] uppercase tracking-[0.25em]
                       text-white/45"
          >
            {project.client} / {project.categoryLabel}
          </p>
          <h1
            className="font-display text-4xl font-bold leading-[1.0] text-white
                       sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {project.title}
          </h1>
        </div>

        {/* Center: details indicator */}
        <div className="hidden flex-col items-center gap-2 md:flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const lenis = getLenis();
              const info = document.querySelector("[data-info-section]");
              if (lenis && info) {
                lenis.scrollTo(info as HTMLElement, {
                  offset: -40,
                  duration: 1.2,
                });
              } else if (info) {
                info.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="pointer-events-auto cursor-pointer font-body text-[9px]
                       uppercase tracking-[0.3em] text-white/35
                       transition-colors duration-300 hover:text-white/60"
            data-cursor="pointer"
          >
            Details
          </button>
          <div className="relative h-8 w-px overflow-hidden bg-white/15">
            <div className="animate-scroll-line h-1/2 w-full bg-white/40" />
          </div>
        </div>

        {/* Right: mute */}
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="pointer-events-auto text-white/35
                       transition-colors duration-300 hover:text-white/70"
            data-cursor="pointer"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5z" />
                <line x1="11" y1="5" x2="15" y2="11" strokeLinecap="round" />
                <line x1="15" y1="5" x2="11" y2="11" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              >
                <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5z" />
                <path d="M11 5.5a3 3 0 010 5" />
                <path d="M12.5 3.5a6 6 0 010 9" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── CONTROLS BAR (bottom edge) ── */}
      <div
        data-hero-controls
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20"
      >
        {/* Timeline seeker — full width at very bottom */}
        <div
          ref={progressTrackRef}
          className="group/seek relative h-[5px] w-full cursor-pointer
                     bg-white/10 transition-all duration-200
                     pointer-events-auto hover:h-[8px]"
          onClick={(e) => {
            e.stopPropagation();
            handleSeek(e);
          }}
          data-cursor="pointer"
        >
          <div
            ref={progressFillRef}
            className="pointer-events-none absolute left-0 top-0 h-full
                       bg-white/50 transition-colors duration-200
                       group-hover/seek:bg-white/70"
            style={{ width: "0%" }}
          />
          {/* Hover: show time tooltip */}
          <div
            className="pointer-events-none absolute -top-10 left-2 opacity-0
                       transition-opacity duration-200
                       group-hover/seek:opacity-100"
          >
            <span
              ref={timeRef}
              className="rounded-sm bg-black/60 px-2.5 py-1 font-body
                         text-[12px] tabular-nums tracking-wider text-white/80
                         backdrop-blur-sm"
            >
              0:00 / 0:00
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
