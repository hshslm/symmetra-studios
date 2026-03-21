"use client";

interface ProjectReelNumberProps {
  total: number;
}

export default function ProjectReelNumber({
  total,
}: ProjectReelNumberProps): React.ReactElement {
  return (
    <div
      id="reel-number-container"
      className="absolute right-8 top-1/2 md:right-16 lg:right-24"
      style={{
        height: "180px",
        marginTop: "-90px",
        perspective: "500px",
        transformStyle: "preserve-3d",
      }}
      aria-hidden="true"
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          id={`reel-number-${i}`}
          className="absolute inset-0 flex select-none items-center justify-center font-display text-[80px] font-bold leading-none md:text-[120px] lg:text-[150px]"
          style={{
            color: "#1A1A1A",
            opacity: i === 0 ? 1 : 0,
          }}
        >
          {String(i + 1).padStart(2, "0")}
        </div>
      ))}
    </div>
  );
}
