import axios from "axios";

export const api = axios.create({
  // Asegúrate de que tu .env diga: VITE_SERVER_URL=http://localhost:5000
  baseURL: import.meta.env.VITE_SERVER_URL 
});

api.interceptors.request.use(
  async (config) => {
    // Busca el token que guardamos en el AuthContext
    const token = localStorage.getItem("token");
    if (token) {
      // ✅ IMPORTANTE: El espacio después de 'Bearer '
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);