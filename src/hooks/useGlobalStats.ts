import { useEffect, useState } from 'react';
import api from '../../services/api';

export interface FeedbackStats {
  totalPositive: number;
  totalNegative: number;
  totalNeutral: number;
  averageRating: number;
  ratingsByDepartment: Array<{ department: string; averageRating: number; count: number }>;
}

export interface ComplaintStats {
  totalPending: number;
  totalInProgress: number;
  totalResolved: number;
  averageResolutionTime: number;
  resolutionsByCategory: Array<{ category: string; count: number }>;
}

export interface MonthlyStats {
  month: string;
  positiveCount: number;
  negativeCount: number;
  averageRating: number;
  complaintCount: number;
  resolutionTime: number;
}

export function useGlobalStats() {
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [complaintStats, setComplaintStats] = useState<ComplaintStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/stats/');
        setFeedbackStats(res.data.feedbackStats);
        setComplaintStats(res.data.complaintStats);
        setMonthlyStats(res.data.monthlyStats);
      } catch (err: any) {
        setError('Erreur lors de la récupération des statistiques');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { feedbackStats, complaintStats, monthlyStats, loading, error };
}
