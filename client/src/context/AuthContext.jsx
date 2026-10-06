import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem("user");
        }
      }

      if (storedToken) {
        try {
          const response = await API.get("/auth/profile");
          if (response.data.success && response.data.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.warn("Backend auth profile check error:", error.response?.data?.message || error.message);
          // If token is invalid or expired (401), reset auth state
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, message: response.data.message || "Logged in successfully!" };
      }
      return { success: false, message: response.data.message || "Login failed." };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Unable to login. Please check server connection.";
      return { success: false, message: errorMsg };
    }
  };

  // Register handler
  const register = async (name, email, password, targetRole) => {
    try {
      const response = await registerUser({ name, email, password, targetRole });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, message: response.data.message || "Registered successfully!" };
      }
      return { success: false, message: response.data.message || "Registration failed." };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed. Please check server connection.";
      return { success: false, message: errorMsg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
