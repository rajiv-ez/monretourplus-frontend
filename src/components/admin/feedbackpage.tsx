import React, { useState, useEffect } from 'react';
import { Feedback } from '../../types';
import FeedbackTable from './FeedbackTable';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAvis = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('/api/avis/full/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des avis');
        }
        const data = await response.json();
        setFeedback(data.results);
      } catch (err) {
        console.error('Erreur de chargement des avis :', err);
      } finally {
        setLoading(false);
      }
    };

    getAvis();
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-500">Chargement des avis...</div>;

  return <FeedbackTable feedback={feedback} />;
};

export default FeedbackPage;
