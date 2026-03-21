"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface HeroVideoProps {
  /** Path to video file. Default uses local dev asset. */
  src?: string;
  /** Path to poster image shown before video loads. */
  poster?: string;
}

export default function HeroVideo({
  src = "/videos/showreel.mp4",
  poster = "/videos/showreel-poster.webp",
}: HeroVideoProps): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure autoplay works (some browsers block without user gesture)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fadeIn = (): void => {
      gsap.to(video, { opacity: 1, duration: 1.2, ease: "power2.out" });
    };

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(fadeIn).catch(fadeIn);
    }
  }, []);

  return (
    <video
      ref={videoRef}
      id="hero-video"
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity: 0, filter: "brightness(0.85) contrast(1.1)" }}
      muted
      autoPlay
      loop
      playsInline
      poster={poster}
      preload="auto"
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
