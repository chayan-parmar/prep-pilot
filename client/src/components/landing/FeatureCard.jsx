const iconColors = {
  purple: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
  teal: "bg-[var(--card)] text-[var(--accent)]",
  green: "bg-[var(--card)] text-[var(--success)]",
  amber: "bg-[var(--card)] text-[var(--warning)]",
};

function FeatureCard({ icon, color = "purple", title, description }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--primary)]">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-md ${iconColors[color]}`}
      >
        {icon}
      </div>

      <div>
        <h3 className="mb-1 font-[var(--font-headings)] text-base font-semibold text-[var(--foreground)]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
    </article>
  );
}

export default FeatureCard;
