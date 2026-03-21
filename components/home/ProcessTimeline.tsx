"use client";

interface ProcessTimelineProps {
  total: number;
}

export default function ProcessTimeline({
  total,
}: ProcessTimelineProps): React.ReactElement {
  const panelWidth = 80; // vw per panel
  const totalWidth = panelWidth * total;
  const nodeSpacing = panelWidth;

  return (
    <div
      id="process-timeline"
      className="pointer-events-none absolute left-0 top-[60%] z-[1]"
      style={{ width: `${totalWidth}vw`, height: "20px" }}
    >
      <svg
        width="100%"
        height="20"
        viewBox={`0 0 ${totalWidth * 10} 20`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <line
          id="process-timeline-line"
          x1="0"
          y1="10"
          x2={totalWidth * 10}
          y2="10"
          stroke="white"
          strokeWidth="1"
          opacity="0.18"
          vectorEffect="non-scaling-stroke"
        />

        {Array.from({ length: total }, (_, i) => {
          const cx = nodeSpacing * 10 * i + nodeSpacing * 5;
          return (
            <circle
              key={i}
              className="process-node"
              cx={cx}
              cy="10"
              r="4"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.2"
            />
          );
        })}
      </svg>
    </div>
  );
}
