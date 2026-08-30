import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminPropertyForm from "./pages/admin/AdminPropertyForm";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import { useTheme } from "./utils/theme";

function App() {
  useTheme();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Site */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetails />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
              <FloatingWhatsApp />
            </div>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute>
              <AdminProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties/new"
          element={
            <ProtectedRoute>
              <AdminPropertyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties/:id/edit"
          element={
            <ProtectedRoute>
              <AdminPropertyForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
