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
          linear-gradient(
            to bottom,
            rgba(6, 6, 6, 0.5) 0%,
            rgba(6, 6, 6, 0.1) 35%,
            rgba(6, 6, 6, 0.1) 65%,
            rgba(6, 6, 6, 0.7) 100%
          )
        `,
      }}
      aria-hidden="true"
    />
  );
}
