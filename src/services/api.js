import axios from "axios";

// Single axios instance the whole app shares.
// Point VITE_API_URL at your real backend in .env — nothing else needs to change.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("studio_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("studio_admin_token");
    }
    return Promise.reject(err);
  }
);

export default api;
