import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const navItems: NavItem[] = [
  { href: "/search", label: "Find a School" },
  { href: "/states", label: "States" },
  { href: "/jobs", label: "Jobs" },
  { href: "/events", label: "Events" },
  { href: "/curriculum-comparison", label: "Curriculum" },
  { href: "/lesson-planner", label: "Lesson Plan Builder" },
  {
    href: "/resources",
    label: "Resources",
    children: [
      { href: "/resources", label: "Resource Hub" },
      { href: "/lesson-planning", label: "Lesson Planning" },
      // { href: "/learning-resources", label: "Learning Resources" }, // Hidden for now
      { href: "/contact", label: "Contact Us" },
    ],
  },
  { href: "/submit", label: "List Your School" }, // Moved to far right
];

function DropdownNav({ item, location }: { item: NavItem; location: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = item.children?.some(
    (c) => location === c.href || location.startsWith(c.href + "/")
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
          isActive
            ? "text-[#0055A4] bg-blue-50"
            : "text-[#002855] hover:text-[#0055A4] hover:bg-gray-50"
        }`}
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-4 py-2.5 text-sm transition-colors ${
                location === child.href
                  ? "text-[#0055A4] bg-blue-50 font-medium"
                  : "text-[#002855] hover:bg-gray-50 hover:text-[#0055A4]"
              }`}
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>
      <div className="container">
        <div className={`relative flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 gap-0">
            <div className="relative flex items-center">
              <img
                src="/manus-storage/Image5-9-26at3.02PM_dc022e19.png"
                alt="Find Christian Schools Logo"
                className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-12" : "h-16"}`}
                style={{ imageRendering: "crisp-edges" }}
                title="Find Christian Schools™"
              />
            </div>
          </Link>

          {/* Desktop Nav - absolutely centered */}
          <nav className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-1.5 py-0.5 shadow-sm">
            {navItems.slice(0, -1).map((item) =>
              item.children ? (
                <DropdownNav key={item.href} item={item} location={location} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    location === item.href || location.startsWith(item.href + "/")
                      ? "text-[#0055A4] bg-blue-50"
                      : "text-[#002855] hover:text-[#0055A4] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop right side: List Your School + Join the Mission */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              href={navItems[navItems.length - 1].href}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                location === navItems[navItems.length - 1].href
                  ? "text-[#0055A4] bg-blue-50"
                  : "text-[#002855] hover:text-[#0055A4] hover:bg-gray-50"
              }`}
            >
              {navItems[navItems.length - 1].label}
            </Link>
            <Link href="/mission">
              <Button size="sm" className={`bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 font-semibold transition-all duration-300 ${scrolled ? "px-3 text-xs py-1" : "px-4"}`}>
                {scrolled ? "Join" : "Join the Mission"}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#002855]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <nav className="container py-4 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.href}>
                  <button
                    onClick={() =>
                      setMobileDropdown(mobileDropdown === item.href ? null : item.href)
                    }
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg ${
                      item.children.some((c) => location === c.href)
                        ? "text-[#0055A4] bg-blue-50"
                        : "text-[#002855] hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileDropdown === item.href ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileDropdown === item.href && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm rounded-lg ${
                            location === child.href
                              ? "text-[#0055A4] bg-blue-50 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg ${
                    location === item.href
                      ? "text-[#0055A4] bg-blue-50"
                      : "text-[#002855] hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-gray-100">
              <Link href="/mission" onClick={() => setMobileOpen(false)} className="block">
                <Button className="w-full bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 font-semibold">
                  Join the Mission
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function AdminNavButton() {
  const { data: pendingSchoolCount } = trpc.admin.pendingSchools.useQuery(undefined, {
    refetchInterval: 60000,
    select: (data) => data?.length || 0,
  });
  const { data: pendingIntlCount } = trpc.admin.pendingInternational.useQuery(undefined, {
    refetchInterval: 60000,
    select: (data) => data?.length || 0,
  });
  const { data: pendingClaimCount } = trpc.admin.claimRequests.useQuery({ status: 'pending' }, {
    refetchInterval: 60000,
    select: (data) => data?.length || 0,
  });
  const { data: pendingRemovalCount } = trpc.admin.removalRequests.useQuery({ status: 'pending' }, {
    refetchInterval: 60000,
    select: (data) => data?.length || 0,
  });

  const totalPending = (pendingSchoolCount || 0) + (pendingIntlCount || 0) + (pendingClaimCount || 0) + (pendingRemovalCount || 0);

  return (
    <Link href="/admin">
      <Button variant="outline" size="sm" className="text-xs border-[#6EBE44] text-[#6EBE44] relative">
        Admin
        {totalPending > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {totalPending > 9 ? '9+' : totalPending}
          </span>
        ) : null}
      </Button>
    </Link>
  );
}
