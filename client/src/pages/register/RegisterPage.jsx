import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ChevronDown,
  UserPlus,
  ShieldCheck,
  Zap,
  CreditCard,
  Star,
} from "lucide-react";
import SocialButtons from "../../components/auth/SocialButtons";

const TARGET_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
];

function RegisterPage() {
  const { register: registerUserContext, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      targetRole: "Frontend Developer",
      password: "",
      agreeTerms: false,
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Watch password value to dynamically calculate strength
  const watchPassword = watch("password");
  useEffect(() => {
    setPasswordValue(watchPassword || "");
    const val = watchPassword || "";
    if (val.length === 0) {
      setPasswordStrength(0);
    } else if (val.length < 6) {
      setPasswordStrength(1);
    } else if (
      val.length >= 8 &&
      /[0-9]/.test(val) &&
      /[A-Z]/.test(val) &&
      /[^A-Za-z0-9]/.test(val)
    ) {
      setPasswordStrength(3);
    } else {
      setPasswordStrength(2);
    }
  }, [watchPassword]);

  const getStrengthLabelAndColor = () => {
    switch (passwordStrength) {
      case 1:
        return { label: "Weak password", color: "text-red-400" };
      case 2:
        return { label: "Medium password", color: "text-yellow-400" };
      case 3:
        return { label: "Strong password", color: "text-emerald-400" };
      default:
        return { label: "", color: "" };
    }
  };

  const onSubmit = async (data) => {
    if (!data.agreeTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsSubmitting(true);
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const result = await registerUserContext(
      fullName,
      data.email,
      data.password,
      data.targetRole
    );
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b14] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const strengthDetails = getStrengthLabelAndColor();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0b0b14] text-[#e8e8f0] font-sans">
      {/* Left Column - Marketing & Process (Ultra-spacious layout with maximum breathing room) */}
      <div className="relative hidden lg:flex flex-col justify-between p-16 lg:p-20 xl:p-24 overflow-hidden bg-radial-[at_left_bottom] from-[#1e1b4b] via-[#0b0b14] to-[#0b0b14] border-r border-[#1e1e2e]">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#8b5cf6]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#06b6d4]/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-10 h-10 bg-[#8b5cf6] rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xl shadow-[#8b5cf6]/30">
            PP
          </div>
          <span className="font-headings font-bold text-xl tracking-tight text-white">
            PrepPilot
          </span>
        </div>

        {/* Hero Message & Process Steps */}
        <div className="my-auto max-w-xl z-10 space-y-8">
          <div>
            <h1 className="font-headings text-5xl xl:text-6xl font-bold leading-tight mb-5 text-white">
              Start Your Journey <br />
              <span className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
                to Success
              </span>
            </h1>
            <p className="text-[#6b6b8a] text-base sm:text-lg leading-relaxed max-w-lg">
              Create your free account and get personalized AI-powered interview coaching today.
            </p>
          </div>

          {/* Numbered Process Steps */}
          <div className="space-y-5 pt-3">
            <div className="flex items-center gap-5">
              <div className="w-9 h-9 rounded-full bg-[#18182b] border border-[#8b5cf6] flex items-center justify-center text-sm font-semibold text-[#8b5cf6] shrink-0">
                01
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">Create Account</h4>
                <p className="text-xs sm:text-sm text-[#6b6b8a]">Sign up in under 60 seconds</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-9 h-9 rounded-full bg-[#18182b] border border-[#252538] flex items-center justify-center text-sm font-semibold text-[#6b6b8a] shrink-0">
                02
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">Upload Resume</h4>
                <p className="text-xs sm:text-sm text-[#6b6b8a]">Get instant AI analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-9 h-9 rounded-full bg-[#18182b] border border-[#252538] flex items-center justify-center text-sm font-semibold text-[#6b6b8a] shrink-0">
                03
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">Start Practicing</h4>
                <p className="text-xs sm:text-sm text-[#6b6b8a]">Follow your personalized roadmap</p>
              </div>
            </div>
          </div>

          {/* Spacious Testimonial Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131326] border border-[#222238] space-y-5 shadow-2xl">
            <p className="text-sm sm:text-base text-[#e8e8f0] italic leading-relaxed">
              "PrepPilot helped me land my dream job at Google. The mock interviews were incredibly realistic!"
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">Priya S.</h5>
                  <p className="text-xs text-[#6b6b8a]">Software Engineer @ Google</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-auto border-t border-[#1e1e2e] pt-6 z-10">
          <span className="text-xs sm:text-sm text-[#6b6b8a]">
            Free forever • No credit card required
          </span>
        </div>
      </div>

      {/* Right Column - Signup Form (Ultra-wide form with tall inputs & large paddings) */}
      <div className="flex items-center justify-center p-10 sm:p-14 lg:p-18 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-lg space-y-7 my-auto">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl xl:text-4xl font-headings font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-sm sm:text-base text-[#6b6b8a]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Social Sign-In */}
          <div className="space-y-5">
            <SocialButtons />
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-[#1e1e2e]" />
              <span className="text-xs text-[#52526b] uppercase tracking-wider font-medium">
                or sign up with email
              </span>
              <div className="h-[1px] flex-1 bg-[#1e1e2e]" />
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* First & Last Name Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-xs sm:text-sm font-medium text-[#8e8ea8] block">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Arjun"
                  className={`w-full px-4 py-3.5 bg-[#141424] border ${
                    errors.firstName ? "border-red-500/80 focus:border-red-500" : "border-[#252538] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
                  } rounded-xl text-sm sm:text-base text-[#e8e8f0] placeholder-[#52526b] outline-none transition-all duration-200`}
                  {...register("firstName", { required: "Required" })}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-xs sm:text-sm font-medium text-[#8e8ea8] block">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Sharma"
                  className={`w-full px-4 py-3.5 bg-[#141424] border ${
                    errors.lastName ? "border-red-500/80 focus:border-red-500" : "border-[#252538] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
                  } rounded-xl text-sm sm:text-base text-[#e8e8f0] placeholder-[#52526b] outline-none transition-all duration-200`}
                  {...register("lastName", { required: "Required" })}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs sm:text-sm font-medium text-[#8e8ea8] block">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#52526b]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="arjun@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-[#141424] border ${
                    errors.email ? "border-red-500/80 focus:border-red-500" : "border-[#252538] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
                  } rounded-xl text-sm sm:text-base text-[#e8e8f0] placeholder-[#52526b] outline-none transition-all duration-200`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Target Role Dropdown */}
            <div className="space-y-2">
              <label htmlFor="targetRole" className="text-xs sm:text-sm font-medium text-[#8e8ea8] block">
                Target Role
              </label>
              <div className="relative">
                <select
                  id="targetRole"
                  className="w-full px-4 py-3.5 bg-[#141424] border border-[#252538] rounded-xl text-sm sm:text-base text-[#e8e8f0] outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] transition-all duration-200 appearance-none cursor-pointer"
                  {...register("targetRole", { required: "Target role is required" })}
                >
                  {TARGET_ROLES.map((role) => (
                    <option key={role} value={role} className="bg-[#141424]">
                      {role}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#52526b]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs sm:text-sm font-medium text-[#8e8ea8] block">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#52526b]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-28 py-3.5 bg-[#141424] border ${
                    errors.password ? "border-red-500/80 focus:border-red-500" : "border-[#252538] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
                  } rounded-xl text-sm sm:text-base text-[#e8e8f0] placeholder-[#52526b] outline-none transition-all duration-200`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                
                {/* 3 Strength Dash Bars Inside Input (Matching Screenshot) */}
                <div className="absolute right-12 flex items-center gap-1.5 pointer-events-none">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-4 h-1.5 rounded-sm transition-all duration-300 ${
                        passwordValue.length > 0 && step <= (passwordStrength || 1)
                          ? passwordStrength === 1
                            ? "bg-red-500"
                            : passwordStrength === 2
                            ? "bg-yellow-500"
                            : "bg-[#10b981]"
                          : "bg-[#252538]"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 flex items-center text-[#52526b] hover:text-[#e8e8f0] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Label Below Input */}
              {passwordValue.length > 0 && (
                <p className={`text-xs font-medium pt-1 ${strengthDetails.color}`}>
                  {strengthDetails.label}
                </p>
              )}

              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Terms of Service Checkbox */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#8b5cf6] bg-[#141424] border-[#252538] accent-[#8b5cf6] focus:ring-[#8b5cf6]/20"
                  {...register("agreeTerms", { required: true })}
                />
                <span className="text-xs sm:text-sm text-[#8e8ea8]">
                  I agree to the{" "}
                  <a href="#" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors font-medium">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-red-400">You must agree to the terms to sign up</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 flex items-center justify-center gap-2.5 py-4 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:bg-[#8b5cf6]/50 text-white rounded-xl font-medium tracking-wide transition-all shadow-xl shadow-[#8b5cf6]/25 cursor-pointer text-sm sm:text-base"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Free Account</span>
                </>
              )}
            </button>
          </form>

          {/* Secure Trust Badges */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-[#52526b] border-t border-[#1e1e2e]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#06b6d4]" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#8b5cf6]" />
              <span>No Credit Card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;