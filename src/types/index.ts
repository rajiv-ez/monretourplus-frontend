// types.ts — adapté au backend DRF (full object pour service/catégorie)

export interface Feedback {
  id: number;
  client: number;
  note: number;
  commentaire?: string;
  service_concerne_detail: {
    id: number;
    nom: string;
    description: string;
  };
  nom_structure: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  booking_number: string;
  date_submitted: string;
}

export interface Complaint {
  id: number;
  client: number;
  sujet: string;
  description: string;
  categorie_detail: {
    id: number;
    nom: string;
    description: string;
  };
  nom_structure: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  booking_number: string;
  numero_suivi: string;
  statut: 'pending' | 'inProgress' | 'resolved';
  date_submitted: string;
  date_resolue?: string;
}

export interface ComplaintStats {
  totalPending: number;
  totalInProgress: number;
  totalResolved: number;
  averageResolutionTime: number;
  resolutionsByCategory: {
    category: string;
    count: number;
  }[];
}

export interface FeedbackStats {
  totalPositive: number;
  totalNegative: number;
  totalNeutral: number;
  averageRating: number;
  ratingsByDepartment: {
    department: string;
    averageRating: number;
    count: number;
  }[];
}

export interface MonthlyStats {
  month: string;
  positiveCount: number;
  negativeCount: number;
  averageRating: number;
  complaintCount: number;
  resolutionTime: number;
}
