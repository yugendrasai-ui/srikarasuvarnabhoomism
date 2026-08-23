import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/admin" },
  { label: "Properties", icon: <Building2 className="w-5 h-5" />, href: "/admin/properties" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/admin/login");
  };

  const Sidebar = () => (
    <aside className="w-64 bg-[#1E1333] text-white flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-3 bg-white/5">
        <Link to="/" className="inline-block">
          <img
            src="/logo.png"
            alt="Srikara Suvarnabhoomi Logo"
            className="h-10 w-auto object-contain bg-white/90 p-1.5 rounded-lg"
          />
        </Link>
        {/* Close button for mobile */}
        <button className="ml-auto md:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-[10px] font-bold text-purple-400/60 uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href === "/admin/properties" && location.pathname.startsWith("/admin/properties"));
          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? "bg-[#5C32E6] text-white shadow-lg shadow-[#5C32E6]/30"
                  : "text-purple-200/80 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-white" : "text-purple-300 group-hover:text-white transition-colors"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5C32E6] to-[#7A5AF0] flex items-center justify-center text-white font-bold text-base shadow">
            S
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Subbu</p>
            <p className="text-xs text-purple-300 mt-0.5">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  const pageTitle = navItems.find((n) =>
    location.pathname === n.href || (n.href === "/admin/properties" && location.pathname.startsWith("/admin/properties"))
  )?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:min-h-screen">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (drawer) */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <button className="md:hidden text-gray-500 hover:text-[#5C32E6] p-1" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">{pageTitle}</h1>
            <p className="text-xs text-gray-400 hidden sm:block">Srikara Suvarnabhoomi Management Portal</p>
          </div>
          <Link
            to="/"
            target="_blank"
            className="ml-auto text-xs font-semibold text-[#5C32E6] hover:underline flex items-center gap-1"
          >
            View Website <ChevronRight className="w-3 h-3" />
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
