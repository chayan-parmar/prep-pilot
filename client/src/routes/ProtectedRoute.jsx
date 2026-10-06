import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b14] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-[#7e7e9a] font-medium tracking-wide">Validating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
