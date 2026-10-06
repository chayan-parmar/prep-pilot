function StatBadge({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-[var(--font-headings)] text-2xl font-bold text-[var(--foreground)]">
        {value}
      </span>
      <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
    </div>
  );
}

export default StatBadge;
