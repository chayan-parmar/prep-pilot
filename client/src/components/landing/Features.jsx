import {
  BarChart3,
  Brain,
  Code2,
  FileSearch,
  Map,
  Video,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const featureIcons = {
  analytics: <BarChart3 size={20} />,
  coding: <Code2 size={20} />,
  interview: <Video size={20} />,
  mentor: <Brain size={20} />,
  resume: <FileSearch size={20} />,
  roadmap: <Map size={20} />,
};

function Features({ section }) {
  return (
    <section id="features" className="bg-[var(--background)] px-6 py-16 lg:px-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {section.eyebrow}
          </span>
          <h2 className="font-[var(--font-headings)] text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            {section.title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[var(--muted-foreground)]">
            {section.description}
          </p>
        </div>
    
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {section.features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              icon={featureIcons[feature.icon]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
