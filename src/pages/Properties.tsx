import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ChevronDown, Home, SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import { fetchAllProperties } from "../services/propertyService";
import type { Property } from "../types/property";
import { Loader2 } from "lucide-react";

const popularLocations = [
  "Anandapuram", "Bhogapuram", "Madhurawada", "Sontyam",
  "Rushikonda", "Tagarapuvalasa", "Kommadi", "Gajuwaka",
  "Pendurthi", "Bheemili", "Duvvada", "Yendada",
];

const budgetOptions = [
  "Under ₹10 Lac", "₹10 Lac – ₹25 Lac", "₹25 Lac – ₹50 Lac",
  "₹50 Lac – ₹1 Cr", "₹1 Cr – ₹2 Cr", "Above ₹2 Cr",
];

const typeOptions = [
  { label: "All Types", value: "" },
  { label: "Residential Plots", value: "residential" },
  { label: "Agricultural Land", value: "agricultural" },
  { label: "Commercial Land", value: "commercial" },
  { label: "Industrial Land", value: "industrial" },
];

// --- Location Combobox ---
const LocationCombobox = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = popularLocations.filter(loc =>
    loc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className="relative flex-1">
      <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-slate-800 focus-within:border-[#5C32E6] focus-within:ring-2 focus-within:ring-[#5C32E6]/20 transition-all">
        <Search className="w-4 h-4 text-gray-400 dark:text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          value={query}
          placeholder="Search by location or locality..."
          className="w-full bg-transparent focus:outline-none text-sm font-medium text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
          onFocus={() => setOpen(true)}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        />
        {query && (
          <button onClick={() => { setQuery(""); onChange(""); }} className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 z-50 py-1.5 max-h-56 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider px-4 pt-1 pb-2">Popular Locations</p>
          {filtered.length > 0 ? filtered.map(loc => (
            <button
              key={loc}
              onMouseDown={() => { onChange(loc); setQuery(loc); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-[#5C32E6] dark:hover:text-[#9B80FF] transition-colors font-medium ${value === loc ? "text-[#5C32E6] dark:text-[#9B80FF] bg-purple-50 dark:bg-slate-700" : "text-gray-700 dark:text-slate-200"}`}
            >
              {loc}
            </button>
          )) : (
            <p className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400 italic">No matching location — searching for "<span className="font-semibold text-gray-700 dark:text-slate-200">{query}</span>"</p>
          )}
        </div>
      )}
    </div>
  );
};

// --- Simple Dropdown ---
const Dropdown = ({ label, options, value, onChange }: {
  label: string; options: { label: string; value: string }[]; value: string; onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find(o => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${open || value ? "border-[#5C32E6] text-[#5C32E6] dark:text-[#9B80FF] bg-purple-50 dark:bg-slate-800" : "border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:border-[#5C32E6]"}`}
      >
        {selected?.label || label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 z-50 py-1.5">
          {options.map(opt => (
            <button
              key={opt.value}
              onMouseDown={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 dark:hover:bg-slate-700 hover:text-[#5C32E6] dark:hover:text-[#9B80FF] transition-colors font-medium ${value === opt.value ? "text-[#5C32E6] dark:text-[#9B80FF] bg-purple-50 dark:bg-slate-700" : "text-gray-700 dark:text-slate-200"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Budget filter helper ---
const budgetRanges: Record<string, [number, number]> = {
  "Under ₹10 Lac":       [0,         1000000],
  "₹10 Lac – ₹25 Lac":  [1000000,   2500000],
  "₹25 Lac – ₹50 Lac":  [2500000,   5000000],
  "₹50 Lac – ₹1 Cr":    [5000000,   10000000],
  "₹1 Cr – ₹2 Cr":      [10000000,  20000000],
  "Above ₹2 Cr":        [20000000,  Infinity],
};

// --- Empty state ---
const EmptyState = ({ type, onReset }: { type: string; onReset: () => void }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-20 h-20 rounded-2xl bg-purple-50 dark:bg-slate-800 flex items-center justify-center mb-5 border border-purple-100 dark:border-slate-700">
      <Home className="w-9 h-9 text-[#5C32E6] dark:text-purple-300 opacity-80" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No plots available</h3>
    <p className="text-gray-500 dark:text-slate-400 text-sm max-w-xs mb-6">
      {type
        ? `We currently have no ${type} properties matching your filters. Try adjusting your search.`
        : "No properties match your current filters. Try broadening your search."}
    </p>
    <button
      onClick={onReset}
      className="bg-[#5C32E6] hover:bg-[#4522B8] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
    >
      Clear All Filters
    </button>
  </div>
);

// Maps admin form full names → filter short codes
const normalizeType = (t: string): string => {
  const s = t.toLowerCase();
  if (s.includes("residential") || s.includes("open plot") || s.includes("dtcp")) return "residential";
  if (s.includes("agricultural") || s.includes("farm")) return "agricultural";
  if (s.includes("commercial")) return "commercial";
  if (s.includes("industrial")) return "industrial";
  return s; // fallback
};

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [budget, setBudget] = useState(searchParams.get("budget") || "");
  const [showFilters, setShowFilters] = useState(false);
  
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchAllProperties();
      setAllProperties(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter logic
  const filtered = allProperties.filter(p => {
    const loc = location.trim().toLowerCase();
    const matchesLocation = !loc ||
      p.location.village.toLowerCase().includes(loc) ||
      p.location.mandal?.toLowerCase().includes(loc) ||
      p.location.district.toLowerCase().includes(loc) ||
      p.title.toLowerCase().includes(loc);

    const matchesType = !type || normalizeType(p.propertyType) === type;

    const range = budget ? budgetRanges[budget] : null;
    const matchesBudget = !range || (p.price >= range[0] && p.price <= range[1]);

    return matchesLocation && matchesType && matchesBudget;
  });

  const activeFilterCount = [location, type, budget].filter(Boolean).length;

  const resetFilters = () => {
    setLocation(""); setType(""); setBudget("");
    setSearchParams({});
  };

  const typeLabel = typeOptions.find(o => o.value === type)?.label || "All Types";

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0B0F19] transition-colors duration-300">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-[64px] z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

          {/* Back + Title row */}
          <div className="flex items-center gap-3 mb-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-[#5C32E6] to-[#7A5AF0] hover:from-[#4522B8] hover:to-[#5C32E6] px-4 py-2 rounded-xl shadow-md shadow-[#5C32E6]/30 hover:shadow-lg hover:shadow-[#5C32E6]/40 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" /> Home
            </Link>
            <div className="h-5 w-px bg-gray-200 dark:bg-slate-700" />
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
                {type ? `${typeLabel}` : "All Properties"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} found</p>
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <LocationCombobox value={location} onChange={setLocation} />

            {/* Desktop filters inline */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              <Dropdown
                label="Property Type"
                options={typeOptions}
                value={type}
                onChange={setType}
              />
              <Dropdown
                label="Budget"
                options={[{ label: "Any Budget", value: "" }, ...budgetOptions.map(b => ({ label: b, value: b }))]}
                value={budget}
                onChange={setBudget}
              />
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 px-3 py-2 rounded-xl transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Clear ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden flex items-center gap-1.5 border rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${activeFilterCount > 0 ? "border-[#5C32E6] text-[#5C32E6] dark:text-[#9B80FF] bg-purple-50 dark:bg-slate-800" : "border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2">
              <Dropdown label="Property Type" options={typeOptions} value={type} onChange={setType} />
              <Dropdown
                label="Budget"
                options={[{ label: "Any Budget", value: "" }, ...budgetOptions.map(b => ({ label: b, value: b }))]}
                value={budget}
                onChange={setBudget}
              />
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="flex items-center gap-1 text-xs font-bold text-red-500 border border-red-200 dark:border-red-900/50 px-3 py-2 rounded-xl w-fit">
                  <X className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 py-24 text-center">
            <Loader2 className="w-12 h-12 text-[#5C32E6] dark:text-[#9B80FF] animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading Properties</h3>
            <p className="text-gray-500 dark:text-slate-400">Connecting to database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {filtered.length > 0
              ? filtered.map(p => <PropertyCard key={p.id} property={p} />)
              : <EmptyState type={typeLabel !== "All Types" ? typeLabel : ""} onReset={resetFilters} />
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
