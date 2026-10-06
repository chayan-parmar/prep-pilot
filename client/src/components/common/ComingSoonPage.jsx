import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import TopHeader from "../dashboard/TopHeader";
import {
  Sparkles,
  Rocket,
  Bell,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Zap,
} from "lucide-react";

function ComingSoonPage({ title = "Feature", icon: Icon = Sparkles, description = "", features = [] }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(title);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar activeItem={activeTab} onItemSelect={(item) => setActiveTab(item)} onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="max-w-lg w-full space-y-8">
            {/* Back button */}
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#7e7e9a] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            {/* Hero Card */}
            <div className="relative rounded-[24px] p-8 sm:p-10 bg-[#131326] border border-[#22223a] shadow-2xl shadow-black/30 overflow-hidden text-center space-y-6">
              {/* Background glow effects */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#06b6d4]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Animated Icon */}
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 border border-[#7c3aed]/30 flex items-center justify-center">
                <Icon className="w-9 h-9 text-[#a78bfa]" />
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#7c3aed] flex items-center justify-center">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3 relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7c3aed]/15 border border-[#7c3aed]/30 text-[11px] font-semibold text-[#a78bfa]">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>COMING SOON</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white">
                  {title}
                </h1>

                <p className="text-sm text-[#8e8ea8] leading-relaxed max-w-sm mx-auto">
                  {description || `We're building something amazing! ${title} will be available soon with powerful AI-driven features.`}
                </p>
              </div>

              {/* Planned Features List */}
              {features.length > 0 && (
                <div className="space-y-3 pt-2 text-left max-w-xs mx-auto">
                  <span className="text-[10px] font-bold text-[#7e7e9a] uppercase tracking-wider">
                    Planned Features
                  </span>
                  <ul className="space-y-2.5">
                    {features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#d1d1e0]">
                        <CheckCircle2 className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Subscribe / Notify Button */}
              <div className="pt-2 relative">
                {subscribed ? (
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 text-sm font-semibold text-[#10b981] animate-pulse">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>We'll notify you when it's ready!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#7c3aed]/30 hover:shadow-[#7c3aed]/50 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notify Me When Available</span>
                  </button>
                )}
              </div>

              {/* Pro Upgrade Badge */}
              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[#7e7e9a]">
                <Zap className="w-3.5 h-3.5 text-[#a78bfa]" />
                <span>
                  This feature will be included in <span className="text-[#a78bfa] font-semibold">Pro plan</span>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ComingSoonPage;
