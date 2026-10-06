import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Cpu, Map, LineChart, LogIn } from "lucide-react";
import SocialButtons from "../../components/auth/SocialButtons";

function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine where to redirect after login
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await login(data.email, data.password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      navigate(from, { replace: true });
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

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0b0b14] text-[#e8e8f0] font-sans">
      {/* Left Column - Marketing & Stats (Ultra-spacious layout with maximum breathing room) */}
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

        {/* Hero Message */}
        <div className="my-auto max-w-xl z-10 space-y-8">
          <div>
            <h1 className="font-headings text-5xl xl:text-6xl font-bold leading-tight mb-5 text-white">
              Your Dream Job <br />
              <span className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>
            <p className="text-[#6b6b8a] text-base sm:text-lg leading-relaxed max-w-lg">
              Join 10,000+ professionals who cracked their interviews using AI-powered preparation.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-6 pt-3">
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-[#18182b] border border-[#2a2a3e] flex items-center justify-center text-[#8b5cf6] shrink-0 shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-[#d1d1e0]">
                AI-powered mock interviews with real feedback
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-[#18182b] border border-[#2a2a3e] flex items-center justify-center text-[#8b5cf6] shrink-0 shadow-sm">
                <Map className="w-5 h-5" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-[#d1d1e0]">
                Personalized roadmaps for your target role
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-[#18182b] border border-[#2a2a3e] flex items-center justify-center text-[#8b5cf6] shrink-0 shadow-sm">
                <LineChart className="w-5 h-5" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-[#d1d1e0]">
                Track progress with detailed analytics
              </span>
            </div>
          </div>
        </div>

        {/* Footer Metrics Grid */}
        <div className="mt-auto border-t border-[#1e1e2e] pt-8 z-10 space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl xl:text-4xl font-headings font-bold text-white">10K+</div>
              <div className="text-xs sm:text-sm text-[#6b6b8a] mt-1">Active Users</div>
            </div>
            <div>
              <div className="text-3xl xl:text-4xl font-headings font-bold text-white">95%</div>
              <div className="text-xs sm:text-sm text-[#6b6b8a] mt-1">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl xl:text-4xl font-headings font-bold text-white">50K+</div>
              <div className="text-xs sm:text-sm text-[#6b6b8a] mt-1">Interviews Done</div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#6b6b8a]">
            Trusted by engineers at Google, Amazon, Meta & more.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form (Ultra-wide form with tall inputs & spacious paddings) */}
      <div className="flex items-center justify-center p-10 sm:p-14 lg:p-18 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-lg space-y-7 my-auto">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl xl:text-4xl font-headings font-bold text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm sm:text-base text-[#6b6b8a]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>

          {/* Social Sign-In */}
          <div className="space-y-5">
            <SocialButtons />
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-[#1e1e2e]" />
              <span className="text-xs text-[#52526b] uppercase tracking-wider font-medium">
                or continue with email
              </span>
              <div className="h-[1px] flex-1 bg-[#1e1e2e]" />
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    errors.email
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-[#252538] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
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

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs sm:text-sm font-medium text-[#8e8ea8] block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#52526b]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3.5 bg-[#141424] border ${
                    errors.password
                      ? "border-red-500/80 focus:border-red-500"
                      : "border-[#252538] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
                  } rounded-xl text-sm sm:text-base text-[#e8e8f0] placeholder-[#52526b] outline-none transition-all duration-200`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#52526b] hover:text-[#e8e8f0] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#8b5cf6] bg-[#141424] border-[#252538] accent-[#8b5cf6] focus:ring-[#8b5cf6]/20"
                  {...register("rememberMe")}
                />
                <span className="text-xs sm:text-sm text-[#8e8ea8] hover:text-[#e8e8f0] transition-colors">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() => {
                  import("react-hot-toast").then((mod) =>
                    mod.default("Password reset coming soon!", {
                      icon: "🔒",
                      style: {
                        background: "#13132a",
                        color: "#e8e8f0",
                        border: "1px solid #2a2a3d",
                      },
                    })
                  );
                }}
                className="text-xs sm:text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition-colors font-medium cursor-pointer bg-transparent border-none"
              >
                Forgot password?
              </button>
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
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Terms */}
          <p className="text-center text-xs sm:text-sm text-[#52526b] leading-relaxed pt-4 border-t border-[#1e1e2e]">
            By signing in, you agree to our{" "}
            <a href="#" className="underline text-[#6b6b8a] hover:text-[#e8e8f0] transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline text-[#6b6b8a] hover:text-[#e8e8f0] transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;