// GSAP horizontalLoop helper — seamless infinite x-axis loop.
// Adapted from https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop/
// Supports auto-play, drag with momentum (InertiaPlugin), pause/resume,
// and responsive widths via xPercent.

import { gsap, Draggable, InertiaPlugin } from "./gsap";

void Draggable;
void InertiaPlugin;

interface HorizontalLoopConfig {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  snap?: boolean | number | ((value: number) => number);
  reversed?: boolean;
  draggable?: boolean;
  paddingRight?: number;
}

export interface HorizontalLoopTimeline extends gsap.core.Timeline {
  next: (vars?: gsap.TweenVars) => gsap.core.Tween;
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween;
  current: () => number;
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween;
  times: number[];
  draggable?: Draggable;
}

export function horizontalLoop(
  items: Element[],
  config: HorizontalLoopConfig = {},
): HorizontalLoopTimeline {
  items = gsap.utils.toArray(items);

  const tl = gsap.timeline({
    repeat: config.repeat ?? -1,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  }) as HorizontalLoopTimeline;

  const length = items.length;
  const startX = (items[0] as HTMLElement).offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap =
    config.snap === false
      ? (v: number) => v
      : gsap.utils.snap((config.snap as number) || 1);

  let totalWidth: number;
  let curX: number;
  let distanceToStart: number;
  let distanceToLoop: number;
  let item: HTMLElement;
  let i: number;

  gsap.set(items, {
    xPercent: (idx, el: HTMLElement) => {
      const w = (widths[idx] = parseFloat(
        gsap.getProperty(el, "width", "px") as string,
      ));
      xPercents[idx] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px") as string) / w) * 100 +
          (gsap.getProperty(el, "xPercent") as number),
      );
      return xPercents[idx];
    },
  });

  gsap.set(items, { x: 0 });

  totalWidth =
    (items[length - 1] as HTMLElement).offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    (items[length - 1] as HTMLElement).offsetWidth *
      (gsap.getProperty(items[length - 1], "scaleX") as number) +
    (config.paddingRight
      ? parseFloat(String(config.paddingRight))
      : 0);

  for (i = 0; i < length; i++) {
    item = items[i] as HTMLElement;
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart +
      widths[i] * (gsap.getProperty(item, "scaleX") as number);

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0,
    ).fromTo(
      item,
      {
        xPercent: snap(
          ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
        ),
      },
      {
        xPercent: xPercents[i],
        duration:
          (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
        immediateRender: false,
      },
      distanceToLoop / pixelsPerSecond,
    ).add("label" + i, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(
    index: number,
    vars: gsap.TweenVars = {},
  ): gsap.core.Tween {
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    const newIndex = gsap.utils.wrap(0, length, index);
    const time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time + (index > curIndex ? tl.duration() : 0), vars);
  }

  tl.next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars ?? {});
  tl.previous = (vars?: gsap.TweenVars) =>
    toIndex(curIndex - 1, vars ?? {});
  tl.current = () => curIndex;
  tl.toIndex = (index: number, vars?: gsap.TweenVars) =>
    toIndex(index, vars ?? {});
  tl.times = times;
  tl.progress(1, true).progress(0, true);

  if (config.reversed) {
    tl.vars.onReverseComplete?.();
    tl.reverse();
  }

  if (config.draggable && typeof Draggable === "function") {
    const proxy = document.createElement("div");
    const wrap = gsap.utils.wrap(0, 1);
    let ratio: number;
    let startProgress: number;

    const populateWidths = (): void => {
      widths.length = 0;
      items.forEach((el) => {
        widths.push(
          parseFloat(gsap.getProperty(el, "width", "px") as string),
        );
      });
    };

    const getTotalWidth = (): number =>
      widths.reduce((sum, w, idx) => {
        const scale = gsap.getProperty(items[idx], "scaleX") as number;
        return sum + w * scale;
      }, 0) +
      (config.paddingRight
        ? parseFloat(String(config.paddingRight)) * length
        : 0);

    const align = function (this: Draggable): void {
      const p = this.x / totalWidth;
      tl.progress(wrap(startProgress + p * ratio));
    };

    const syncIndex = (): void => {
      curIndex = Math.round(tl.progress() * items.length);
    };

    const draggable = Draggable.create(proxy, {
      trigger: (items[0] as HTMLElement).parentNode as Element,
      type: "x",
      onPress() {
        startProgress = tl.progress();
        tl.progress(0);
        populateWidths();
        totalWidth = getTotalWidth();
        ratio = 1 / totalWidth;
        tl.progress(startProgress);
      },
      onDrag: align,
      onThrowUpdate: align,
      inertia: true,
      // No snap — continuous ribbon, not a carousel.
      // Logos coast freely after fling, auto-scroll resumes.
      onRelease: syncIndex,
      onThrowComplete: () => {
        gsap.set(proxy, { x: 0 });
        syncIndex();
      },
    })[0];

    tl.draggable = draggable;
  }

  return tl;
}
