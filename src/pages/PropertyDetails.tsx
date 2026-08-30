import { Link, useParams } from "react-router-dom";
import { fetchPropertyById } from "../services/propertyService";
import type { Property } from "../types/property";
import { MapPin, Maximize, CheckCircle2, ChevronLeft, Calendar, Compass, Droplet, Zap, Info, Landmark, Loader2, Calculator, ShieldCheck, Percent, Clock, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { getPricePerUnitDisplay } from "../utils/priceFormatter";

const PARTNER_BANKS = [
  { name: "SBI", tag: "State Bank of India", color: "bg-[#280071] text-white" },
  { name: "HDFC", tag: "HDFC Bank", color: "bg-[#004c8f] text-white" },
  { name: "ICICI", tag: "ICICI Bank", color: "bg-[#f37021] text-white" },
  { name: "AXIS", tag: "Axis Bank", color: "bg-[#97144d] text-white" },
  { name: "BOB", tag: "Bank of Baroda", color: "bg-[#f26522] text-white" },
  { name: "KOTAK", tag: "Kotak Mahindra", color: "bg-[#ed1c24] text-white" },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // EMI Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);

  useEffect(() => {
    const loadProp = async () => {
      setLoading(true);
      if (id) {
        const data = await fetchPropertyById(id);
        setProperty(data);
      }
      setLoading(false);
    };
    loadProp();
  }, [id]);

  // Dynamic EMI Calculation
  const emiData = useMemo(() => {
    if (!property?.price) return null;
    const price = property.price;
    const downPayment = Math.round(price * (downPaymentPercent / 100));
    const loanAmount = Math.max(0, price - downPayment);
    const monthlyRate = interestRate / (12 * 100);
    const totalMonths = tenureYears * 12;

    let emi = 0;
    if (monthlyRate > 0 && totalMonths > 0) {
      emi = Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      );
    } else {
      emi = Math.round(loanAmount / (totalMonths || 1));
    }

    const totalPayable = emi * totalMonths;
    const totalInterest = Math.max(0, totalPayable - loanAmount);

    return {
      downPayment,
      loanAmount,
      emi,
      totalPayable,
      totalInterest,
    };
  }, [property?.price, downPaymentPercent, tenureYears, interestRate]);

  const pricePerUnitDisplay = property ? getPricePerUnitDisplay(property as any) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="w-12 h-12 text-[#5C32E6] animate-spin mb-4" />
        <p className="text-gray-500 dark:text-slate-400 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-slate-950 transition-colors">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">Property Not Found</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-8">The property you are looking for does not exist or has been removed.</p>
        <Link to="/properties" className="bg-[#5C32E6] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4522B8] transition">
          Browse All Properties
        </Link>
      </div>
    );
  }

  const primaryImage = property.images[activeImage]?.url || property.images[0]?.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80";

  return (
    <div className="bg-slate-50 dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100 min-h-screen py-5 sm:py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/properties" className="inline-flex items-center text-gray-500 dark:text-slate-400 hover:text-[#5C32E6] dark:hover:text-[#9B80FF] mb-6 transition font-medium text-sm">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Properties
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2.5 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${property.status === 'available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'}`}>
                {property.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 capitalize">
                {property.propertyType}
              </span>
              {property.reraApproved && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
                  RERA APPROVED
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">{property.title}</h1>
            <div className="flex items-center text-gray-500 dark:text-slate-400 text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-[#5C32E6] dark:text-[#9B80FF] shrink-0" />
              <span className="line-clamp-2">{property.location.village}, {property.location.mandal}, {property.location.district}, {property.location.state}</span>
            </div>
          </div>
          <div className="md:text-right shrink-0">
            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-[#5C32E6] dark:text-[#9B80FF] tracking-tight">₹{property.price.toLocaleString('en-IN')}</p>
            {pricePerUnitDisplay && (
              <p className="text-gray-500 dark:text-slate-400 font-bold mt-1 text-base sm:text-lg">({pricePerUnitDisplay})</p>
            )}
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Price negotiable · Clear title</p>
          </div>
        </div>

        {/* ── Professional Bank Loan & Financing Hub ── */}
        {property.bankLoanAvailable && (
          <div className="mb-10 rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all">
            {/* Header Ribbon */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-purple-950/60 dark:to-slate-950 text-white px-5 sm:px-8 py-5 border-b border-indigo-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                    <Landmark className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                        Bank Loan & Financing Assistance Available
                      </h3>
                      <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Pre-Approved Eligible
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                      Fast-track loan processing through verified national & private partner banks with minimal documentation
                    </p>
                  </div>
                </div>

                {/* Partner Bank Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PARTNER_BANKS.map((b) => (
                    <span
                      key={b.name}
                      title={b.tag}
                      className="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all shadow-xs"
                    >
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Loan Advantages Grid */}
            <div className="p-5 sm:p-7 border-b border-gray-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-gray-200/70 dark:border-slate-700/60 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#5C32E6] dark:text-[#9B80FF] flex items-center justify-center shrink-0">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Interest Rate</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">From 8.40% p.a.*</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-gray-200/70 dark:border-slate-700/60 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Max Funding</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">Up to 80% Value</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-gray-200/70 dark:border-slate-700/60 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Loan Tenure</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">Up to 30 Years</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-gray-200/70 dark:border-slate-700/60 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Approval Time</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">5 – 7 Working Days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Live EMI Calculator */}
            {emiData && (
              <div className="p-5 sm:p-7">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-[#5C32E6] dark:text-[#9B80FF]" />
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">
                    Interactive Monthly EMI Calculator for this Property
                  </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left: Sliders & Controls (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Down Payment Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-gray-600 dark:text-slate-300">Down Payment ({downPaymentPercent}%)</span>
                        <span className="text-[#5C32E6] dark:text-[#9B80FF]">₹{emiData.downPayment.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full accent-[#5C32E6] cursor-pointer h-2 bg-gray-200 dark:bg-slate-700 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>10% (Min)</span>
                        <span>20% (Std)</span>
                        <span>50% (Max)</span>
                      </div>
                    </div>

                    {/* Tenure Buttons */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-gray-600 dark:text-slate-300">Loan Tenure</span>
                        <span className="text-[#5C32E6] dark:text-[#9B80FF]">{tenureYears} Years ({tenureYears * 12} Months)</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[5, 10, 15, 20, 30].map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => setTenureYears(yr)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                              tenureYears === yr
                                ? "bg-[#5C32E6] text-white shadow-md shadow-[#5C32E6]/20"
                                : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {yr} Yrs
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-gray-600 dark:text-slate-300">Estimated Interest Rate (p.a.)</span>
                        <span className="text-[#5C32E6] dark:text-[#9B80FF]">{interestRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="7.5"
                          max="12.0"
                          step="0.25"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="flex-1 accent-[#5C32E6] cursor-pointer h-2 bg-gray-200 dark:bg-slate-700 rounded-lg"
                        />
                        <span className="text-xs font-extrabold px-2.5 py-1 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-800 dark:text-slate-200">
                          {interestRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Calculated EMI Card (5 cols) */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-purple-50 via-indigo-50/50 to-purple-50 dark:from-slate-800/90 dark:via-slate-800 dark:to-purple-950/40 p-5 rounded-2xl border border-purple-100 dark:border-slate-700 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Estimated Monthly EMI
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-[#5C32E6] dark:text-[#9B80FF] mt-1 mb-3">
                        ₹{emiData.emi.toLocaleString('en-IN')} <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">/ mo</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 dark:text-slate-300 border-t border-purple-200/50 dark:border-slate-700 pt-3">
                        <div className="flex justify-between">
                          <span>Principal Loan:</span>
                          <span className="font-bold text-gray-900 dark:text-white">₹{emiData.loanAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Interest:</span>
                          <span className="font-bold text-gray-900 dark:text-white">₹{emiData.totalInterest.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-1 border-t border-dashed border-gray-200 dark:border-slate-700">
                          <span>Total Amount Payable:</span>
                          <span className="font-extrabold text-[#5C32E6] dark:text-[#9B80FF]">₹{emiData.totalPayable.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${property.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi, I want to check bank loan eligibility for "${property.title}" (Price: ₹${property.price.toLocaleString('en-IN')}, Estimated Loan: ₹${emiData.loanAmount.toLocaleString('en-IN')}, Tenure: ${tenureYears} yrs, EMI: ₹${emiData.emi.toLocaleString('en-IN')}/mo). Please assist.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full bg-[#5C32E6] hover:bg-[#4522B8] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#5C32E6]/25 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <span>Check Loan Eligibility & Apply</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12 h-auto lg:h-[500px]">
          <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg h-[220px] sm:h-[300px] lg:h-full relative group border border-gray-200 dark:border-slate-800">
            <img src={primaryImage} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="flex lg:flex-col gap-2 sm:gap-4 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 hide-scrollbar">
            {property.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-24 sm:w-32 lg:w-full h-20 sm:h-24 lg:h-[156px] rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#5C32E6] ring-2 ring-[#5C32E6]/50 opacity-100' : 'border-transparent opacity-70 hover:opacity-100 dark:border-slate-800'}`}
              >
                <img src={img.url} alt={`${property.title} - ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2 text-[#5C32E6] dark:text-[#9B80FF]" />
                About This Property
              </h3>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Property Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/70 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                  <span className="text-gray-500 dark:text-slate-400 text-sm mb-1 flex items-center"><Maximize className="w-4 h-4 mr-1 text-[#5C32E6] dark:text-[#9B80FF]"/> Area</span>
                  <span className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg">{property.area} {property.areaUnit}</span>
                </div>
                {property.facing && (
                  <div className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/70 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="text-gray-500 dark:text-slate-400 text-sm mb-1 flex items-center"><Compass className="w-4 h-4 mr-1 text-[#5C32E6] dark:text-[#9B80FF]"/> Facing</span>
                    <span className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg">{property.facing}</span>
                  </div>
                )}
                {property.waterAvailability && (
                  <div className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/70 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="text-gray-500 dark:text-slate-400 text-sm mb-1 flex items-center"><Droplet className="w-4 h-4 mr-1 text-[#5C32E6] dark:text-[#9B80FF]"/> Water</span>
                    <span className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg line-clamp-1">{property.waterAvailability}</span>
                  </div>
                )}
                {property.electricityAvailability && (
                  <div className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/70 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="text-gray-500 dark:text-slate-400 text-sm mb-1 flex items-center"><Zap className="w-4 h-4 mr-1 text-[#5C32E6] dark:text-[#9B80FF]"/> Electricity</span>
                    <span className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg line-clamp-1">{property.electricityAvailability}</span>
                  </div>
                )}
                <div className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/70 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                  <span className="text-gray-500 dark:text-slate-400 text-sm mb-1 flex items-center"><Calendar className="w-4 h-4 mr-1 text-[#5C32E6] dark:text-[#9B80FF]"/> Listed On</span>
                  <span className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg">{new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Facilities */}
            {property.nearbyFacilities && property.nearbyFacilities.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Nearby Facilities & Landmarks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.nearbyFacilities.map((facility, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-slate-300 font-medium">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 sticky top-24 transition-colors">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Interested in this property?</h3>
              <div className="space-y-3.5">
                <a href={`tel:${property.phoneNumber}`} className="w-full flex items-center justify-center bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-700 text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-sm">
                  Call {property.phoneNumber}
                </a>
                <a 
                  href={`https://wa.me/${property.whatsappNumber.replace(/[^0-9]/g, '')}?text=I'm interested in the property: ${property.title}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center bg-[#25D366] hover:bg-[#20b858] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_0_rgba(37,211,102,0.35)]"
                >
                  <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zM20.056 3.92C17.911 1.776 15.056.592 12.028.592 5.753.592.651 5.694.649 11.969c-.001 2.003.524 3.96 1.523 5.688L0 24l6.505-1.705c1.666.908 3.565 1.385 5.518 1.385h.004c6.273 0 11.374-5.102 11.376-11.378.001-3.041-1.183-5.901-3.347-8.382z"/>
                  </svg>
                  Chat on WhatsApp
                </a>

                <a 
                  href={
                    property.mapUrl 
                      ? property.mapUrl 
                      : (property.latitude && property.longitude) 
                        ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${property.location.village}, ${property.location.mandal || ''}, ${property.location.district}`
                          )}`
                  }
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center bg-purple-50 dark:bg-purple-950/40 hover:bg-[#5C32E6] dark:hover:bg-[#5C32E6] text-[#5C32E6] dark:text-purple-300 hover:text-white dark:hover:text-white border border-purple-200 dark:border-purple-900/60 py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-xs gap-2"
                >
                  <MapPin className="w-4 h-4" /> View on Google Maps ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
