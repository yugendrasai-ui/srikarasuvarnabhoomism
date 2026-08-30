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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-sm hover:shadow-xl border border-gray-200/80 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900/50 transition-all duration-300 group flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden rounded-xl mb-3.5 block bg-slate-100 dark:bg-slate-800">
        <Link to={`/properties/${property.id}`} className="w-full h-full block">
          <img 
            src={primaryImage?.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {/* Left badges: Verified + RERA */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {property.isVerified && (
            <span className="bg-emerald-600/90 text-white backdrop-blur-sm text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              <Shield className="w-3 h-3" /> VERIFIED
            </span>
          )}
          {property.reraApproved && (
            <span className="bg-[#5C32E6]/90 text-white backdrop-blur-sm text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">
              RERA
            </span>
          )}
        </div>

        {/* Bank Loan Available — Professional Corporate Badge */}
        {property.bankLoanAvailable && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <div className="flex items-center gap-1.5 bg-slate-900/90 dark:bg-slate-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20 backdrop-blur-md">
              <Landmark className="w-3 h-3 text-purple-300" />
              <span>Loan Eligible</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-1 flex-1 flex flex-col">
        <div className="mb-2">
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-[#5C32E6] dark:text-[#9B80FF] font-black text-2xl tracking-tight">
              {formatPrice(property.price)}
            </p>
            {pricePerUnitDisplay && (
              <span className="text-gray-500 dark:text-slate-400 text-xs font-bold mb-1">
                ({pricePerUnitDisplay})
              </span>
            )}
          </div>
          <Link to={`/properties/${property.id}`}>
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 line-clamp-2 hover:text-[#5C32E6] dark:hover:text-[#9B80FF] transition-colors leading-tight mb-2">
              {property.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between gap-1 text-sm font-medium">
            <p className="text-gray-500 dark:text-slate-400 truncate flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="w-5 h-5 rounded-full bg-purple-50 dark:bg-slate-800 text-[#5C32E6] dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-100 dark:border-slate-700">
                <MapPin className="w-3 h-3" />
              </span>
              <span className="truncate">{property.location.village}, {property.location.district}</span>
            </p>
            <a
              href={mapTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-slate-800 hover:bg-[#5C32E6] dark:hover:bg-[#5C32E6] text-[#5C32E6] dark:text-purple-300 hover:text-white dark:hover:text-white border border-purple-200 dark:border-slate-700 text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-2xs"
              title="View location map"
            >
              <span>Map</span> ↗
            </a>
          </div>
        </div>

        {/* Plot Details */}
        <div className="grid grid-cols-2 gap-2 my-2.5 bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl text-sm border border-gray-100 dark:border-slate-700/60">
          <div>
            <p className="text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Area</p>
            <p className="font-extrabold text-gray-900 dark:text-slate-100 text-xs sm:text-sm">{property.area} {property.areaUnit}</p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Facing</p>
            <p className="font-extrabold text-gray-900 dark:text-slate-100 text-xs sm:text-sm">{property.facing || "N/A"}</p>
          </div>
        </div>
        
        {/* CTAs */}
        <div className="mt-auto pt-3 grid grid-cols-3 gap-1.5 border-t border-gray-100 dark:border-slate-800">
          <Link 
            to={`/properties/${property.id}`}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[#5C32E6] dark:text-purple-300 hover:bg-[#5C32E6] dark:hover:bg-[#5C32E6] hover:text-white dark:hover:text-white py-2 px-1 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center shadow-xs"
          >
            Details
          </Link>
          <a
            href={mapTargetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-50 dark:bg-slate-800 hover:bg-[#5C32E6] dark:hover:bg-[#5C32E6] text-[#5C32E6] dark:text-purple-300 hover:text-white dark:hover:text-white border border-purple-200 dark:border-slate-700 py-2 px-1 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center gap-1 shadow-xs"
            title="View exact map coordinates on Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>Map</span>
          </a>
          <a 
            href={`https://wa.me/${property.whatsappNumber?.replace(/[^0-9]/g, '')}?text=I'm interested in the property: ${property.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-1 rounded-xl font-extrabold text-xs transition-all text-center flex items-center justify-center shadow-xs"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
