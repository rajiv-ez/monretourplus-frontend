import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Feedback } from '../../types';
import Button from '../common/Button';
import TextArea from '../common/TextArea';
import { Send, X, Flag, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import toast from 'react-hot-toast';

interface FeedbackDetailsProps {
  feedback: Feedback;
  onClose: () => void;
  onUpdate: (feedback: Feedback) => void;
}

const FeedbackDetails: React.FC<FeedbackDetailsProps> = ({
  feedback,
  onClose,
  onUpdate
}) => {
  const [adminResponse, setAdminResponse] = useState((feedback as any).adminResponse || '');
  const [isReported, setIsReported] = useState((feedback as any).isReported || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRatingIcon = (rating: number) => {
    if (rating >= 4) return <ThumbsUp className="h-6 w-6 text-green-500" />;
    if (rating <= 2) return <ThumbsDown className="h-6 w-6 text-red-500" />;
    return <Meh className="h-6 w-6 text-yellow-500" />;
  };

  const handleSubmitResponse = () => {
    if (!adminResponse.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const updated = { ...feedback, adminResponse, lastUpdated: new Date().toISOString() };
      onUpdate(updated);
      setIsSubmitting(false);
      toast.success('Réponse enregistrée avec succès');
    }, 500);
  };

  const handleReport = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const updated = { ...feedback, isReported: true, lastUpdated: new Date().toISOString() };
      onUpdate(updated);
      setIsReported(true);
      setIsSubmitting(false);
      toast.success("Avis signalé avec succès");
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {getRatingIcon(feedback.note)}
                <span className="ml-2 text-2xl font-bold">{feedback.note}/5</span>
              </div>
              {isReported && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Signalé
                </span>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informations client</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                  <dd className="text-sm text-gray-900">{feedback.nom_structure}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="text-sm text-gray-900">{feedback.prenom} {feedback.nom}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{feedback.email}</dd>
                </div>
                {feedback.booking_number && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">N° BL/Booking</dt>
                    <dd className="text-sm text-gray-900">{feedback.booking_number}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Détails de l'avis</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Service concerné</dt>
                  <dd className="text-sm text-gray-900">{feedback.service_concerne_detail?.nom || 'Non précisé'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="text-sm text-gray-900">{format(new Date(feedback.date_submitted), 'dd MMMM yyyy', { locale: fr })}</dd>
                </div>
              </dl>
            </div>
          </div>

          {feedback.commentaire && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Commentaire</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{feedback.commentaire}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Réponse administrative</h3>
            <TextArea
              id="adminResponse"
              name="adminResponse"
              label="Votre réponse"
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Répondez à cet avis..."
              rows={4}
            />

            <div className="mt-4 flex justify-between">
              <Button
                variant="primary"
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !adminResponse.trim()}
                icon={<Send className="h-5 w-5" />}
              >
                Publier la réponse
              </Button>

              {!isReported && (
                <Button
                  variant="danger"
                  onClick={handleReport}
                  disabled={isSubmitting}
                  icon={<Flag className="h-5 w-5" />}
                >
                  Signaler l'avis
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetails;
