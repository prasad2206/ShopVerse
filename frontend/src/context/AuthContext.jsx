// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "../services/authService";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // initial state from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  // Keep axios header in sync (redundant with interceptor but good to be explicit)
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (credentials) => {
    // credentials: { email, password }
    setLoading(true);
    try {
      const data = await loginApi(credentials);
      // Expected: data = { token: "...", user: { ... } }
      // adapt if backend returns differently
      const receivedToken = data.token ?? data;
      const receivedUser = data.user ?? data;

      // If backend returns only token string, you might need to decode user separately.
      // Here we handle commonly returned shape.
      if (!receivedToken) {
        throw new Error("No token returned from login API");
      }

      setToken(receivedToken);
      localStorage.setItem("token", receivedToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${receivedToken}`;
      try {
        const profile = await api.get("/Auth/profile");
        setUser(profile.data);
        localStorage.setItem("user", JSON.stringify(profile.data));
      } catch (profileError) {
        console.warn("Failed to fetch profile:", profileError);
      }

      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setLoading(false);
      // return error message for UI display
      const message =
        err.response?.data?.message || err.message || "Login failed";
      return { success: false, message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // optionally call backend logout endpoint if exists
  };

  const register = async (payload) => {
    // we can call /Auth/register using api directly here if desired, and ensure role is Customer
    // payload: { name, email, password, ... }
    // enforce role as Customer
    const finalPayload = { ...payload, role: "Customer" };
    const resp = await api.post("/Auth/register", finalPayload);
    return resp.data;
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
