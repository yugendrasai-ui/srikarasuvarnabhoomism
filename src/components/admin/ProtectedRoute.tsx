import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("admin_auth") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
