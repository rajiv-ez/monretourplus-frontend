import React, { useState, useEffect } from 'react';
import { Complaint} from '../../types';
import ComplaintTable from './ComplaintTable';

const ComplaintPage = () => {
  const [complaint, setComplaint] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReclamations = async () => {
      try {
        const response = await fetch('/api/reclamation/list');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des avis');
        }
        const data = await response.json();
        setComplaint(data);
      } catch (err) {
        console.error('Erreur de chargement des avis :', err);
      } finally {
        setLoading(false);
      }
    };

    getReclamations();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <ComplaintTable complaint={complaint} />
  )
  
};

export default ComplaintPage;