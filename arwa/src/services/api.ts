import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If the caller asked to skip redirect (public endpoint), don't force navigation
      const cfg = error.config as Record<string, unknown> | undefined;
      const skip = Boolean(
        cfg && (cfg as { skipAuthRedirect?: boolean }).skipAuthRedirect
      );
      if (skip) {
        return Promise.reject(error);
      }

      // Handle unauthorized for protected endpoints
      localStorage.removeItem("token");
      // Respect Vite base path (e.g., /arwa/)
      const base = (import.meta.env.BASE_URL || "/").replace(/\/*$/, "/");
      const target = `${base}login`;
      if (window.location.pathname !== target) {
        window.location.href = target;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
