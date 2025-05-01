export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  return phoneRegex.test(phone);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};



export const complaintCategoryOptions = [
  { value: 'booking', label: 'Booking' },
  { value: 'information-system', label: 'Système d\'Information' },
  { value: 'missions', label: 'Missions' },
  { value: 'payment', label: 'Paiement' },
  { value: 'billing', label: 'Facturation' },
  { value: 'rates', label: 'Taux' },
  { value: 'customer-service', label: 'Service Client' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'other', label: 'Autre' }
];

export const exportToCSV = (data: any[], filename: string): void => {
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(',')
    )
  ];
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};