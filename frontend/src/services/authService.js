// src/services/authService.js
import api from "./api";

export const register = async (payload) => {
  // payload: { name, email, password } or whatever your backend expects
  const response = await api.post("/Auth/register", payload);
  return response.data;
};

export const login = async (payload) => {
  // payload: { email, password }
  const response = await api.post("/Auth/login", payload);
  return response.data; // expect it to return { token, user } or similar
};

export const getProfile = async () => {
  const response = await api.get("/Auth/profile"); // optional if backend offers profile
  return response.data;
};
