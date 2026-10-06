import React, { useState, useRef, useEffect } from "react";
import { Flame, Bell, LogOut, Menu, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function TopHeader({ onToggleSidebar, streakCount = 7, notificationCount = 2 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userName = user?.name || "Arjun";
  const userEmail = user?.email || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="px-6 py-4 border-b border-[#1b1b30] bg-[#0b0b14]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
      {/* Left Title / Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-[#15152a] text-[#8e8ea8] hover:text-white border border-[#242442]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center text-white text-xs font-bold lg:hidden">
            PP
          </div>
          <span className="font-headings font-bold text-base text-white tracking-tight">
            PrepPilot
          </span>
        </div>
      </div>

      {/* Right Top Bar Items */}
      <div className="flex items-center gap-4">
        {/* Streak Pill Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15152a] border border-[#262642] text-xs font-semibold text-[#e8e8f0]">
          <Flame className="w-4 h-4 text-[#ff7a00] fill-[#ff7a00]" />
          <span>
            {streakCount} days <span className="text-[#8e8ea8] font-normal">streak</span>
          </span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-full bg-[#15152a] border border-[#262642] text-[#8e8ea8] hover:text-white transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7c3aed] text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#0b0b14]">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-[#15152a] transition-colors cursor-pointer border border-transparent hover:border-[#262642]"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6d28d9] to-[#06b6d4] p-[1.5px]">
              <div className="w-full h-full rounded-full bg-[#18182e] flex items-center justify-center text-white font-bold text-xs">
                {userInitials || "A"}
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8e8ea8] transition-transform duration-200 hidden sm:block ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#131326] border border-[#22223a] shadow-2xl py-2 z-50">
              <div className="px-4 py-3 border-b border-[#1e1e36]">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                {userEmail && <p className="text-[11px] text-[#7e7e9a] truncate mt-0.5">{userEmail}</p>}
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-xs text-[#ef4444] hover:bg-[#ef4444]/10 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
