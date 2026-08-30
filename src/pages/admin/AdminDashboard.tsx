import AdminLayout from "../../components/admin/AdminLayout";
import { Building2, CheckCircle, XCircle, TrendingUp, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchAllProperties } from "../../services/propertyService";
import type { Property } from "../../types/property";

const AdminDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      const data = await fetchAllProperties();
      setProperties(data);
      setLoading(false);
    };
    loadProperties();
  }, []);

  const total = properties.length;
  const available = properties.filter((p) => p.status === "available").length;
  const sold = properties.filter((p) => p.status === "sold").length;
  const verified = properties.filter((p) => p.isVerified).length;

  const stats = [
    {
      label: "Total Properties",
      value: total,
      icon: <Building2 className="w-6 h-6" />,
      color: "bg-[#5C32E6]",
      light: "bg-purple-50 text-[#5C32E6]",
    },
    {
      label: "Available",
      value: available,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-emerald-500",
      light: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Sold",
      value: sold,
      icon: <XCircle className="w-6 h-6" />,
      color: "bg-rose-500",
      light: "bg-rose-50 text-rose-600",
    },
    {
      label: "Verified Listings",
      value: verified,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-orange-500",
      light: "bg-orange-50 text-orange-600",
    },
  ];

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <AdminLayout>
      {/* Welcome */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome back, Subbu! 👋</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Here's what's happening on your platform today.</p>
        </div>
        <Link
          to="/admin/properties/new"
          className="flex items-center gap-2 bg-[#5C32E6] hover:bg-[#4522B8] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-[#5C32E6]/30"
        >
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-[#5C32E6] mb-3" />
          Loading dashboard data...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
            <div className={`w-12 h-12 rounded-xl ${stat.light} dark:bg-slate-800 flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Properties</h3>
          <Link to="/admin/properties" className="text-sm text-[#5C32E6] dark:text-[#9B80FF] font-semibold hover:underline">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Property</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {properties.slice(0, 5).map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-slate-100 truncate max-w-[200px]">{p.title}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 capitalize mt-0.5">{p.propertyType} · {p.area} {p.areaUnit}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-slate-400">
                    {p.location.village}, {p.location.district}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#5C32E6] dark:text-[#9B80FF]">{formatPrice(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.status === "available"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
                    }`}>
                      {p.status === "available" ? "✓ Available" : "✕ Sold"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
