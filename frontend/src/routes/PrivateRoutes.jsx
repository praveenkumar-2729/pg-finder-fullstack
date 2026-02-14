import { Navigate } from "react-router-dom";

export default function PrivateRoutes({ children, role }) {
  const accountId = localStorage.getItem("account_id");
  const userRole = localStorage.getItem("role");

  // 🔒 Not logged in
  if (!accountId) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Role mismatch
  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
