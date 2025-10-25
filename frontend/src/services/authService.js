// src/services/authService.js
import api from "./api";

// ---------------- Register User ----------------
export const register = async (payload) => {
  const response = await api.post("/Auth/register", payload);
  return response.data;
};

// ---------------- Login User ----------------
export const login = async (payload) => {
  const response = await api.post("/Auth/login", payload);

  const { token, user } = response.data;

  if (!token) {
    throw new Error("No token returned from login API");
  }

  localStorage.setItem("token", token);
  return { token, user };
};

// ---------------- Get Profile (optional) ----------------
export const getProfile = async () => {
  const response = await api.get("/Auth/profile");
  return response.data;
};

// ---------------- Logout User ----------------
export const logout = () => {
  localStorage.removeItem("token");
};
