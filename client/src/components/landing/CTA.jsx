import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

function CTA({ cta }) {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-16 lg:px-16">
      <div
        className="relative flex flex-col items-center overflow-hidden rounded-2xl px-6 py-12 sm:px-12 lg:px-16 text-center max-w-5xl mx-auto"
        style={{
          background:
            "linear-gradient(135deg, #1e1b4b 0%, #13132a 50%, #0c1a2e 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, #7c3aed 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 space-y-4">
          <h2 className="font-[var(--font-headings)] text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            {cta.title}
          </h2>
          <p className="mx-auto max-w-lg text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
            {cta.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to={cta.primaryCta.to}
              className="flex items-center gap-2 rounded-lg bg-[var(--primary)] hover:bg-[#6d28d9] px-6 py-3 text-sm font-medium text-[var(--primary-foreground)] transition-all shadow-lg shadow-[var(--primary)]/20"
            >
              <Rocket size={16} />
              {cta.primaryCta.label}
            </Link>
            <button className="rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-all cursor-pointer">
              {cta.secondaryCta.label}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
