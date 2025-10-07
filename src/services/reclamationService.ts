// src/services/reclamationService.js
import api from '../api';

export const deleteReclamation = async (id: number) => {
  const token = localStorage.getItem('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  const res = await api.delete(`/api/reclamations/${id}/`, { headers });
  return res.data;
};

export const envoyerReclamation = async (reclamation: any) => {
  const res = await api.post('/api/reclamation/', reclamation);
  return res.data;
};


export const getReclamations = async () => {
  const response = await api.get(`/reclamations/list/`, );
  return response.data;
};