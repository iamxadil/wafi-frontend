import React from "react";

const Sparkline = ({
  values = [],
  width = "100%",
  height = 60,
  stroke = "rgba(255,255,255,0.85)",
  strokeWidth = 2,
  fill = "none",
}) => {
  if (!values.length) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width, height }}
    >
        <defs>
      <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(45,212,191,0.35)" />
        <stop offset="100%" stopColor="rgba(45,212,191,0)" />
      </linearGradient>
    </defs>

    <polygon
      points={`0,100 ${points} 100,100`}
      fill="url(#sparkFill)"
      opacity="0.35"
    />

    </svg>
  );
};

export default Sparkline;
