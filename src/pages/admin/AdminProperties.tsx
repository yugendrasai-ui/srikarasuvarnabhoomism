import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Search, Building2, Loader2, Database } from "lucide-react";
import type { Property } from "../../types/property";
import { fetchAllProperties, deleteProperty, updateProperty, migrateLocalStorageToFirestore } from "../../services/propertyService";

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [migrateMsg, setMigrateMsg] = useState("");

  const loadProperties = async () => {
    setLoading(true);
    const data = await fetchAllProperties();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => { loadProperties(); }, []);

  const handleDelete = async (id: string) => {
    await deleteProperty(id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const toggleStatus = async (id: string) => {
    const prop = properties.find((p) => p.id === id);
    if (!prop) return;
    const newStatus = prop.status === "available" ? "sold" : "available";
    await updateProperty(id, { status: newStatus });
    setProperties((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleMigrate = async () => {
    setMigrating(true);
    const count = await migrateLocalStorageToFirestore();
    setMigrateMsg(`✅ Migrated ${count} properties from local storage to Firestore!`);
    setMigrating(false);
    if (count > 0) loadProperties();
  };


  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const filtered = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.village.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Properties</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">{filtered.length} listings in Firestore</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* One-time migrate button */}
          <button
            onClick={handleMigrate}
            disabled={migrating}
            title="Migrate old localStorage properties to Firestore (run once)"
            className="inline-flex items-center gap-1.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-[#5C32E6] dark:hover:text-[#9B80FF] hover:border-[#5C32E6] px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            {migrating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Migrate Old Data
          </button>
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 bg-[#5C32E6] hover:bg-[#4522B8] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-[#5C32E6]/30"
          >
            <Plus className="w-4 h-4" /> Add New Property
          </Link>
        </div>
      </div>

      {migrateMsg && (
        <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold px-4 py-3 rounded-xl">{migrateMsg}</div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-4 mb-4 flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5C32E6] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {["all", "available", "sold"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-[#5C32E6] text-white"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#5C32E6] mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400 font-medium">Loading from Firestore...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Property</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 dark:text-slate-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No properties found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-slate-100 truncate max-w-[180px]">{p.title}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{p.area} {p.areaUnit}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="capitalize text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-semibold">{p.propertyType}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-400 hidden lg:table-cell">
                      {p.location.village}, {p.location.district}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#5C32E6] dark:text-[#9B80FF]">{formatPrice(p.price)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                          p.status === "available"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                            : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                        }`}
                        title="Click to toggle status"
                      >
                        {p.status === "available" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {p.status === "available" ? "Available" : "Sold"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/properties/${p.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100 dark:border-slate-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Delete Property?</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">This action cannot be undone. The property listing will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProperties;
