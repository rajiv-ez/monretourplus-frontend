// stats.ts — adapté à ton backend (DRF) avec champ date_submitted et statut + détail service/catégorie
import { Complaint, Feedback, ComplaintStats, FeedbackStats, MonthlyStats } from '../types';
import { differenceInDays, parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const calculateComplaintStats = (complaints: Complaint[]): ComplaintStats => {
  const totalPending = complaints.filter(c => c.statut === 'pending').length;
  const totalInProgress = complaints.filter(c => c.statut === 'inProgress').length;
  const totalResolved = complaints.filter(c => c.statut === 'resolved').length;

  const resolvedComplaints = complaints.filter(c => c.statut === 'resolved' && c.date_resolue);

  const totalResolutionTime = resolvedComplaints.reduce((acc, complaint) => {
    const createdDate = parseISO(complaint.date_submitted);
    const resolvedDate = parseISO(complaint.date_resolue!);
    return acc + differenceInDays(resolvedDate, createdDate);
  }, 0);

  const averageResolutionTime = resolvedComplaints.length > 0 
    ? totalResolutionTime / resolvedComplaints.length 
    : 0;

  const resolutionsByCategory = Object.entries(
    complaints.reduce((acc, c) => {
      const key = c.categorie_detail?.nom || 'Inconnu';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({ category, count }));

  return {
    totalPending,
    totalInProgress,
    totalResolved,
    averageResolutionTime,
    resolutionsByCategory,
  };
};

export const calculateFeedbackStats = (feedback: Feedback[]): FeedbackStats => {
  const totalPositive = feedback.filter(f => f.note >= 4).length;
  const totalNegative = feedback.filter(f => f.note <= 2).length;
  const totalNeutral = feedback.filter(f => f.note === 3).length;

  const averageRating = feedback.length
    ? feedback.reduce((acc, f) => acc + f.note, 0) / feedback.length
    : 0;

  const departmentRatings = feedback.reduce((acc, f) => {
    const dept = f.service_concerne_detail?.nom || 'Inconnu';
    if (!acc[dept]) acc[dept] = { total: 0, count: 0 };
    acc[dept].total += f.note;
    acc[dept].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const ratingsByDepartment = Object.entries(departmentRatings).map(([department, stats]) => ({
    department,
    averageRating: stats.total / stats.count,
    count: stats.count,
  }));

  return {
    totalPositive,
    totalNegative,
    totalNeutral,
    averageRating,
    ratingsByDepartment,
  };
};

export const calculateMonthlyStats = (
  feedback: Feedback[],
  complaints: Complaint[]
): MonthlyStats[] => {
  const monthlyData: Record<string, MonthlyStats> = {};

  feedback.forEach(f => {
    if (!f.date_submitted) return;
    const createdDate = parseISO(f.date_submitted);
    const monthKey = format(createdDate, 'yyyy-MM');

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: format(createdDate, 'MMMM yyyy', { locale: fr }),
        positiveCount: 0,
        negativeCount: 0,
        averageRating: 0,
        complaintCount: 0,
        resolutionTime: 0
      };
    }

    const entry = monthlyData[monthKey];
    if (f.note >= 4) entry.positiveCount++;
    if (f.note <= 2) entry.negativeCount++;

    const totalFeedback = entry.positiveCount + entry.negativeCount;
    entry.averageRating =
      totalFeedback > 0
        ? (entry.averageRating * (totalFeedback - 1) + f.note) / totalFeedback
        : f.note;
  });

  complaints.forEach(c => {
    if (!c.date_submitted) return;
    const createdDate = parseISO(c.date_submitted);
    const monthKey = format(createdDate, 'yyyy-MM');

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: format(createdDate, 'MMMM yyyy', { locale: fr }),
        positiveCount: 0,
        negativeCount: 0,
        averageRating: 0,
        complaintCount: 0,
        resolutionTime: 0
      };
    }

    const entry = monthlyData[monthKey];
    entry.complaintCount++;

    if (c.statut === 'resolved' && c.date_resolue) {
      const resolutionTime = differenceInDays(parseISO(c.date_resolue), createdDate);
      const resolvedCount = (entry.resolutionTime > 0 ? 1 : 0) + 1;
      entry.resolutionTime =
        (entry.resolutionTime * (resolvedCount - 1) + resolutionTime) / resolvedCount;
    }
  });

  return Object.values(monthlyData).sort((a, b) => {
    const aKey = new Date(a.month).getTime();
    const bKey = new Date(b.month).getTime();
    return aKey - bKey;
  });
};
