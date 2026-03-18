"use client";

import { useState } from "react";

interface TextSlideProps {
  /** The text to display */
  text: string;
  /** Delay between each letter in ms. Default 20. */
  letterStagger?: number;
  /** Transition duration per letter in ms. Default 400. */
  duration?: number;
  /** CSS perspective value for the 3D barrel roll. Default '150px'. */
  perspective?: string;
  /** Rotation angle in degrees for the barrel roll. Default 45. */
  rotation?: number;
  /** Additional className */
  className?: string;
  /** When provided, controls hover state externally (parent-triggered). Omit for self-triggered. */
  isHovered?: boolean;
}

export default function TextSlide({
  text,
  letterStagger = 20,
  duration = 400,
  perspective = "150px",
  rotation = 45,
  className = "",
  isHovered,
}: TextSlideProps): React.ReactElement {
  const [internalHovered, setInternalHovered] = useState(false);
  const active = isHovered ?? internalHovered;
  const selfTriggered = isHovered === undefined;
  const chars = text.split("");

  const easing = "cubic-bezier(0.76, 0, 0.24, 1)";

  return (
    <span
      className={`inline-flex ${className}`}
      aria-label={text}
      {...(selfTriggered && {
        onMouseEnter: () => setInternalHovered(true),
        onMouseLeave: () => setInternalHovered(false),
      })}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            position: "relative",
            overflow: "hidden",
            perspective,
          }}
        >
          {/* Exit letter — direct child of perspective element */}
          <span
            className="will-change-transform"
            style={{
              display: "inline-block",
              transformOrigin: "bottom center",
              transform: active
                ? `translateY(-100%) rotateX(${rotation}deg)`
                : "translateY(0%) rotateX(0deg)",
              transition: `transform ${duration}ms ${easing} ${i * letterStagger}ms`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>

          {/* Enter letter — direct child of perspective element */}
          <span
            aria-hidden="true"
            className="will-change-transform"
            style={{
              display: "inline-block",
              position: "absolute",
              top: 0,
              left: 0,
              transformOrigin: "top center",
              transform: active
                ? "translateY(0%) rotateX(0deg)"
                : `translateY(100%) rotateX(-${rotation}deg)`,
              transition: `transform ${duration}ms ${easing} ${i * letterStagger}ms`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}
