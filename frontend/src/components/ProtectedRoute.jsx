// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Props:
 *  - children: element to render if authorized
 *  - requiredRole: optional string like "Admin" or "Customer"
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, user } = useAuth();

  if (!token) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    // if user info is available, check role
    const userRole = user?.role ?? user?.roles?.[0]; // adapt based on backend shape
    if (!userRole || userRole !== requiredRole) {
      // unauthorized for this role
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
