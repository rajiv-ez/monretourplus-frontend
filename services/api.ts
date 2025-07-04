import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Refresh token automatiquement si 401
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry && localStorage.getItem('is_admin') === 'true') {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh_token");
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/accounts/api/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;
        localStorage.setItem("access_token", newAccess);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

        return api(originalRequest); // Réessaie avec le nouveau token
      } catch (e) {
        localStorage.clear(); // Logout si refresh aussi invalide
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;
