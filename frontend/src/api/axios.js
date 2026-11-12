import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://priceradar-backend-unh9.onrender.com/api",
  withCredentials: true,
});

// Attach Authorization header from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
