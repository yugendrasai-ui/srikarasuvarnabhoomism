import type { Property } from "../types/property";

export const getAllProperties = (): Property[] => {
  if (typeof window === "undefined") return mockProperties;
  try {
    const stored = localStorage.getItem("admin_properties");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading properties from localStorage:", e);
  }
  return mockProperties;
};

export const mockProperties: Property[] = [
  {
    id: "prop-1",
    title: "5 Acres Lush Green Agricultural Land",
    propertyType: "agricultural",
    price: 15000000,
    area: 5,
    areaUnit: "Acres",
    pricePerUnit: "₹30 Lac / Acre",
    description: "Beautiful fertile land ready for farming. This 5-acre property offers an excellent opportunity for agricultural investments or starting a farm. The soil is highly fertile and there is abundant groundwater. It features a wide road frontage and is easily accessible from the main highway.",
    location: { village: "Anandapuram", mandal: "Anandapuram", district: "Visakhapatnam", state: "AP", pincode: "530052" },
    latitude: 17.8867,
    longitude: 83.3614,
    mapUrl: "https://maps.google.com/?q=17.8867,83.3614",
    images: [{ url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop", storagePath: "", isPrimary: true }, { url: "https://images.unsplash.com/photo-1592982537447-6f296d042945?q=80&w=1000&auto=format&fit=crop", storagePath: "", isPrimary: false }],
    phoneNumber: "+919948720849",
    whatsappNumber: "+919948720849",
    status: "available",
    createdAt: new Date(),
    updatedAt: new Date(),
    facing: "East",
    roadAccess: "40 ft wide road",
    waterAvailability: "Borewell and Canal",
    electricityAvailability: "3-Phase Agricultural Connection",
    nearbyFacilities: ["Local Market (2km)", "Highway (1km)", "School (3km)"],
    reraApproved: false,
    isVerified: true,
    bankLoanAvailable: true
  },
  {
    id: "prop-2",
    title: "Lakeview Premium Residential Plot",
    propertyType: "residential",
    price: 8500000,
    area: 300,
    areaUnit: "Sq. Yards",
    description: "Scenic plot perfectly suited for a villa. Overlooking the beautiful lake, this premium residential plot offers tranquility while being close to city amenities. The layout is fully approved with clear titles.",
    location: { village: "Rushikonda", mandal: "Visakhapatnam", district: "Visakhapatnam", state: "AP", pincode: "530045" },
    latitude: 17.7820,
    longitude: 83.3854,
    mapUrl: "https://maps.google.com/?q=17.7820,83.3854",
    images: [{ url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop", storagePath: "", isPrimary: true }],
    phoneNumber: "+919948720849",
    whatsappNumber: "+919948720849",
    status: "available",
    createdAt: new Date(),
    updatedAt: new Date(),
    facing: "North",
    roadAccess: "60 ft wide road",
    waterAvailability: "Municipal Connection",
    electricityAvailability: "Domestic Connection",
    nearbyFacilities: ["IT Park (2km)", "Hospital (5km)", "Beach (1km)"],
    reraApproved: true,
    isVerified: true,
    bankLoanAvailable: true,
    pricePerUnit: "₹28,333 / Sq. Yd"
  },
  {
    id: "prop-3",
    title: "Highway Facing Commercial Land",
    propertyType: "commercial",
    price: 45000000,
    area: 2,
    areaUnit: "Acres",
    pricePerUnit: "₹2.25 Cr / Acre",
    description: "Prime location for businesses and warehouses. With excellent visibility on the national highway, this land is ideal for setting up commercial establishments, logistics hubs, or retail spaces. High footfall and transit traffic guaranteed.",
    location: { village: "Tagarapuvalasa", mandal: "Bheemunipatnam", district: "Visakhapatnam", state: "AP", pincode: "531162" },
    latitude: 17.9333,
    longitude: 83.4333,
    mapUrl: "https://maps.google.com/?q=17.9333,83.4333",
    images: [{ url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop", storagePath: "", isPrimary: true }],
    phoneNumber: "+919948720849",
    whatsappNumber: "+919948720849",
    status: "sold",
    createdAt: new Date(),
    updatedAt: new Date(),
    facing: "South",
    roadAccess: "National Highway (NH-16)",
    waterAvailability: "Borewell",
    electricityAvailability: "Commercial Connection",
    nearbyFacilities: ["Toll Plaza (1km)", "City Center (15km)"],
    reraApproved: true,
    isVerified: false,
    bankLoanAvailable: true
  }
];
