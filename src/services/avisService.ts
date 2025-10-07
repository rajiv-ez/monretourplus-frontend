import api from '../api';

export const deleteAvis = async (id: number) => {
  const token = localStorage.getItem('access_token');
  const res = await api.delete(`/api/avis/${id}/`, { 
    headers: { Authorization: `Bearer ${token}` }, 
  });
  return res.data;
};

export const envoyerAvis = async (avis: any, p0: { headers: { 'Content-Type': string; }; }) => {
  const res = await api.post('/api/avis/', avis);
  return res.data;
};

export const getAvis = async () => {
  const response = await api.get(`/api/avis/list/`);
  return response.data;
}
