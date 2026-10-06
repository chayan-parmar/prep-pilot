import React from "react";

function ReadinessDonut({ score = 72, targetScore = 90 }) {
  const radius = 52;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      {/* Donut Chart Ring */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <defs>
            <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          {/* Background circle track */}
          <circle
            stroke="#1c1c34"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Active progress arc */}
          <circle
            stroke="url(#readinessGrad)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-headings font-extrabold text-white leading-none">
            {score}%
          </span>
          <span className="text-[10px] font-semibold text-[#10b981] mt-0.5">
            Good Job!
          </span>
        </div>
      </div>

      {/* Text Message & Action Button */}
      <div className="space-y-4 flex-1 w-full">
        <p className="text-xs text-[#8e8ea8] leading-relaxed">
          Keep practicing to reach <span className="text-white font-medium">{targetScore}%+</span>
        </p>

        <button className="w-full py-3 px-6 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-[#7c3aed]/30 cursor-pointer">
          Take Mock Interview
        </button>
      </div>
    </div>
  );
}

export default ReadinessDonut;
