import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "লেন্স ও দর্পণ" },
  { to: "/refraction", label: "প্রতিসরণ ও বিচ্ছুরণ" },
];

const SiteNav = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-200"
      style={{ boxShadow: "0 1px 2px rgba(17,24,39,0.04), 0 1px 3px rgba(17,24,39,0.06)" }}
    >
      <div className="mx-auto px-4 py-2" style={{ maxWidth: "1216px" }}>
        {/* Desktop capsule tabs */}
        <ul className="hidden md:flex justify-center gap-1 text-sm">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`block rounded-full px-4 py-1.5 font-medium transition-all duration-150 ${
                    active
                      ? "bg-[#111827] text-white font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile: hamburger menu */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to={pathname}
            className="text-sm font-semibold text-gray-900"
          >
            {links.find((l) => l.to === pathname)?.label}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-auto rounded-lg p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden pt-2 pb-1 space-y-1">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#111827] text-white font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {l.label}
                </Link>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteNav;
