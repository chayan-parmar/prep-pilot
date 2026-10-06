import PricingCard from "./PricingCard";

function Pricing({ section }) {
  return (
    <section id="pricing" className="bg-[var(--background)] px-6 py-16 lg:px-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="mb-10 text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {section.eyebrow}
          </span>
          <h2 className="font-[var(--font-headings)] text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            {section.title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)]">
            {section.description}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 w-full">
          {section.plans.map((plan) => (
            <PricingCard key={plan.title} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
