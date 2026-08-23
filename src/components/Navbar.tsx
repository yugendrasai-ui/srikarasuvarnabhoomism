import { Link } from "react-router-dom";
import { Phone, ChevronDown, Menu, X, MapPin, Building2, TreePine, Landmark, Home, ShieldCheck, Lock } from "lucide-react";
import { useState, useRef } from "react";

const dropdownMenus: Record<string, { label: string; desc: string; icon: React.ReactNode; href: string }[]> = {
  Buy: [
    { label: "Residential Plots", desc: "Gated community & open plots", icon: <Home className="w-5 h-5 text-[#5C32E6]" />, href: "/properties?type=residential" },
    { label: "Agricultural Land", desc: "Farm land & crop fields", icon: <TreePine className="w-5 h-5 text-green-600" />, href: "/properties?type=agricultural" },
    { label: "Commercial Land", desc: "Highway & business plots", icon: <Building2 className="w-5 h-5 text-orange-500" />, href: "/properties?type=commercial" },
    { label: "Industrial Land", desc: "Factory & warehouse plots", icon: <Landmark className="w-5 h-5 text-blue-500" />, href: "/properties?type=industrial" },
  ],
  Projects: [
    { label: "Ongoing Projects", desc: "Currently under development", icon: <Building2 className="w-5 h-5 text-[#5C32E6]" />, href: "/projects?status=ongoing" },
    { label: "Completed Projects", desc: "Ready for possession", icon: <Home className="w-5 h-5 text-green-600" />, href: "/projects?status=completed" },
    { label: "Upcoming Projects", desc: "Pre-launch & new launches", icon: <MapPin className="w-5 h-5 text-orange-500" />, href: "/projects?status=upcoming" },
  ],
  "Agricultural Land": [
    { label: "Farm Land", desc: "Irrigated & fertile fields", icon: <TreePine className="w-5 h-5 text-green-600" />, href: "/properties?type=farm" },
    { label: "Mango Orchards", desc: "Ready orchards for sale", icon: <TreePine className="w-5 h-5 text-yellow-600" />, href: "/properties?type=orchard" },
    { label: "Coconut Plantations", desc: "Established plantations", icon: <TreePine className="w-5 h-5 text-emerald-600" />, href: "/properties?type=plantation" },
  ],
  Commercial: [
    { label: "Highway Plots", desc: "NH & state highway frontage", icon: <MapPin className="w-5 h-5 text-red-500" />, href: "/properties?type=highway" },
    { label: "Shop & Showroom", desc: "Retail & commercial spaces", icon: <Building2 className="w-5 h-5 text-orange-500" />, href: "/properties?type=shop" },
    { label: "Warehouse / Godown", desc: "Storage & logistics plots", icon: <Landmark className="w-5 h-5 text-blue-500" />, href: "/properties?type=warehouse" },
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
        className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold text-gray-700 hover:text-[#5C32E6] hover:bg-gray-50 transition-colors"
      >
        {label}
        {items && <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />}
      </Link>

      {items && open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2 animate-fade-in">
          <div className="px-4 py-2 mb-1 border-b border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
          </div>
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-start gap-3 px-4 py-3 hover:bg-purple-50 group transition-colors"
            >
              <div className="mt-0.5 w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white shrink-0 border border-gray-100">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-[#5C32E6]">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
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

  const navLinks = [
    { label: "Buy", href: "/properties" },
    { label: "Projects", href: "/projects" },
    { label: "Agricultural Land", href: "/properties?type=agricultural" },
    { label: "Commercial", href: "/properties?type=commercial" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50">
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
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <img
                src="/logo.png"
                alt="Srikara Suvarnabhoomi Logo"
                className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Nav Links with Dropdowns */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavDropdown key={link.label} label={link.label} href={link.href} />
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="tel:+919948720849"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#5C32E6] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#5C32E6]" />
                <span>99487 20849</span>
              </a>
              <div className="h-6 w-px bg-gray-200" />
              <Link
                to="/admin"
                className="flex items-center gap-1.5 border border-purple-200 text-[#5C32E6] hover:bg-purple-50 text-sm font-bold px-3.5 py-2 rounded-lg transition-colors shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </Link>
              <Link
                to="/contact"
                className="bg-[#5C32E6] hover:bg-[#4522B8] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Post Property FREE
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-[#5C32E6] p-2 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 pt-3 pb-4">
              {navLinks.map((link) => {
                const items = dropdownMenus[link.label];
                return (
                  <div key={link.label}>
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2.5 text-sm font-bold text-gray-800 hover:text-[#5C32E6]"
                    >
                      {link.label}
                    </Link>
                    {items && (
                      <div className="ml-4 border-l border-gray-100 pl-3 mb-2 space-y-1">
                        {items.map((item) => (
                          <Link
                            key={item.label}
                            to={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-1.5 text-sm text-gray-600 hover:text-[#5C32E6]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-3 border-t border-gray-100 mt-2 flex flex-col gap-2">
                <a href="tel:+919948720849" className="flex items-center gap-2 text-sm font-semibold text-gray-700 px-3 py-2">
                  <Phone className="w-4 h-4 text-[#5C32E6]" /> +91 99487 20849
                </a>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border border-purple-200 text-[#5C32E6] font-bold px-4 py-2.5 rounded-lg text-sm bg-purple-50"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Portal
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center bg-[#5C32E6] text-white font-bold px-4 py-2.5 rounded-lg"
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
