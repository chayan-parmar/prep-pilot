import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GitFork,
  BookOpen,
  HelpCircle,
  Code2,
  Video,
  Sparkles,
  Folder,
  TrendingUp,
  Settings,
  Zap,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Resume Analyzer", icon: FileText, path: "/resume-analyzer" },
  { name: "Job Analyzer", icon: Briefcase, path: "/job-analyzer" },
  { name: "Roadmap", icon: GitFork, path: "/roadmap" },
  { name: "Learn", icon: BookOpen, path: "/learn" },
  { name: "Quiz", icon: HelpCircle, path: "/quiz" },
  { name: "Coding Practice", icon: Code2, path: "/coding-practice" },
  { name: "Mock Interview", icon: Video, path: "/mock-interview" },
  { name: "AI Mentor", icon: Sparkles, path: "/ai-mentor" },
  { name: "Resources", icon: Folder, path: "/resources" },
  { name: "Progress", icon: TrendingUp, path: "/progress" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar({ activeItem = "Dashboard", onItemSelect, onCloseMobile }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = (item) => {
    if (onItemSelect) {
      onItemSelect(item.name);
    }
    if (item.path) {
      navigate(item.path);
    }
    // Close mobile sidebar drawer after navigation
    if (onCloseMobile) {
      onCloseMobile();
    }
  };


  return (
    <aside className="w-64 bg-[#0f0f1c] border-r border-[#1e1e32] flex flex-col justify-between shrink-0 min-h-screen p-5 select-none relative">
      {/* Top Branding Logo */}
      <div className="space-y-6">
        <Link to="/" className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6d28d9] to-[#8b5cf6] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-[#7c3aed]/30">
            PP
          </div>
          <div>
            <h1 className="font-headings font-bold text-white text-base tracking-tight leading-none">
              PrepPilot
            </h1>
            <p className="text-[10px] text-[#6b6b8a] font-medium mt-1">
              Your AI Interview Copilot
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/25 font-semibold"
                    : "text-[#8e8ea8] hover:text-white hover:bg-[#18182e]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#7e7e9a]"}`} />
                <span>{item.name}</span>
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200 cursor-pointer mt-2"
          >
            <LogOut className="w-4 h-4 text-[#ef4444]" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>

      {/* Upgrade to Pro Card at Bottom */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-b from-[#191635] to-[#121026] border border-[#2d2858] space-y-3 relative overflow-hidden">
        {/* Glow halo */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#7c3aed]/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-2 text-[#a78bfa] text-xs font-semibold">
          <Zap className="w-4 h-4 fill-[#a78bfa]" />
          <span>Upgrade to Pro</span>
        </div>
        <p className="text-[11px] text-[#7e7e9e] leading-relaxed">
          Unlock unlimited mocks, advanced analytics and more.
        </p>
        <button
          onClick={() => navigate("/mock-interview")}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-[#7c3aed]/30 cursor-pointer"
        >
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
