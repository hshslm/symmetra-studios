import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Observer } from "gsap/Observer";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  Flip,
  Draggable,
  InertiaPlugin,
  Observer,
  DrawSVGPlugin,
  MorphSVGPlugin
);

export {
  gsap,
  ScrollTrigger,
  SplitText,
  Flip,
  Draggable,
  InertiaPlugin,
  Observer,
  DrawSVGPlugin,
  MorphSVGPlugin,
};
