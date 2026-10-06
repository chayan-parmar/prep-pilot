import { Link } from "react-router-dom";

function Footer({ brand, footer }) {
  return (
    <footer id="resources" className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 lg:flex-row">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] text-xs font-bold text-white">
            {brand.mark}
          </div>
          <span className="font-[var(--font-headings)] text-base font-bold text-[var(--foreground)]">
            {brand.name}
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {footer.links.map((link) => (
            <a
              key={link.label}
              className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <span className="text-xs text-[var(--muted-foreground)]">
          &copy; {footer.copyright}
        </span>
      </div>
    </footer>
  );
}

export default Footer;
