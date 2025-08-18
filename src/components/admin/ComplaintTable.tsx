import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Complaint } from '../../types';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import api from '../../../services/api';


interface ComplaintTableProps {
  initialComplaints: Complaint[];
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({ initialComplaints }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'inProgress' | 'resolved'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Complaint; direction: 'ascending' | 'descending' }>(
    { key: 'date_submitted', direction: 'descending' }
  );


  const getStatusBadge = (statut: string) => {
    if (statut === 'pending') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="h-3 w-3 mr-1" /> En attente
      </span>;
    } else if (statut === 'inProgress') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Clock className="h-3 w-3 mr-1" /> En cours
      </span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" /> Résolu
      </span>;
    }
  };

  const handleSort = (key: keyof Complaint) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleUpdateStatus = async (id: number, statut: 'pending' | 'inProgress' | 'resolved') => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("Token non trouvé");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      await api.patch(`/api/reclamations/${id}/statut/`, { statut }, { headers });
      toast.success("Statut mis à jour !");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Erreur lors de la mise à jour");
    }
  };




  const filteredComplaints = (complaints || []).filter(item => {
    const matchesSearch = (
      item.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nom_structure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${item.prenom} ${item.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || item.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    const aVal = a[sortConfig.key] ?? '';
    const bVal = b[sortConfig.key] ?? '';
    return sortConfig.direction === 'ascending'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
        <input
          type="text"
          placeholder="Rechercher par sujet, description, entreprise, nom..."
          className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="inProgress">En cours</option>
          <option value="resolved">Résolu</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th onClick={() => handleSort('statut')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Statut</th>
              <th onClick={() => handleSort('sujet')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Sujet</th>
              <th onClick={() => handleSort('categorie_detail')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Catégorie</th>
              <th onClick={() => handleSort('nom_structure')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Entreprise</th>
              <th onClick={() => handleSort('date_submitted')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedComplaints.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.statut)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.sujet}</div>
                  <div className="text-xs text-gray-500 max-w-xs truncate">{item.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.categorie_detail?.nom || 'Inconnue'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.nom_structure}</div>
                  <div className="text-xs text-gray-500">{item.prenom} {item.nom}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(item.date_submitted), 'dd MMM yyyy', { locale: fr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    {item.statut !== 'pending' && (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(item.id, 'pending')}>
                        En attente
                      </Button>
                    )}
                    {item.statut !== 'inProgress' && (
                      <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(item.id, 'inProgress')}>
                        En cours
                      </Button>
                    )}
                    {item.statut !== 'resolved' && (
                      <Button size="sm" variant="success" onClick={() => handleUpdateStatus(item.id, 'resolved')}>
                        Résolu
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {sortedComplaints.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucune réclamation trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;
