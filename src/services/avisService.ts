import api from '../api';

export const envoyerAvis = async (avis: any, p0: { headers: { 'Content-Type': string; }; }) => {
  const res = await api.post('/avis/', avis);
  return res.data;
};

export const getAvis = async () => {
  const response = await api.get(`/avis/list/`);
  return response.data;
}
