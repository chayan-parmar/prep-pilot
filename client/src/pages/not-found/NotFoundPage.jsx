import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Home, LayoutDashboard, Ghost } from "lucide-react";

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7c3aed]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#06b6d4]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-md w-full text-center space-y-8">
        {/* Animated Ghost Icon */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 border border-[#7c3aed]/30 flex items-center justify-center animate-bounce">
          <Ghost className="w-12 h-12 text-[#a78bfa]" />
        </div>

        {/* 404 Text */}
        <div className="space-y-3">
          <h1 className="text-7xl font-headings font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl font-headings font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-sm text-[#8e8ea8] leading-relaxed max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#7c3aed]/30 hover:shadow-[#7c3aed]/50"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#7c3aed]/30 hover:shadow-[#7c3aed]/50"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          )}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#131326] border border-[#22223a] hover:border-[#7c3aed]/40 text-[#e8e8f0] font-medium text-sm rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
