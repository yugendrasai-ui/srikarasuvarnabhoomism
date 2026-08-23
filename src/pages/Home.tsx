import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ShieldCheck, Map, Wallet, TrendingUp, ArrowUpRight, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PropertyCard from "../components/PropertyCard";
import ContactSection from "../components/ContactSection";
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

const tabTypeMap: Record<string, string> = {
  "Buy Plot": "residential",
  "Buy Agricultural": "agricultural",
  "Commercial": "commercial",
};

// Location combobox with popular suggestions + manual entry
const LocationCombobox = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const filtered = popularLocations.filter(l => l.toLowerCase().includes(value.toLowerCase()));
  return (
    <div ref={ref} className="relative flex-1">
      <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-[#5C32E6] focus-within:ring-2 focus-within:ring-[#5C32E6]/20 transition-all">
        <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
        <input
          type="text"
          value={value}
          placeholder="Enter City, Locality or Project..."
          className="w-full bg-transparent focus:outline-none font-semibold text-gray-800 placeholder-gray-400 text-sm"
          onFocus={() => setOpen(true)}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
        />
        {value && <button onClick={() => onChange("")} className="ml-1 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
      </div>
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-1.5 max-h-52 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 pt-1 pb-2">Popular Locations</p>
          {filtered.length > 0 ? filtered.map(loc => (
            <button key={loc} onMouseDown={() => { onChange(loc); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-[#5C32E6] transition-colors font-medium ${value === loc ? "text-[#5C32E6] bg-purple-50" : "text-gray-700"}`}>
              {loc}
            </button>
          )) : (
            <p className="px-4 py-3 text-sm text-gray-400 italic">Searching for "{value}"…</p>
          )}
        </div>
      )}
    </div>
  );
};

// Budget dropdown
const BudgetDropdown = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative w-full">
      <button onClick={() => setOpen(!open)}
        className={`w-full border rounded-xl px-4 py-3 flex items-center justify-between transition-colors ${open ? "border-[#5C32E6] ring-2 ring-[#5C32E6]/20" : "border-gray-300 hover:border-[#5C32E6]"}`}>
        <span className={`font-medium text-sm ${value ? "text-gray-900" : "text-gray-500"}`}>{value || "Budget"}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-1.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 pt-1 pb-2">Select Budget</p>
          {budgetOptions.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-[#5C32E6] transition-colors font-medium ${value === opt ? "text-[#5C32E6] bg-purple-50" : "text-gray-700"}`}>
              {opt}
            </button>
          ))}
          {value && <button onClick={() => { onChange(""); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 border-t border-gray-100 transition-colors font-medium">✕ Clear</button>}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Buy Plot");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProps = async () => {
      setLoading(true);
      const data = await fetchAllProperties();
      setAllProperties(data);
      setFeaturedProperties(data.slice(0, 3));
      setLoading(false);
    };
    loadProps();
  }, []);

  const tabs = ["Buy Plot", "Buy Agricultural", "Commercial"];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (budget) params.set("budget", budget);
    const type = tabTypeMap[activeTab];
    if (type) params.set("type", type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2F5]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 sm:pt-24 sm:pb-32 flex items-center justify-center min-h-[520px] sm:min-h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Indian Real Estate Landscape"
            className="w-full h-full object-cover brightness-50"
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg leading-tight">
              Find Your Dream Plot
            </h1>
            <p className="text-base sm:text-xl text-gray-200 font-medium drop-shadow-md">
              Over 50,000+ verified plots and lands for sale
            </p>
          </div>

          {/* Search Console */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4 sm:mb-6 pb-0 gap-0.5 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? "text-[#5C32E6] border-[#5C32E6]"
                      : "text-gray-500 border-transparent hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="flex flex-col gap-3">
              <LocationCombobox value={location} onChange={setLocation} />

              <div className="grid grid-cols-2 gap-3">
                <BudgetDropdown value={budget} onChange={setBudget} />
                <button
                  onClick={() => navigate(`/properties?type=${tabTypeMap[activeTab] || ""}`)}
                  className="w-full border border-gray-300 hover:border-[#5C32E6] rounded-xl px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-500 transition-colors"
                >
                  More Filters <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <button
                onClick={handleSearch}
                className="w-full bg-[#5C32E6] hover:bg-[#4522B8] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-[#5C32E6]/30 text-sm flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Search Properties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-10 sm:py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3">Premium Plots for Sale</h2>
            <p className="text-gray-500 font-medium text-sm sm:text-base">Explore our exclusive collection of RERA approved and verified plots</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {loading ? (
              <div className="col-span-full py-12 flex justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#5C32E6]" />
              </div>
            ) : featuredProperties.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 font-semibold">
                No featured properties found.
              </div>
            ) : (
              featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trending Localities */}
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Trending Growth Corridors</h2>
              <p className="text-gray-500 text-sm sm:text-base">Most searched localities for high ROI investments</p>
            </div>
            <Link to="/sales" className="text-[#5C32E6] font-bold hover:underline hidden sm:block">View all localities &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {[
              { name: "Anandapuram", trend: "+12%" },
              { name: "Bhogapuram", trend: "+24%" },
              { name: "Madhurawada", trend: "+8%" },
              { name: "Sontyam", trend: "+18%" }
            ].map((loc, i) => {
              const count = allProperties.filter(
                (p) => p.location.village.toLowerCase() === loc.name.toLowerCase() || p.location.mandal.toLowerCase() === loc.name.toLowerCase()
              ).length;
              
              return (
                <div 
                  key={i} 
                  onClick={() => navigate(`/properties?location=${loc.name}`)}
                  className="border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-[#5C32E6] hover:shadow-lg transition-all cursor-pointer group bg-white"
                >
                  <div className="flex flex-col gap-1.5 mb-2 sm:mb-4">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit">{loc.trend}</span>
                    <h3 className="font-bold text-sm sm:text-lg text-gray-900 group-hover:text-[#5C32E6] transition-colors leading-snug">{loc.name}</h3>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm">{count} Plots</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            {/* Left side text */}
            <div className="lg:w-1/3 lg:sticky lg:top-32">
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                 <div className="w-8 h-[2px] bg-[#5C32E6]"></div>
                 <span className="text-[#5C32E6] font-bold text-sm tracking-[0.2em] uppercase">Our Services</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Everything you need to <span className="text-[#5C32E6]">invest safely.</span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                From legal title checks to guided site tours — we provide integrated real estate services that ensure your land purchase is secure, transparent, and profitable.
              </p>
              <Link to="/contact" className="inline-flex items-center text-[#5C32E6] font-bold text-base sm:text-lg hover:underline group">
                Get a free consultation <ArrowUpRight className="ml-1 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>

            {/* Right side grid */}
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer relative overflow-hidden">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-orange-600 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Legal Verification</h3>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base">We conduct rigorous 3-tier legal checks to ensure clear titles and secure your long-term investment.</p>
                  <ArrowUpRight className="absolute top-6 right-6 sm:top-8 sm:right-8 w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-[#5C32E6] transition-colors" />
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer relative overflow-hidden">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                    <Wallet className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Easy Financing</h3>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base">Get seamless access to bank loans and flexible EMI options through our partnered financial institutions.</p>
                  <ArrowUpRight className="absolute top-6 right-6 sm:top-8 sm:right-8 w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-[#5C32E6] transition-colors" />
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6 sm:mt-12">
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer relative overflow-hidden">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                    <Map className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Guided Site Tours</h3>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base">Experience hassle-free physical site visits with our local experts providing on-ground insights.</p>
                  <ArrowUpRight className="absolute top-6 right-6 sm:top-8 sm:right-8 w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-[#5C32E6] transition-colors" />
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer relative overflow-hidden">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Resale Assistance</h3>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base">Maximize your ROI with our dedicated resale desk that connects you with premium buyers when you're ready.</p>
                  <ArrowUpRight className="absolute top-6 right-6 sm:top-8 sm:right-8 w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-[#5C32E6] transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">Proven Results</h2>
            <p className="text-base sm:text-xl text-gray-500">Real success stories from our trusted real estate investors.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-rose-400 to-rose-600 p-8 h-48 flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                 <h3 className="text-6xl font-black text-white relative z-10">+150%</h3>
                 <p className="text-rose-100 font-medium relative z-10 mt-2">Value Appreciation</p>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                 <h4 className="text-2xl font-bold text-gray-900 mb-4">High ROI in Bhogapuram</h4>
                 <p className="text-gray-600 mb-6 leading-relaxed flex-1">Early investors saw land values more than double within 3 years due to the upcoming international airport development.</p>
                 <div className="flex flex-wrap gap-2 mb-6">
                   <span className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full">High ROI</span>
                   <span className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full">Airport Zone</span>
                 </div>
                 <Link to="/sales" className="text-rose-600 font-bold inline-flex items-center hover:underline">
                   View Locality Details <ArrowUpRight className="ml-1 w-4 h-4" />
                 </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-8 h-48 flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                 <h3 className="text-6xl font-black text-white relative z-10">500+</h3>
                 <p className="text-orange-100 font-medium relative z-10 mt-2">Families Settled</p>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                 <h4 className="text-2xl font-bold text-gray-900 mb-4">Secure Residential Plots</h4>
                 <p className="text-gray-600 mb-6 leading-relaxed flex-1">We helped over 500 families secure clear-title plots in premium gated communities across Visakhapatnam.</p>
                 <div className="flex flex-wrap gap-2 mb-6">
                   <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Residential</span>
                   <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Verified</span>
                 </div>
                 <Link to="/sales" className="text-orange-600 font-bold inline-flex items-center hover:underline">
                   View Completed Projects <ArrowUpRight className="ml-1 w-4 h-4" />
                 </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-fuchsia-400 to-purple-600 p-8 h-48 flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                 <h3 className="text-6xl font-black text-white relative z-10">0</h3>
                 <p className="text-fuchsia-100 font-medium relative z-10 mt-2">Legal Disputes</p>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                 <h4 className="text-2xl font-bold text-gray-900 mb-4">100% Transparent Deals</h4>
                 <p className="text-gray-600 mb-6 leading-relaxed flex-1">Our rigorous 3-tier legal verification process ensures absolute peace of mind and zero legal complications for our buyers.</p>
                 <div className="flex flex-wrap gap-2 mb-6">
                   <span className="bg-fuchsia-50 text-fuchsia-700 text-xs font-bold px-3 py-1 rounded-full">Legal Check</span>
                   <span className="bg-fuchsia-50 text-fuchsia-700 text-xs font-bold px-3 py-1 rounded-full">Secure</span>
                 </div>
                 <Link to="/sales" className="text-fuchsia-600 font-bold inline-flex items-center hover:underline">
                   Learn About Our Process <ArrowUpRight className="ml-1 w-4 h-4" />
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Stats Section */}
      <section className="py-8 sm:py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#7A5AF0] to-[#4522B8] rounded-[2rem] sm:rounded-[3rem] px-5 sm:px-8 py-8 md:py-10 text-white text-center shadow-2xl relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black opacity-20 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <p className="text-[#E9D5FF] font-bold text-sm tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-4">
                <span className="w-12 h-[2px] bg-[#E9D5FF]/50"></span>
                RESULTS THAT SPEAK
                <span className="w-12 h-[2px] bg-[#E9D5FF]/50"></span>
              </p>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-10 text-white">The numbers behind our success</h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Stat 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-4 bg-white/10">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">50+</h3>
                  <p className="text-base text-[#E9D5FF] font-medium">Lands Sold</p>
                </div>
                
                {/* Stat 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-4 bg-white/10">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">200+</h3>
                  <p className="text-base text-[#E9D5FF] font-medium">Buildings Constructed</p>
                </div>
                
                {/* Stat 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-4 bg-white/10">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">10+</h3>
                  <p className="text-base text-[#E9D5FF] font-medium">Years of Experience</p>
                </div>
                
                {/* Stat 4 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-4 bg-white/10">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">99%</h3>
                  <p className="text-base text-[#E9D5FF] font-medium">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead & Strategy Section matching screenshot */}
      <ContactSection />
    </div>
  );
};

export default Home;
