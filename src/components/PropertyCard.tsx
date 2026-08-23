import { Link } from "react-router-dom";
import { Shield, MapPin, Landmark } from "lucide-react";
import type { Property } from "../types/property";
import { getPricePerUnitDisplay } from "../utils/priceFormatter";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString()}`;
  };

  const pricePerUnitDisplay = getPricePerUnitDisplay(property);

  const mapTargetUrl = property.mapUrl 
    ? property.mapUrl 
    : (property.latitude && property.longitude) 
      ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${property.location.village}, ${property.location.mandal || ''}, ${property.location.district}`
        )}`;

  return (
    <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-xl mb-4 block">
        <Link to={`/properties/${property.id}`} className="w-full h-full block">
          <img 
            src={primaryImage?.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {/* Left badges: Verified + RERA only */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {property.isVerified && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
              <Shield className="w-3 h-3" /> VERIFIED
            </span>
          )}
          {property.reraApproved && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
              RERA
            </span>
          )}
        </div>

        {/* Bank Loan Available — top-right highlight badge */}
        {property.bankLoanAvailable && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-xl shadow-emerald-500/40 border border-white/30 backdrop-blur-sm">
              {/* pulse dot */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <Landmark className="w-3 h-3 shrink-0" />
              <span className="tracking-tight">Bank Loan</span>
            </div>
            {/* glow ring */}
            <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md -z-10 scale-110"></div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-1 flex-1 flex flex-col">
        <div className="mb-2">
          <div className="flex items-end gap-2 mb-1">
            <p className="text-[#5C32E6] font-extrabold text-2xl tracking-tight">
              {formatPrice(property.price)}
            </p>
            {pricePerUnitDisplay && (
              <span className="text-gray-500 text-xs font-bold mb-1.5">
                ({pricePerUnitDisplay})
              </span>
            )}
          </div>
          <Link to={`/properties/${property.id}`}>
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 hover:text-[#5C32E6] transition-colors leading-tight mb-1.5">
              {property.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between gap-1 text-sm font-medium">
            <p className="text-gray-600 truncate flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-[#5C32E6] flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-3 h-3 text-[#5C32E6]" />
              </span>
              <span className="truncate">{property.location.village}, {property.location.district}</span>
            </p>
            <a
              href={mapTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded-full bg-purple-50 hover:bg-[#5C32E6] text-[#5C32E6] hover:text-white border border-purple-200 text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-2xs hover:shadow-sm"
              title="View location map"
            >
              <span>Map</span> ↗
            </a>
          </div>
        </div>

        {/* Plot Details */}
        <div className="grid grid-cols-2 gap-2 my-3 bg-slate-50 p-2.5 rounded-xl text-sm border border-gray-100">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Area</p>
            <p className="font-extrabold text-gray-900">{property.area} {property.areaUnit}</p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Facing</p>
            <p className="font-extrabold text-gray-900">{property.facing || "N/A"}</p>
          </div>
        </div>
        
        {/* CTAs */}
        <div className="mt-auto pt-3 grid grid-cols-3 gap-1.5 border-t border-gray-100">
          <Link 
            to={`/properties/${property.id}`}
            className="bg-white border border-[#5C32E6]/30 text-[#5C32E6] hover:bg-[#5C32E6] hover:text-white py-2 px-1 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center shadow-2xs hover:shadow-md"
          >
            Details
          </Link>
          <a
            href={mapTargetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-[#5C32E6] hover:to-[#7A5AF0] text-[#5C32E6] hover:text-white border border-purple-200 py-2 px-1 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center gap-1 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95"
            title="View exact map coordinates on Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>View Map</span>
          </a>
          <a 
            href={`https://wa.me/${property.whatsappNumber?.replace(/[^0-9]/g, '')}?text=I'm interested in the property: ${property.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-1 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center shadow-sm hover:shadow-md"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
