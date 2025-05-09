import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { Feedback } from '../../types';

interface FeedbackTableProps {
  feedback: Feedback[];
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({ feedback }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Feedback; direction: 'ascending' | 'descending' }>({
    key: 'date_submitted',
    direction: 'descending'
  });
  
  const getnoteIcon = (note: number) => {
    if (note >= 4) {
      return <ThumbsUp className="h-5 w-5 text-green-500" />;
    } else if (note <= 2) {
      return <ThumbsDown className="h-5 w-5 text-red-500" />;
    } else {
      return <Meh className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const handleSort = (key: keyof Feedback) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const filteredFeedback = feedback.filter(item => {
    return (
      (item.nom_structure|| "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.nom|| "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.prenom|| "").toLowerCase().includes(searchTerm.toLowerCase()) ||
     ( item.email|| "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.note|| "").toString().includes(searchTerm) ||
      (item.commentaire && item.commentaire.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const sortedFeedback = [...filteredFeedback].sort((a, b) => {
    if ((a[sortConfig.key] ?? '') < (b[sortConfig.key] ?? '')) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if ((a[sortConfig.key] ?? '') > (b[sortConfig.key] ?? '')) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Rechercher par entreprise, nom, email ou commentaire..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('note')}
              >
                Note
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('nom_structure')}
              >
                Entreprise
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('nom')}
              >
                Nom et Prénom
              </th>
              
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date_submitted')}
              >
                Date
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Commentaire
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFeedback.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getnoteIcon(item.note)}
                    <span className="ml-2">{item.note}/5</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.nom_structure}</div>
                  {item.booking_number && (
                    <div className="text-xs text-gray-500">BL/Booking: {item.booking_number}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{`${item.nom ?? ''} ${item.prenom ?? ''}`}</div>
                  <div className="text-xs text-gray-500">{item.email}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.date_submitted)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-xs truncate">
                    {item.commentaire || <span className="italic text-gray-400">Pas de commentaire</span>}
                  </div>
                </td>
              </tr>
            ))}
            
            {sortedFeedback.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun avis trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackTable;