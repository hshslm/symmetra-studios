"use client";

import { useState, useEffect, useRef } from "react";

interface AssetLoaderOptions {
  /** URLs of assets to preload. Images and videos. */
  assets: string[];
  /** Called when all assets are loaded. */
  onComplete?: () => void;
  /** Minimum time (ms) the loader should display, even if assets load fast.
      This ensures the splash animation has time to play. Default 3000. */
  minimumDuration?: number;
}

interface AssetLoaderState {
  /** 0-100 progress percentage */
  progress: number;
  /** Whether all assets are loaded AND minimum duration has passed */
  isComplete: boolean;
}

export function useAssetLoader(options: AssetLoaderOptions): AssetLoaderState {
  const { assets, onComplete, minimumDuration = 3000 } = options;
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef(Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    if (assets.length === 0) {
      setProgress(100);
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, minimumDuration - elapsed);
      setTimeout(() => {
        setIsComplete(true);
        onComplete?.();
      }, remaining);
      return;
    }

    let loaded = 0;
    const total = assets.length;

    const updateProgress = (): void => {
      loaded++;
      const pct = Math.round((loaded / total) * 100);
      setProgress(pct);

      if (loaded >= total && !completedRef.current) {
        completedRef.current = true;
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, minimumDuration - elapsed);
        setTimeout(() => {
          setIsComplete(true);
          onComplete?.();
        }, remaining);
      }
    };

    assets.forEach((url) => {
      const isVideo = /\.(mp4|webm|mov)$/i.test(url);

      if (isVideo) {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.addEventListener("canplaythrough", updateProgress, {
          once: true,
        });
        video.addEventListener("error", updateProgress, { once: true });
        video.src = url;
        video.load();
      } else {
        const img = new Image();
        img.onload = updateProgress;
        img.onerror = updateProgress;
        img.src = url;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { progress, isComplete };
}
