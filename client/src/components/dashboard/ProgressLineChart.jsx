import React from "react";

function ProgressLineChart({ data = [] }) {
  const days = data.map((d) => d.day);
  const scores = data.map((d) => d.score);

  // If no data at all, show a placeholder message
  const hasAnyData = scores.some((s) => s !== null);

  if (!hasAnyData || data.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-xs text-[#7e7e9a]">
        <div className="text-center space-y-2">
          <div className="text-2xl">📊</div>
          <p>Take quizzes to see your progress chart</p>
        </div>
      </div>
    );
  }

  // Map scores to SVG coordinates (400x120 space)
  const svgWidth = 420;
  const svgHeight = 130;
  const padding = 30;
  const chartWidth = svgWidth - padding * 2;

  const maxScore = 100;
  const minY = 20;
  const maxY = 110;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
    const scoreVal = d.score !== null ? d.score : 0;
    const y = maxY - ((scoreVal / maxScore) * (maxY - minY));
    return { x, y, hasData: d.score !== null };
  });

  // Build a smooth line through points that have data
  const validPoints = points.filter((p) => p.hasData);

  let d = "";
  if (validPoints.length >= 2) {
    d = `M ${validPoints[0].x},${validPoints[0].y}`;
    for (let i = 1; i < validPoints.length; i++) {
      const prev = validPoints[i - 1];
      const curr = validPoints[i];
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpx2 = prev.x + (2 * (curr.x - prev.x)) / 3;
      d += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }
  } else if (validPoints.length === 1) {
    d = `M ${validPoints[0].x - 10},${validPoints[0].y} L ${validPoints[0].x + 10},${validPoints[0].y}`;
  }

  // Area fill path
  const areaD = validPoints.length >= 2
    ? `${d} L ${validPoints[validPoints.length - 1].x},${maxY} L ${validPoints[0].x},${maxY} Z`
    : "";

  return (
    <div className="w-full space-y-4">
      <div className="w-full h-32 relative overflow-hidden">
        <svg viewBox="0 0 420 130" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          {areaD && <path d={areaD} fill="url(#chartAreaGrad)" />}

          {/* Smooth Curved Line */}
          {d && (
            <path
              d={d}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Data Nodes */}
          {validPoints.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#ffffff"
                stroke="#7c3aed"
                strokeWidth="2.5"
              />
              {/* Score label */}
              <text
                x={pt.x}
                y={pt.y - 10}
                textAnchor="middle"
                fill="#a78bfa"
                fontSize="9"
                fontWeight="600"
              >
                {scores[points.indexOf(pt)] ?? ""}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Days X-Axis Labels */}
      <div className="flex justify-between px-2 text-[11px] font-medium text-[#7e7e9a]">
        {days.map((day, i) => (
          <span key={i}>{day}</span>
        ))}
      </div>
    </div>
  );
}

export default ProgressLineChart;
