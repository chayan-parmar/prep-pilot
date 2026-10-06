import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard } from "lucide-react";

function Navbar({ brand, navItems = [] }) {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 lg:px-16 border-b border-[var(--border)] bg-[var(--background)] font-[var(--font-body)]">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-[var(--primary)] flex items-center justify-center">
          <span className="text-xs font-bold text-[var(--primary-foreground)]">
            {brand.mark}
          </span>
        </div>
        <span className="font-[var(--font-headings)] text-base font-bold text-[var(--foreground)]">
          {brand.name}
        </span>
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[#6d28d9] transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[#6d28d9] transition-colors"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
