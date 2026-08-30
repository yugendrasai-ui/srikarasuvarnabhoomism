import { Link } from "react-router-dom";
import { Phone, ChevronDown, Menu, X, MapPin, Building2, TreePine, Landmark, Home, ShieldCheck, Lock, Sun, Moon } from "lucide-react";
import { useState, useRef } from "react";
import { useTheme } from "../utils/theme";

const dropdownMenus: Record<string, { label: string; desc: string; icon: React.ReactNode; href: string }[]> = {
  Buy: [
    { label: "Residential Plots", desc: "Gated community & open plots", icon: <Home className="w-5 h-5 text-[#5C32E6] dark:text-[#7A5AF0]" />, href: "/properties?type=residential" },
    { label: "Agricultural Land", desc: "Farm land & crop fields", icon: <TreePine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, href: "/properties?type=agricultural" },
    { label: "Commercial Land", desc: "Highway & business plots", icon: <Building2 className="w-5 h-5 text-orange-500 dark:text-orange-400" />, href: "/properties?type=commercial" },
    { label: "Industrial Land", desc: "Factory & warehouse plots", icon: <Landmark className="w-5 h-5 text-blue-500 dark:text-blue-400" />, href: "/properties?type=industrial" },
  ],
  Projects: [
    { label: "Ongoing Projects", desc: "Currently under development", icon: <Building2 className="w-5 h-5 text-[#5C32E6] dark:text-[#7A5AF0]" />, href: "/projects?status=ongoing" },
    { label: "Completed Projects", desc: "Ready for possession", icon: <Home className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, href: "/projects?status=completed" },
    { label: "Upcoming Projects", desc: "Pre-launch & new launches", icon: <MapPin className="w-5 h-5 text-orange-500 dark:text-orange-400" />, href: "/projects?status=upcoming" },
  ],
  "Agricultural Land": [
    { label: "Farm Land", desc: "Irrigated & fertile fields", icon: <TreePine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, href: "/properties?type=farm" },
    { label: "Mango Orchards", desc: "Ready orchards for sale", icon: <TreePine className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />, href: "/properties?type=orchard" },
    { label: "Coconut Plantations", desc: "Established plantations", icon: <TreePine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />, href: "/properties?type=plantation" },
  ],
  Commercial: [
    { label: "Highway Plots", desc: "NH & state highway frontage", icon: <MapPin className="w-5 h-5 text-red-500 dark:text-red-400" />, href: "/properties?type=highway" },
    { label: "Shop & Showroom", desc: "Retail & commercial spaces", icon: <Building2 className="w-5 h-5 text-orange-500 dark:text-orange-400" />, href: "/properties?type=shop" },
    { label: "Warehouse / Godown", desc: "Storage & logistics plots", icon: <Landmark className="w-5 h-5 text-blue-500 dark:text-blue-400" />, href: "/properties?type=warehouse" },
  ],
};

const NavDropdown = ({ label, href }: { label: string; href: string }) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const items = dropdownMenus[label];

  const handleMouseEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        to={href}
        className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-200 hover:text-[#5C32E6] dark:hover:text-[#9B80FF] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        {label}
        {items && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />}
      </Link>

      {items && open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 z-50 py-2 animate-fade-in backdrop-blur-xl">
          <div className="px-4 py-2 mb-1 border-b border-gray-50 dark:border-slate-800">
            <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
          </div>
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-start gap-3 px-4 py-3 hover:bg-purple-50/70 dark:hover:bg-slate-800/80 group transition-colors"
            >
              <div className="mt-0.5 w-9 h-9 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 shrink-0 border border-gray-100 dark:border-slate-700 transition-colors shadow-xs">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200 group-hover:text-[#5C32E6] dark:group-hover:text-[#9B80FF] transition-colors">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  const navLinks = [
    { label: "Buy", href: "/properties" },
    { label: "Projects", href: "/projects" },
    { label: "Agricultural Land", href: "/properties?type=agricultural" },
    { label: "Commercial", href: "/properties?type=commercial" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 transition-colors duration-200">
      {/* Top bar */}
      <div className="bg-[#5C32E6] text-white text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span>🏠 India's Most Trusted Land & Plot Platform | RERA Verified Properties</span>
          <div className="flex items-center gap-5">
            <a href="tel:+919948720849" className="flex items-center gap-1.5 hover:text-purple-200 transition-colors">
              <Phone className="w-3 h-3" /> +91 99487 20849
            </a>
            <Link to="/contact" className="hover:text-purple-200 transition-colors">Post Free Property</Link>
            <Link
              to="/admin"
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors"
            >
              <Lock className="w-3 h-3" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm dark:shadow-slate-950/50 border-b border-gray-200/80 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <img
                src="/logo.png"
                alt="Srikara Suvarnabhoomi Logo"
                className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-105 bg-white/80 dark:bg-white/90 rounded-lg p-0.5"
              />
            </Link>

            {/* Desktop Nav Links with Dropdowns */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <NavDropdown key={link.label} label={link.label} href={link.href} />
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Dark Mode Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="relative p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-amber-400 hover:border-[#5C32E6] dark:hover:border-amber-400 transition-all shadow-xs"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 transition-transform" />
                )}
              </button>

              <a
                href="tel:+919948720849"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:text-[#5C32E6] dark:hover:text-[#9B80FF] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#5C32E6] dark:text-[#7A5AF0]" />
                <span>99487 20849</span>
              </a>
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-800" />
              <Link
                to="/admin"
                className="flex items-center gap-1.5 border border-purple-200 dark:border-purple-900/60 text-[#5C32E6] dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-sm font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </Link>
              <Link
                to="/contact"
                className="bg-[#5C32E6] hover:bg-[#4522B8] text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-[#5C32E6]/25 hover:scale-[1.02] active:scale-95"
              >
                Post Property FREE
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-amber-400 transition-all"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              <Link
                to="/admin"
                className="text-[#5C32E6] dark:text-purple-400 bg-purple-50 dark:bg-slate-800 p-2 rounded-lg border border-purple-100 dark:border-slate-700 hover:bg-purple-100 transition-colors"
                title="Admin Portal"
              >
                <ShieldCheck className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-slate-200 hover:text-[#5C32E6] p-2 rounded-lg"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
            <div className="px-4 pt-3 pb-4">
              {navLinks.map((link) => {
                const items = dropdownMenus[link.label];
                return (
                  <div key={link.label}>
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2.5 text-sm font-bold text-gray-800 dark:text-slate-100 hover:text-[#5C32E6] dark:hover:text-[#9B80FF]"
                    >
                      {link.label}
                    </Link>
                    {items && (
                      <div className="ml-4 border-l border-gray-100 dark:border-slate-800 pl-3 mb-2 space-y-1">
                        {items.map((item) => (
                          <Link
                            key={item.label}
                            to={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:text-[#5C32E6] dark:hover:text-[#9B80FF]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 mt-2 flex flex-col gap-2">
                <a href="tel:+919948720849" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 px-3 py-2">
                  <Phone className="w-4 h-4 text-[#5C32E6] dark:text-[#7A5AF0]" /> +91 99487 20849
                </a>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-purple-200 dark:border-purple-900/60 text-[#5C32E6] dark:text-purple-300 font-bold px-4 py-2.5 rounded-xl text-sm bg-purple-50 dark:bg-slate-800"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Portal
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center bg-[#5C32E6] hover:bg-[#4522B8] text-white font-bold px-4 py-2.5 rounded-xl"
                >
                  Post Property FREE
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
