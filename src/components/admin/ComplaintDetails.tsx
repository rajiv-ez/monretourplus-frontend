import React, { useState } from 'react';
import { formatDate } from '../../utils/helpers';
import { Complaint } from '../../types';
import Button from '../common/Button';
import TextArea from '../common/TextArea';
import { Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onClose: () => void;
  onUpdate: (complaint: Complaint) => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  complaint,
  onClose,
  onUpdate
}) => {
  const [internalNote, setInternalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = () => {
    if (!internalNote.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedComplaint: Complaint = {
        ...complaint,
        internalNotes: [...(complaint.internalNotes || []), internalNote],
        lastUpdated: new Date().toISOString()
      };
      
      onUpdate(updatedComplaint);
      setInternalNote('');
      setIsSubmitting(false);
      toast.success('Note interne ajoutée avec succès');
    }, 500);
  };

  const handleUpdateStatus = (newStatus: 'pending' | 'inProgress' | 'resolved') => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedComplaint: Complaint = {
        ...complaint,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        ...(newStatus === 'resolved' ? { resolvedAt: new Date().toISOString() } : {})
      };
      
      onUpdate(updatedComplaint);
      setIsSubmitting(false);
      toast.success(`Statut mis à jour: ${newStatus}`);
      
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{complaint.subject}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informations client</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                  <dd className="text-sm text-gray-900">{complaint.companyName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="text-sm text-gray-900">{complaint.fullName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{complaint.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                  <dd className="text-sm text-gray-900">{complaint.phone}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Détails de la réclamation</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Catégorie</dt>
                  <dd className="text-sm text-gray-900">{complaint.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Département</dt>
                  <dd className="text-sm text-gray-900">{complaint.department}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                  <dd className="text-sm text-gray-900">{formatDate(complaint.createdAt)}</dd>
                </div>
                {complaint.resolvedAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date de résolution</dt>
                    <dd className="text-sm text-gray-900">{formatDate(complaint.resolvedAt)}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Notes internes</h3>
            <div className="space-y-4 mb-4">
              {complaint.internalNotes?.map((note, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">{note}</p>
                </div>
              ))}
            </div>
            
            <TextArea
              id="internalNote"
              name="internalNote"
              label="Ajouter une note"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Saisissez une note interne..."
              rows={3}
            />
            
            <div className="mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddNote}
                disabled={isSubmitting || !internalNote.trim()}
                icon={<Send className="h-4 w-4" />}
              >
                Ajouter la note
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Mettre à jour le statut</h3>
            <div className="flex space-x-4">
              {complaint.status !== 'pending' && (
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus('pending')}
                  disabled={isSubmitting}
                >
                  Marquer en attente
                </Button>
              )}
              
              {complaint.status !== 'inProgress' && (
                <Button
                  variant="outline"
                  onClick={() => handleUpdateStatus('inProgress')}
                  disabled={isSubmitting}
                >
                  Marquer en cours
                </Button>
              )}
              
              {complaint.status !== 'resolved' && (
                <Button
                  variant="success"
                  onClick={() => handleUpdateStatus('resolved')}
                  disabled={isSubmitting}
                >
                  Marquer comme résolu
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;