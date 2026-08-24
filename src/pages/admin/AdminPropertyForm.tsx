import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { Plus, ChevronDown, Trash2, Link as LinkIcon, Upload, MapPin, X } from "lucide-react";
import type { Property } from "../../types/property";
import { addProperty, updateProperty, fetchPropertyById } from "../../services/propertyService";

// ─── Combo Input: dropdown options + free-text entry ──────────────────────────
const ComboInput = ({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setTyped("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Show all options when just opened; filter only when user is typing something new
  const filtered = typed.length > 0
    ? options.filter((o) => o.toLowerCase().includes(typed.toLowerCase()))
    : options;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTyped(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  const handleSelect = (opt: string) => {
    onChange(opt);
    setTyped("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${
        open ? "ring-2 ring-[#5C32E6] border-[#5C32E6]" : error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
      }`}>
        <input
          value={typed.length > 0 ? typed : value}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="px-3 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-1.5 max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-2.5 text-sm text-gray-400 italic">No match — press Enter to use "{typed}"</p>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-purple-50 hover:text-[#5C32E6] transition-colors ${
                  value === opt ? "bg-purple-50 text-[#5C32E6] font-bold" : "text-gray-700"
                }`}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};


// ─── Form defaults ─────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "", propertyType: "Residential Plot", price: "", area: "", areaUnit: "Sq. Yards",
  description: "", village: "", mandal: "", district: "Visakhapatnam", state: "Andhra Pradesh",
  pincode: "", latitude: "", longitude: "", mapUrl: "", facing: "", roadAccess: "", waterAvailability: "", electricityAvailability: "",
  phoneNumber: "+919948720849", whatsappNumber: "+919948720849", status: "available",
  reraApproved: false, isVerified: false, bankLoanAvailable: false, imageUrls: [] as string[],
  nearbyFacility: "", nearbyFacilities: [] as string[], pricePerUnit: "",
};

// ─── Option lists ──────────────────────────────────────────────────────────────
const PROPERTY_TYPES = ["Residential Plot", "Agricultural Land", "Commercial Land", "Industrial Land", "Farm House", "Open Plot", "DTCP Approved Plot"];
const AREA_UNITS = ["Sq. Yards", "Acres", "Guntas", "Sq. Feet", "Hectares", "Cents", "Bigha"];
const DISPLAY_UNITS = ["Sq. Yards", "Sq. Feet", "Acres", "Guntas", "Cents", "Hectares"];
const FACINGS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const ROAD_ACCESS = ["20 ft wide road", "30 ft wide road", "40 ft wide road", "60 ft wide road", "80 ft wide road", "National Highway (NH)", "State Highway", "Mud Road", "No Road Access"];
const WATER = ["Borewell", "Canal Water", "Municipal Connection", "Borewell & Canal", "Rain Water", "River Side", "No Water Source"];
const ELECTRICITY = ["Domestic Connection", "3-Phase Agricultural", "Commercial Connection", "No Connection", "Near Transformer"];
const DISTRICTS = ["Visakhapatnam", "Vizianagaram", "Srikakulam", "East Godavari", "West Godavari", "Krishna", "Guntur", "Prakasam", "Nellore", "Kurnool", "Kadapa", "Anantapur", "Chittoor"];
const POPULAR_AREAS = ["Madhurawada", "Rushikonda", "MVP Colony", "Gajuwaka", "Pendurthi", "Anandapuram", "Bheemunipatnam", "Tagarapuvalasa", "Bhogapuram", "Yendada", "Kapuluppada", "Seethammadhara", "Siripuram", "Kothavalasa", "Sabbavaram", "Lankelapalem", "Aganampudi"];
const POPULAR_MANDALS = ["Visakhapatnam Rural", "Visakhapatnam Urban", "Anandapuram", "Bheemunipatnam", "Pendurthi", "Padmanabham", "Bhogapuram", "Kothavalasa", "Gajuwaka", "Sabbavaram", "Parawada"];

// ─── Helper UI Components (Top-level to preserve input focus across renders) ────
const inputCls = (err?: string) =>
  `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5C32E6] focus:border-transparent transition-all ${
    err ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
  }`;

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
  </div>
);

const Toggle = ({ label, value, onChange, color = "bg-[#5C32E6]" }: { label: string; value: boolean; onChange: () => void; color?: string }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${value ? color : "bg-gray-200"}`} onClick={onChange}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-7" : "translate-x-1"}`} />
    </div>
    <span className="text-sm font-bold text-gray-700">{label}</span>
  </label>
);

