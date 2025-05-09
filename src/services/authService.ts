// src/services/authService.js
import api, { setAuthToken } from '../api';

export const login = async (credentials: any) => {
  const res = await api.post('/token/', credentials);
  setAuthToken(res.data.access);  
  localStorage.setItem('token', res.data.access);
  return res.data;
};
