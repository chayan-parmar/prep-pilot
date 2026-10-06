import {
  Cpu,
  Dumbbell,
  Trophy,
  Upload,
} from "lucide-react";

import HowItWorksStep from "./HowItWorksStep";

const stepIcons = {
  analysis: <Cpu size={24} />,
  hired: <Trophy size={24} />,
  practice: <Dumbbell size={24} />,
  upload: <Upload size={24} />,
};

function HowItWorks({ section }) {
  return (
    <section id="how-it-works" className="border-t border-[var(--border)] bg-[var(--card)] px-6 py-16 lg:px-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="mb-10 text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {section.eyebrow}
          </span>
          <h2 className="font-[var(--font-headings)] text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            {section.title}
          </h2>
        </div>

        <div className="relative mx-auto w-full max-w-6xl grid gap-8 lg:grid-cols-4">
          <div className="absolute top-7 left-32 right-32 z-0 hidden h-px bg-[var(--border)] lg:block" />
          {section.steps.map((step) => (
            <HowItWorksStep
              key={step.number}
              {...step}
              icon={stepIcons[step.icon]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
