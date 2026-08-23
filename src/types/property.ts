export interface PropertyImage {
  url: string;
  storagePath: string;
  isPrimary: boolean;
}

export interface PropertyLocation {
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
}

export interface Property {
  id: string;
  title: string;
  propertyType: string;
  price: number;
  area: number;
  areaUnit: string;
  description: string;
  location: PropertyLocation;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  roadAccess?: string;
  facing?: string;
  waterAvailability?: string;
  electricityAvailability?: string;
  nearbyFacilities?: string[];
  images: PropertyImage[];
  phoneNumber: string;
  whatsappNumber: string;
  status: "available" | "sold";
  createdAt: Date;
  updatedAt: Date;
  reraApproved?: boolean;
  isVerified?: boolean;
  bankLoanAvailable?: boolean;
  pricePerUnit?: string;
}
