import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/dashboard/TopHeader";
import {
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
  deleteAccountApi,
} from "../../services/settingsService";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Shield,
  Bell,
  Palette,
  AlertTriangle,
  Check,
  Loader2,
  ChevronDown,
} from "lucide-react";

const TARGET_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "QA Engineer",
  "Cloud Architect",
  "Machine Learning Engineer",
  "Cybersecurity Analyst",
  "UI/UX Designer",
  "Other",
];

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification prefs (local state only)
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    quizReminders: true,
    progressUpdates: true,
    newFeatures: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const result = await getProfileApi();
      if (result.success) {
        setName(result.data.name || "");
        setEmail(result.data.email || "");
        const savedRole = result.data.targetRole || "";
        // Check if saved role matches a preset, otherwise treat as custom
        if (savedRole && !TARGET_ROLES.includes(savedRole)) {
          setTargetRole("Other");
          setCustomRoleInput(savedRole);
        } else {
          setTargetRole(savedRole);
          setCustomRoleInput("");
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    // Resolve the actual role to save
    const resolvedRole = targetRole === "Other" ? customRoleInput.trim() : targetRole.trim();
    if (!resolvedRole) {
      toast.error("Please select or enter a target role.");
      return;
    }

    try {
      setProfileSaving(true);
      const result = await updateProfileApi({ name: name.trim(), targetRole: resolvedRole });
      if (result.success) {
        toast.success("Profile updated successfully!");
        // Update local storage user so the rest of the app reflects changes
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.name = name.trim();
        storedUser.targetRole = resolvedRole;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      setPasswordSaving(true);
      const result = await changePasswordApi({ currentPassword, newPassword });
      if (result.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }
    if (!deletePassword) {
      toast.error("Password is required.");
      return;
    }
    try {
      setDeleteLoading(true);
      const result = await deleteAccountApi(deletePassword);
      if (result.success) {
        toast.success("Account deleted. Goodbye!");
        logout();
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar activeItem="Settings" onItemSelect={() => {}} onCloseMobile={() => setSidebarOpen(false)} />
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

        <main className="flex-1 p-6 sm:p-8 max-w-[1440px] w-full mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white tracking-tight">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-[#7e7e9a] mt-1">
              Manage your account, preferences, and security
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tabs sidebar */}
            <div className="lg:w-56 shrink-0">
              <div className="bg-[#131326] rounded-2xl border border-[#22223a] p-2 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/25"
                          : tab.id === "danger"
                          ? "text-[#ef4444] hover:bg-[#ef4444]/10"
                          : "text-[#8e8ea8] hover:text-white hover:bg-[#18182e]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 min-w-0">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-[#131326] rounded-2xl border border-[#22223a] p-6 sm:p-8 shadow-xl shadow-black/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6d28d9] to-[#8b5cf6] flex items-center justify-center shadow-md shadow-[#7c3aed]/30">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-headings font-bold text-white">Profile Information</h2>
                      <p className="text-[11px] text-[#7e7e9a]">Update your personal details</p>
                    </div>
                  </div>

                  {profileLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-6 h-6 text-[#7c3aed] animate-spin" />
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      {/* Avatar section */}
                      <div className="flex items-center gap-5 pb-6 border-b border-[#1e1e32]">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {name ? name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{name || "User"}</p>
                          <p className="text-xs text-[#7e7e9a] mt-0.5">{email}</p>
                          <p className="text-[10px] text-[#5e5e7a] mt-1">Member since account creation</p>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wider flex items-center gap-2">
                          <User className="w-3.5 h-3.5" /> Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#0b0b14] border border-[#22223a] text-sm text-white placeholder-[#5e5e7a] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 transition-all"
                          placeholder="Your full name"
                        />
                      </div>

                      {/* Email (read-only) */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wider flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" /> Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full px-4 py-3 rounded-xl bg-[#0b0b14]/50 border border-[#1a1a2e] text-sm text-[#5e5e7a] cursor-not-allowed"
                        />
                        <p className="text-[10px] text-[#5e5e7a]">Email cannot be changed</p>
                      </div>

                      {/* Target Role */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wider flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5" /> Target Role
                        </label>
                        <div className="relative">
                          <select
                            value={targetRole}
                            onChange={(e) => {
                              setTargetRole(e.target.value);
                              if (e.target.value !== "Other") {
                                setCustomRoleInput("");
                              }
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-[#0b0b14] border border-[#22223a] text-sm text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 transition-all appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#0b0b14] text-[#5e5e7a]">
                              Select your target role
                            </option>
                            {TARGET_ROLES.map((role) => (
                              <option key={role} value={role} className="bg-[#0b0b14]">
                                {role}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#5e5e7a]">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Custom role input when "Other" is selected */}
                        {targetRole === "Other" && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={customRoleInput}
                              onChange={(e) => setCustomRoleInput(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-[#0b0b14] border border-[#22223a] text-sm text-white placeholder-[#5e5e7a] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 transition-all"
                              placeholder="Enter your custom role, e.g. SDE-2, iOS Developer..."
                            />
                          </div>
                        )}

                        <p className="text-[10px] text-[#5e5e7a] leading-relaxed">
                          Your target role personalizes quizzes, resume analysis, and roadmap content.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#7c3aed]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {profileSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {profileSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="bg-[#131326] rounded-2xl border border-[#22223a] p-6 sm:p-8 shadow-xl shadow-black/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center shadow-md shadow-[#10b981]/30">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-headings font-bold text-white">Change Password</h2>
                      <p className="text-[11px] text-[#7e7e9a]">Update your password to keep your account secure</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" /> Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPw ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-11 rounded-xl bg-[#0b0b14] border border-[#22223a] text-sm text-white placeholder-[#5e5e7a] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 transition-all"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e5e7a] hover:text-white transition-colors cursor-pointer"
                        >
                          {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" /> New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPw ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-11 rounded-xl bg-[#0b0b14] border border-[#22223a] text-sm text-white placeholder-[#5e5e7a] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 transition-all"
                          placeholder="Enter new password (min 6 chars)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e5e7a] hover:text-white transition-colors cursor-pointer"
                        >
                          {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {newPassword.length > 0 && newPassword.length < 6 && (
                        <p className="text-[10px] text-[#ef4444]">Password must be at least 6 characters</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" /> Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#0b0b14] border border-[#22223a] text-sm text-white placeholder-[#5e5e7a] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 transition-all"
                        placeholder="Re-enter new password"
                      />
                      {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                        <p className="text-[10px] text-[#ef4444]">Passwords do not match</p>
                      )}
                      {confirmPassword.length > 0 && confirmPassword === newPassword && newPassword.length >= 6 && (
                        <p className="text-[10px] text-[#10b981] flex items-center gap-1">
                          <Check className="w-3 h-3" /> Passwords match
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#10b981]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {passwordSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      {passwordSaving ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="bg-[#131326] rounded-2xl border border-[#22223a] p-6 sm:p-8 shadow-xl shadow-black/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d97706] to-[#f59e0b] flex items-center justify-center shadow-md shadow-[#f59e0b]/30">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-headings font-bold text-white">Notification Preferences</h2>
                      <p className="text-[11px] text-[#7e7e9a]">Choose what updates you'd like to receive</p>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-lg">
                    {[
                      { key: "emailDigest", label: "Weekly Email Digest", desc: "Get a summary of your weekly progress" },
                      { key: "quizReminders", label: "Quiz Reminders", desc: "Daily reminders to take your practice quizzes" },
                      { key: "progressUpdates", label: "Progress Milestones", desc: "Notifications when you hit roadmap milestones" },
                      { key: "newFeatures", label: "New Features", desc: "Be the first to know about new platform features" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-[#0b0b14] border border-[#1e1e32] hover:border-[#2a2a3d] transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{item.label}</p>
                          <p className="text-[11px] text-[#7e7e9a] mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          onClick={() =>
                            setNotifications((prev) => ({
                              ...prev,
                              [item.key]: !prev[item.key],
                            }))
                          }
                          className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                            notifications[item.key] ? "bg-[#7c3aed]" : "bg-[#2a2a3d]"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                              notifications[item.key] ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-[#5e5e7a] mt-6">
                    * Notification preferences are saved locally on this device.
                  </p>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="bg-[#131326] rounded-2xl border border-[#22223a] p-6 sm:p-8 shadow-xl shadow-black/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#ec4899] flex items-center justify-center shadow-md shadow-[#ec4899]/30">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-headings font-bold text-white">Appearance</h2>
                      <p className="text-[11px] text-[#7e7e9a]">Customize the look and feel</p>
                    </div>
                  </div>

                  <div className="space-y-6 max-w-lg">
                    {/* Theme */}
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wider">
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { name: "Dark", active: true, bg: "#0b0b14", border: "#7c3aed" },
                          { name: "Light", active: false, bg: "#f5f5f5", border: "#22223a" },
                          { name: "System", active: false, bg: "linear-gradient(135deg, #0b0b14 50%, #f5f5f5 50%)", border: "#22223a" },
                        ].map((theme) => (
                          <button
                            key={theme.name}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                              theme.active
                                ? "border-[#7c3aed] shadow-lg shadow-[#7c3aed]/20"
                                : "border-[#22223a] hover:border-[#3a3a5a] opacity-50"
                            }`}
                          >
                            <div
                              className="w-full h-12 rounded-lg mb-2"
                              style={{
                                background: theme.bg,
                                border: theme.name === "Light" ? "1px solid #ddd" : "none",
                              }}
                            />
                            <p className="text-xs font-medium text-white text-center">{theme.name}</p>
                            {theme.active && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#7c3aed] flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-[#5e5e7a]">
                        Currently only dark mode is available. More themes coming soon!
                      </p>
                    </div>

                    {/* Accent color */}
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wider">
                        Accent Color
                      </label>
                      <div className="flex gap-3">
                        {[
                          { color: "#7c3aed", name: "Purple", active: true },
                          { color: "#06b6d4", name: "Cyan", active: false },
                          { color: "#10b981", name: "Emerald", active: false },
                          { color: "#f59e0b", name: "Amber", active: false },
                          { color: "#ec4899", name: "Pink", active: false },
                        ].map((accent) => (
                          <button
                            key={accent.name}
                            title={accent.name}
                            className={`w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer ${
                              accent.active
                                ? "ring-2 ring-offset-2 ring-offset-[#131326] scale-110"
                                : "opacity-50 hover:opacity-75"
                            }`}
                            style={{
                              background: accent.color,
                              ringColor: accent.active ? accent.color : "transparent",
                            }}
                          >
                            {accent.active && (
                              <Check className="w-4 h-4 text-white mx-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-[#5e5e7a]">
                        Accent color customization coming in a future update.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === "danger" && (
                <div className="bg-[#131326] rounded-2xl border border-[#ef4444]/30 p-6 sm:p-8 shadow-xl shadow-black/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#dc2626] to-[#ef4444] flex items-center justify-center shadow-md shadow-[#ef4444]/30">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-headings font-bold text-[#ef4444]">Danger Zone</h2>
                      <p className="text-[11px] text-[#7e7e9a]">
                        Irreversible actions — proceed with extreme caution
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0b0b14] border border-[#ef4444]/20 space-y-5 max-w-lg">
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">Delete Account</h3>
                      <p className="text-[11px] text-[#7e7e9a] leading-relaxed">
                        This will permanently delete your account and all associated data including quiz history,
                        roadmaps, resume analyses, and progress. This action cannot be undone.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#a0a0b8]">
                          Your Password
                        </label>
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#131326] border border-[#22223a] text-sm text-white placeholder-[#5e5e7a] focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/30 transition-all"
                          placeholder="Enter your password"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#a0a0b8]">
                          Type <span className="text-[#ef4444] font-mono">DELETE</span> to confirm
                        </label>
                        <input
                          type="text"
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#131326] border border-[#22223a] text-sm text-white placeholder-[#5e5e7a] focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/30 transition-all font-mono"
                          placeholder='Type "DELETE"'
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading || deleteConfirm !== "DELETE"}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#ef4444]/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {deleteLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      {deleteLoading ? "Deleting..." : "Delete My Account"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;
