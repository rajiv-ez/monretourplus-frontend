// src/services/reclamationService.js
import api from '../api';
import axios from 'axios';


export const envoyerReclamation = async (reclamation: any) => {
  const res = await api.post('/reclamation/', reclamation);
  return res.data;
};


export const getReclamations = async () => {
  const response = await axios.get(`/reclamations/list/`, );
  return response.data;
};