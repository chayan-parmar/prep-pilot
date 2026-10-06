import {
  Bot,
  Code2,
  PlayCircle,
  Rocket,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import StatBadge from "./StatBadge";

const floatingIcons = {
  readiness: <TrendingUp className="text-[var(--success)]" size={14} />,
  code: <Code2 className="text-[var(--accent)]" size={14} />,
  mock: <Zap className="text-[var(--primary-foreground)]" size={14} />,
};

function HeroSection({ hero }) {
  return (
    <section className="relative flex flex-col items-center justify-between overflow-hidden bg-[var(--background)] px-6 pb-16 pt-20 lg:flex-row lg:px-16">
      <div
        className="absolute left-1/3 top-0 h-96 w-96 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
        }}
      />

      <div className="z-10 flex max-w-xl flex-col gap-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5">
          <Sparkles className="text-[var(--accent)]" size={14} />
          <span className="text-xs font-medium text-[var(--accent)]">
            {hero.eyebrow}
          </span>
        </div>

        <h1 className="font-[var(--font-headings)] text-4xl font-bold leading-tight text-[var(--foreground)] lg:text-5xl">
          {hero.title}
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {hero.highlightedTitle}
          </span>
        </h1>

        <p className="text-base leading-relaxed text-[var(--muted-foreground)]">
          {hero.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Link
            to={hero.primaryCta.to}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--primary-foreground)]"
          >
            <Rocket size={16} />
            {hero.primaryCta.label}
          </Link>
          <button className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--foreground)]">
            <PlayCircle size={16} />
            {hero.secondaryCta.label}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-10 border-t border-[var(--border)] pt-4">
          {hero.stats.map((stat) => (
            <StatBadge key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-14 flex h-[400px] w-full items-center justify-center lg:mt-0 lg:w-[480px]">

        {/* Main Analysis Card */}
        <div className="absolute right-10 top-5 flex w-72 flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)]">
              <span className="text-xs font-bold text-[var(--primary-foreground)]">
                AI
              </span>
            </div>

            <span className="font-[var(--font-headings)] text-base font-semibold text-[var(--foreground)]">
              {hero.analysis.title}
            </span>
          </div>

          {/* Progress Rows */}
          <div className="flex flex-col gap-1">
            {hero.analysis.rows.map((row) => (
              <ProgressRow key={row.label} {...row} />
            ))}
          </div>

          {/* AI Insight */}
          <div className="flex items-center gap-3 rounded-lg bg-[var(--secondary)] p-2">
            <Bot
              className="text-[var(--secondary-foreground)]"
              size={18}
            />

            <span className="text-sm text-[var(--secondary-foreground)]">
              {hero.analysis.insight}
            </span>
          </div>

        </div>

        {/* Floating Cards */}
        {hero.floatingCards.map((card) => (
          <FloatingCard
            key={card.label}
            className={card.className}
          >
            {floatingIcons[card.type]}

            <span
              className={`text-xs font-medium ${card.type === "mock"
                  ? "text-[var(--primary-foreground)]"
                  : "text-[var(--foreground)]"
                }`}
            >
              {card.label}
            </span>
          </FloatingCard>
        ))}

      </div>
    </section>
  );
}

function ProgressRow({ label, value, color }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
        <span className="text-xs font-medium" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className="h-full rounded-full"
          style={{ width: value, background: color }}
        />
      </div>
    </>
  );
}

function FloatingCard({ className, children }) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 ${className}`}
    >
      {children}
    </div>
  );
}

export default HeroSection;
