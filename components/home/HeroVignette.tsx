interface HeroVignetteProps {
  /** Additional CSS classes. */
  className?: string;
}

export default function HeroVignette({
  className = "",
}: HeroVignetteProps): React.ReactElement {
  return (
    <div
      id="hero-vignette"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `
          radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 30%,
            rgba(6, 6, 6, 0.4) 60%,
            rgba(6, 6, 6, 0.85) 100%
          )
        `,
        opacity: 0.6,
      }}
      aria-hidden="true"
    />
  );
}