// ─── Admin Property Form ───────────────────────────────────────────────────────
const AdminPropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [urlInput, setUrlInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const loadProp = async () => {
        const prop = await fetchPropertyById(id);
        if (prop) {
          const imgs = prop.images ? prop.images.map((img) => img.url).filter(Boolean) : [];
          setForm({
            title: prop.title,
            propertyType: prop.propertyType,
            price: String(prop.price),
            area: String(prop.area),
            areaUnit: prop.areaUnit,
            description: prop.description,
            village: prop.location.village,
            mandal: prop.location.mandal,
            district: prop.location.district,
            state: prop.location.state,
            pincode: prop.location.pincode,
            latitude: prop.latitude ? String(prop.latitude) : "",
            longitude: prop.longitude ? String(prop.longitude) : "",
            mapUrl: prop.mapUrl ?? "",
            facing: prop.facing ?? "",
            roadAccess: prop.roadAccess ?? "",
            waterAvailability: prop.waterAvailability ?? "",
            electricityAvailability: prop.electricityAvailability ?? "",
            phoneNumber: prop.phoneNumber,
            whatsappNumber: prop.whatsappNumber,
            status: prop.status,
            reraApproved: prop.reraApproved ?? false,
            isVerified: prop.isVerified ?? false,
            bankLoanAvailable: prop.bankLoanAvailable ?? false,
            pricePerUnit: prop.pricePerUnit ?? "",
            imageUrls: imgs,
            nearbyFacility: "",
            nearbyFacilities: prop.nearbyFacilities ?? [],
          });
        }
      };
      loadProp();
    }
  }, [id, isEdit]);

  const set = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleMultipleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      fileList.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            const newUrl = reader.result;
            setForm((prev) => ({
              ...prev,
              imageUrls: [...prev.imageUrls, newUrl],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
      // reset file input
      e.target.value = "";
    }
  };

  const addUrlImage = () => {
    if (urlInput.trim()) {
      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, urlInput.trim()],
      }));
      setUrlInput("");
    }
  };

  const addFacility = () => {
    if (form.nearbyFacility.trim()) {
      set("nearbyFacilities", [...form.nearbyFacilities, form.nearbyFacility.trim()]);
      set("nearbyFacility", "");
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || isNaN(Number(form.price))) e.price = "Valid price is required";
    if (!form.area || isNaN(Number(form.area))) e.area = "Valid area is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.village.trim()) e.village = "Village is required";
    if (!form.mandal.trim()) e.mandal = "Mandal is required";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      alert("Please fill in all required fields correctly.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);

    const rawPropertyData: Omit<Property, "id" | "createdAt" | "updatedAt"> = {
      title: form.title,
      propertyType: form.propertyType,
      price: Number(form.price),
      area: Number(form.area),
      areaUnit: form.areaUnit,
      description: form.description,
      location: { village: form.village, mandal: form.mandal, district: form.district, state: form.state, pincode: form.pincode },
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
      mapUrl: form.mapUrl.trim() ? form.mapUrl.trim() : undefined,
      facing: form.facing, roadAccess: form.roadAccess, waterAvailability: form.waterAvailability,
      electricityAvailability: form.electricityAvailability, nearbyFacilities: form.nearbyFacilities,
      phoneNumber: form.phoneNumber, whatsappNumber: form.whatsappNumber,
      status: form.status as "available" | "sold",
      reraApproved: form.reraApproved, isVerified: form.isVerified, bankLoanAvailable: form.bankLoanAvailable,
      pricePerUnit: form.pricePerUnit.trim() ? form.pricePerUnit.trim() : undefined,
      images: form.imageUrls.map((url, idx) => ({ url, storagePath: "", isPrimary: idx === 0 })),
    };

    // Remove undefined fields to prevent Firestore errors
    const propertyData = Object.fromEntries(
      Object.entries(rawPropertyData).filter(([_, v]) => v !== undefined)
    ) as Omit<Property, "id" | "createdAt" | "updatedAt">;

    try {
      if (isEdit && id) {
        await updateProperty(id, propertyData);
      } else {
        await addProperty(propertyData as any);
      }
      navigate("/admin/properties");
    } catch (err: any) {
      console.error("Error saving property:", err);
      alert("Failed to save property. " + (err.message || "Please try again later."));
      setSaving(false);
    }
  };



  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{isEdit ? "Edit Property" : "Add New Property"}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{isEdit ? "Update the property listing details" : "Fill in details to publish a new listing"}</p>
          </div>
          <button onClick={() => navigate("/admin/properties")} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Basic Info ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 text-base">📋 Basic Information</h3>
            <div className="space-y-4">
              <Field label="Property Title *" error={errors.title}>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 5 Acres Lush Green Agricultural Land Near Highway" className={inputCls(errors.title)} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Property Type *">
                  <ComboInput value={form.propertyType} onChange={(v) => set("propertyType", v)} options={PROPERTY_TYPES} placeholder="Select or type..." />
                </Field>
                <Field label="Price (₹) *" error={errors.price}>
                  <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. 5000000" className={inputCls(errors.price)} />
                </Field>
                <Field label="Price Display Unit (Optional)">
                  <ComboInput value={form.pricePerUnit} onChange={(v) => set("pricePerUnit", v)} options={DISPLAY_UNITS} placeholder="e.g. Sq. Feet" />
                </Field>
                <Field label="Status *">
                  <ComboInput value={form.status} onChange={(v) => set("status", v)} options={["available", "sold"]} placeholder="Select status" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Area *" error={errors.area}>
                  <input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. 5" className={inputCls(errors.area)} />
                </Field>
                <Field label="Area Unit *">
                  <ComboInput value={form.areaUnit} onChange={(v) => set("areaUnit", v)} options={AREA_UNITS} placeholder="Select or type unit" />
                </Field>
              </div>

              <Field label="Description *" error={errors.description}>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Describe the property in detail — location advantages, soil type, road access, legal status..." className={inputCls(errors.description)} />
              </Field>
            </div>
          </div>

          {/* ── Location ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 text-base">📍 Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Village / Area *" error={errors.village}>
                <ComboInput value={form.village} onChange={(v) => set("village", v)} options={POPULAR_AREAS} placeholder="Select or type (e.g. Anandapuram)" />
              </Field>
              <Field label="Mandal *" error={errors.mandal}>
                <ComboInput value={form.mandal} onChange={(v) => set("mandal", v)} options={POPULAR_MANDALS} placeholder="Select or type (e.g. Bheemunipatnam)" />
              </Field>
              <Field label="District">
                <ComboInput value={form.district} onChange={(v) => set("district", v)} options={DISTRICTS} placeholder="Select district" />
              </Field>
              <Field label="State">
                <input value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls()} />
              </Field>
              <Field label="Pincode">
                <input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} placeholder="530052" className={inputCls()} maxLength={6} />
              </Field>

              {/* Map Coordinates & Link */}
              <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#5C32E6]" /> Google Maps Coordinates & Link (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Latitude (Lat)</label>
                    <input
                      value={form.latitude}
                      onChange={(e) => set("latitude", e.target.value)}
                      placeholder="e.g. 17.8867"
                      className={inputCls()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Longitude (Lng)</label>
                    <input
                      value={form.longitude}
                      onChange={(e) => set("longitude", e.target.value)}
                      placeholder="e.g. 83.3614"
                      className={inputCls()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Google Maps Link</label>
                    <input
                      value={form.mapUrl}
                      onChange={(e) => set("mapUrl", e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className={inputCls()}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  📍 Adding coordinates or map link will automatically display an interactive "View on Map" button on property cards for buyers.
                </p>
              </div>
            </div>
          </div>

          {/* ── Property Details ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 text-base">🏡 Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Facing">
                <ComboInput value={form.facing} onChange={(v) => set("facing", v)} options={FACINGS} placeholder="Select or type direction" />
              </Field>
              <Field label="Road Access">
                <ComboInput value={form.roadAccess} onChange={(v) => set("roadAccess", v)} options={ROAD_ACCESS} placeholder="e.g. 40 ft wide road" />
              </Field>
              <Field label="Water Availability">
                <ComboInput value={form.waterAvailability} onChange={(v) => set("waterAvailability", v)} options={WATER} placeholder="e.g. Borewell & Canal" />
              </Field>
              <Field label="Electricity">
                <ComboInput value={form.electricityAvailability} onChange={(v) => set("electricityAvailability", v)} options={ELECTRICITY} placeholder="e.g. 3-Phase connection" />
              </Field>
            </div>

            {/* Nearby Facilities */}
            <div className="mt-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nearby Facilities</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={form.nearbyFacility}
                  onChange={(e) => set("nearbyFacility", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
                  placeholder='e.g. Hospital (2km) — press Enter to add'
                  className={inputCls()}
                />
                <button type="button" onClick={addFacility} className="bg-[#5C32E6] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#4522B8] shrink-0 flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {form.nearbyFacilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.nearbyFacilities.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-[#5C32E6] text-xs font-bold px-3 py-1.5 rounded-full">
                      {f}
                      <button type="button" onClick={() => set("nearbyFacilities", form.nearbyFacilities.filter((_, idx) => idx !== i))} className="hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Media & Contact ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 text-base flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>📸 Media & Property Photos</span>
              <span className="text-xs font-normal text-gray-400">Upload photos from PC folder/phone gallery or add URLs</span>
            </h3>
            
            <div className="space-y-6">
              {/* Image Upload Component */}
              <div>
                {form.imageUrls.length === 0 ? (
                  /* ── State 1: NO IMAGES - Full-width screen-fit dropzone banner ── */
                  <label
                    htmlFor="multi-image-file-input"
                    className="w-full border-2 border-dashed border-[#5C32E6]/40 hover:border-[#5C32E6] bg-purple-50/40 hover:bg-purple-50/80 rounded-2xl py-10 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group shadow-sm"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#5C32E6] text-white flex items-center justify-center shadow-xl shadow-[#5C32E6]/30 group-hover:scale-110 transition-transform mb-3">
                      <Upload className="w-8 h-8" />
                    </div>
                    <span className="text-base font-extrabold text-gray-900 group-hover:text-[#5C32E6] transition-colors">
                      Upload Property Cover Photo
                    </span>
                    <span className="text-xs text-gray-500 max-w-sm mt-1">
                      Click or tap to open PC Folder or Phone Gallery. You can select multiple images at once.
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C32E6] bg-white px-4 py-2 rounded-xl mt-4 border border-purple-100 shadow-sm group-hover:bg-[#5C32E6] group-hover:text-white transition-all">
                      <Plus className="w-4 h-4" /> Select Files from Device
                    </span>
                  </label>
                ) : (
                  /* ── State 2: IMAGES UPLOADED - Compact Main Cover + Thumbnail Row ── */
                  <div className="space-y-4">
                    {/* Main Cover Banner */}
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 group h-56 sm:h-64">
                      <img
                        src={form.imageUrls[0]}
                        alt="Property Main Cover"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-[#5C32E6] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        ⭐ Main Cover Photo
                      </span>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label
                          htmlFor="multi-image-file-input"
                          className="bg-white text-gray-900 hover:bg-purple-50 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xl transition-all hover:scale-105"
                        >
                          <Upload className="w-4 h-4 text-[#5C32E6]" /> Add / Change Photos
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = form.imageUrls.slice(1);
                            setForm((prev) => ({ ...prev, imageUrls: updated }));
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xl transition-all hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" /> Remove Main Cover
                        </button>
                      </div>
                    </div>

                    {/* Thumbnail Row / Grid for Additional Photos */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          All Photos ({form.imageUrls.length})
                        </span>
                        <span className="text-[11px] text-gray-400">First image is used as main listing thumbnail</span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {form.imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className={`relative rounded-xl overflow-hidden border bg-gray-50 aspect-square group ${
                              index === 0 ? "border-2 border-[#5C32E6] ring-2 ring-[#5C32E6]/20" : "border-gray-200"
                            }`}
                          >
                            <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = form.imageUrls.filter((_, i) => i !== index);
                                setForm((prev) => ({ ...prev, imageUrls: updated }));
                              }}
                              className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {/* Compact Purple '+' Button Thumbnail to add more photos */}
                        <label
                          htmlFor="multi-image-file-input"
                          className="border-2 border-dashed border-[#5C32E6]/50 hover:border-[#5C32E6] bg-purple-50/70 hover:bg-purple-100 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all aspect-square group text-center"
                          title="Add more photos from PC or Phone gallery"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#5C32E6] text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                            <Plus className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-extrabold text-[#5C32E6] mt-1">Add More</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden Native File Input */}
                <input
                  id="multi-image-file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleMultipleFilesUpload}
                />
              </div>

              {/* Paste Image URL Field with '+' Button */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#5C32E6]" /> Or Add Image via Web URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addUrlImage();
                      }
                    }}
                    placeholder="Paste image web link (https://...) and click '+'"
                    className={inputCls()}
                  />
                  <button
                    type="button"
                    onClick={addUrlImage}
                    className="bg-[#5C32E6] hover:bg-[#4522B8] text-white px-5 py-2.5 rounded-xl font-bold shrink-0 flex items-center justify-center shadow-md shadow-[#5C32E6]/25 transition-all active:scale-95"
                    title="Add Image URL"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <Field label="Phone Number *" error={errors.phoneNumber}>
                  <input value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} placeholder="+919948720849" className={inputCls(errors.phoneNumber)} />
                </Field>
                <Field label="WhatsApp Number">
                  <input value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="+919948720849" className={inputCls()} />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Trust Badges ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 text-base">✅ Trust Badges</h3>
            <div className="flex flex-wrap gap-8">
              <Toggle label="RERA Approved" value={form.reraApproved} onChange={() => set("reraApproved", !form.reraApproved)} color="bg-[#5C32E6]" />
              <Toggle label="Verified Listing" value={form.isVerified} onChange={() => set("isVerified", !form.isVerified)} color="bg-emerald-500" />
            <div className="flex flex-col gap-2">
                <Toggle label="Bank Loan Available" value={form.bankLoanAvailable} onChange={() => set("bankLoanAvailable", !form.bankLoanAvailable)} color="bg-emerald-500" />
                {form.bankLoanAvailable && (
                  <p className="text-xs text-emerald-600 font-semibold ml-1">✅ A highlighted "Bank Loan Available" badge will appear on the property card and details page.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-4 pb-8">
            <button type="button" onClick={() => navigate("/admin/properties")} className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-[#5C32E6] hover:bg-[#4522B8] text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-[#5C32E6]/30 flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                <>{isEdit ? "Update Property" : "Publish Property"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminPropertyForm;
