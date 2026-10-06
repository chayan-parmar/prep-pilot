function HowItWorksStep({
  number,
  title,
  description,
  icon,
}) {
  return (
    <article className="relative z-10 flex flex-col items-center gap-4 text-center">
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[#a78bfa]">
          {icon}
        </div>
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--background)] text-xs font-bold text-[var(--primary)]">
          {number}
        </span>
      </div>

      <div>
        <h3 className="mb-1 font-[var(--font-headings)] text-base font-semibold text-[var(--foreground)]">
          {title}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
      </div>
    </article>
  );
}

export default HowItWorksStep;