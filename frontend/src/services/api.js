// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5133/api",
  withCredentials: false,
}); // backend base (HTTP)

// Helper to get raw token (no Bearer)
export const getStoredToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  // If token was stored as 'Bearer xyz' accidentally, strip it
  return raw.startsWith("Bearer ") ? raw.replace(/^Bearer\s+/i, "") : raw;
};

// Attach token if present in localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = getStoredToken();
      if (token) {
        config.headers = config.headers || {};
        // Ensure we don't double-prefix "Bearer"
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // don't block request for localStorage read issues
      console.warn("api interceptor token read failed", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to surface 401 details during development
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("API 401 Unauthorized:", {
        url: error.config?.url,
        method: error.config?.method,
        requestHeaders: error.config?.headers,
        responseData: error.response?.data,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
