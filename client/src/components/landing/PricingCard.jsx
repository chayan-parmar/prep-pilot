import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

function PricingCard({
  title,
  price,
  description,
  features,
  variant,
  ctaLabel,
}) {
  const isFeatured = variant === "featured";

  return (
    <article
      className={`flex flex-col gap-5 rounded-xl border p-7 transition duration-300 hover:-translate-y-1 ${isFeatured
          ? "border-[var(--primary)] bg-[var(--primary)]"
          : "border-[var(--border)] bg-[var(--card)]"
        }`}
    >
      <div>
        <h3
          className={`font-[var(--font-headings)] text-sm font-medium ${isFeatured
              ? "text-[var(--primary-foreground)]"
              : "text-[var(--muted-foreground)]"
            }`}
        >
          {title}
        </h3>

        <div className="mt-1 flex items-end gap-1">
          <span
            className={`font-[var(--font-headings)] text-4xl font-bold ${isFeatured ? "text-[var(--primary-foreground)]" : "text-[var(--foreground)]"
              }`}
          >
            ${price}
          </span>
          <span
            className={`mb-2 text-sm ${isFeatured
                ? "text-[var(--primary-foreground)] opacity-80"
                : "text-[var(--muted-foreground)]"
              }`}
          >
            /month
          </span>
        </div>

        {description && (
          <p
            className={`mt-2 text-sm ${isFeatured
                ? "text-[var(--primary-foreground)] opacity-90"
                : "text-[var(--muted-foreground)]"
              }`}
          >
            {description}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <CheckCircle
              size={15}
              className={
                isFeatured ? "text-[var(--primary-foreground)]" : "text-[var(--success)]"
              }
            />
            <span
              className={`text-sm ${isFeatured ? "text-[var(--primary-foreground)]" : "text-[var(--foreground)]"
                }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to="/register"
        className={`mt-auto rounded-lg px-4 py-2.5 text-center text-sm font-medium transition ${isFeatured
            ? "bg-white text-[var(--primary)]"
            : "border border-[var(--primary)] text-[var(--primary)]"
          }`}
      >
        {ctaLabel}
      </Link>
    </article>
  );
}

export default PricingCard;
