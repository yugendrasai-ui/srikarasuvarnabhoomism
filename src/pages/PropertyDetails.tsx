import { Link, useParams } from "react-router-dom";
import { fetchPropertyById } from "../services/propertyService";
import type { Property } from "../types/property";
import { MapPin, Maximize, CheckCircle2, ChevronLeft, Calendar, Compass, Droplet, Zap, Info, Landmark, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getPricePerUnitDisplay } from "../utils/priceFormatter";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

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

  const pricePerUnitDisplay = property ? getPricePerUnitDisplay(property as any) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#5C32E6] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Property Not Found</h2>
        <p className="text-gray-500 mb-8">The property you are looking for does not exist or has been removed.</p>
        <Link to="/properties" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition">
          Browse All Properties
        </Link>
      </div>
    );
  }

  const primaryImage = property.images[activeImage]?.url || property.images[0]?.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80";

  return (
    <div className="bg-slate-50 min-h-screen py-5 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/properties" className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Properties
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${property.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {property.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 capitalize">
                {property.propertyType}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-500 text-sm sm:text-base">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-primary shrink-0" />
              <span className="line-clamp-2">{property.location.village}, {property.location.mandal}, {property.location.district}, {property.location.state}</span>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-primary">₹{property.price.toLocaleString('en-IN')}</p>
            {pricePerUnitDisplay && (
              <p className="text-gray-500 font-bold mt-0.5 text-lg">({pricePerUnitDisplay})</p>
            )}
            <p className="text-gray-500 mt-1">Contact for negotiations</p>
          </div>
        </div>

        {/* Bank Loan Available — Highlighted Banner */}
        {property.bankLoanAvailable && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-emerald-200 shadow-sm">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 sm:px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-extrabold text-base sm:text-lg leading-tight">Bank Loan Available on This Property</p>
                <p className="text-emerald-100 text-xs sm:text-sm">Financing available through leading banks — easy EMI, quick approval</p>
              </div>
              <div className="ml-auto shrink-0">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>
            </div>
            <div className="bg-emerald-50 px-5 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: "🏦", title: "Leading Banks", desc: "SBI, HDFC, ICICI & more" },
                { icon: "📅", title: "Flexible EMI", desc: "Up to 20 year repayment" },
                { icon: "⚡", title: "Quick Approval", desc: "Get approval in 7-10 days" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-emerald-100 shadow-sm">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12 h-auto lg:h-[500px]">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg h-[220px] sm:h-[300px] lg:h-full relative group">
            <img src={primaryImage} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="flex lg:flex-col gap-2 sm:gap-4 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 hide-scrollbar">
            {property.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-24 sm:w-32 lg:w-full h-20 sm:h-24 lg:h-[156px] rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/50 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
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
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2 text-primary" />
                About This Property
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Property Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 text-sm mb-1 flex items-center"><Maximize className="w-4 h-4 mr-1"/> Area</span>
                  <span className="font-bold text-gray-900">{property.area} {property.areaUnit}</span>
                </div>
                {property.facing && (
                  <div className="flex flex-col p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-500 text-sm mb-1 flex items-center"><Compass className="w-4 h-4 mr-1"/> Facing</span>
                    <span className="font-bold text-gray-900">{property.facing}</span>
                  </div>
                )}
                {property.waterAvailability && (
                  <div className="flex flex-col p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-500 text-sm mb-1 flex items-center"><Droplet className="w-4 h-4 mr-1"/> Water</span>
                    <span className="font-bold text-gray-900 line-clamp-1">{property.waterAvailability}</span>
                  </div>
                )}
                {property.electricityAvailability && (
                  <div className="flex flex-col p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-500 text-sm mb-1 flex items-center"><Zap className="w-4 h-4 mr-1"/> Electricity</span>
                    <span className="font-bold text-gray-900 line-clamp-1">{property.electricityAvailability}</span>
                  </div>
                )}
                <div className="flex flex-col p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-500 text-sm mb-1 flex items-center"><Calendar className="w-4 h-4 mr-1"/> Listed On</span>
                  <span className="font-bold text-gray-900">{new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Facilities */}
            {property.nearbyFacilities && property.nearbyFacilities.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Nearby Facilities & Landmarks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.nearbyFacilities.map((facility, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Interested in this property?</h3>
              <div className="space-y-4">
                <a href={`tel:${property.phoneNumber}`} className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-medium transition-colors">
                  Call {property.phoneNumber}
                </a>
                <a 
                  href={`https://wa.me/${property.whatsappNumber.replace(/[^0-9]/g, '')}?text=I'm interested in the property: ${property.title}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center bg-[#25D366] hover:bg-[#20b858] text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-[0_4px_14px_0_rgba(37,211,102,0.39)]"
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
                  className="w-full flex items-center justify-center bg-purple-50 hover:bg-[#5C32E6] text-[#5C32E6] hover:text-white border border-purple-200 py-3 px-4 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" /> View on Google Maps ↗
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
