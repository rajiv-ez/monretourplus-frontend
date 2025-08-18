import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:8000/api',
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setAuthToken = (token: any) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
