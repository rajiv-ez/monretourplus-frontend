import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import EmojiRating from '../common/EmojiRating';
import Card from '../common/Card';
import toast from 'react-hot-toast';
import api from '../../../services/api';

interface FormErrors {
  service_concerne?: string;
  note?: string;
  commentaire?: string;
  email?: string;
}

const FeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wantsReply, setWantsReply] = useState(false);

  const [formData, setFormData] = useState({
    service_concerne: '',
    note: 0,
    commentaire: '',
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    api.get('/api/services/').then(res => {
      setServices(res.data.results);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRatingChange = (note: number) => {
    setFormData(prev => ({ ...prev, note }));
    if (errors.note) {
      setErrors(prev => ({ ...prev, note: undefined }));
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setWantsReply(checked);
    if (!checked) {
      setFormData(prev => ({ ...prev, email: '' }));
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.service_concerne) newErrors.service_concerne = 'Veuillez sélectionner un service';
    if (formData.note === 0) newErrors.note = 'Veuillez sélectionner une note';
    if (formData.note <= 3 && !formData.commentaire.trim()) newErrors.commentaire = 'Commentaire requis pour note ≤ 3';
    if (wantsReply) {
      if (!formData.email.trim()) newErrors.email = 'L’email est requis';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = { ...formData };
      await api.post('/api/avis/', payload);
      toast.success('Votre avis a été enregistré avec succès !');
      navigate('/', { state: { fromFeedback: true } });
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l’envoi de l’avis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Donner votre avis</h1>
      <p className="text-gray-600 mb-8 text-center">
        Votre opinion est importante pour nous aider à améliorer nos services.
      </p>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Service concerné</label>
            <select
              name="service_concerne"
              value={formData.service_concerne}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="">Sélectionner un service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.nom}</option>
              ))}
            </select>
            {errors.service_concerne && (
              <p className="mt-1 text-sm text-red-600">{errors.service_concerne}</p>
            )}
          </div>

          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Comment évaluez-vous notre service ?<span className="text-red-500 ml-1">*</span>
            </label>
            <EmojiRating
              value={formData.note}
              onChange={handleRatingChange}
              disabled={isSubmitting}
            />
            {errors.note && (
              <p className="mt-2 text-sm text-red-600 text-center">{errors.note}</p>
            )}
          </div>

          <TextArea
            id="commentaire"
            name="commentaire"
            label="Commentaire "
            value={formData.commentaire}
            onChange={handleChange}
            placeholder="Partagez votre expérience..."
            error={errors.commentaire}
            rows={5}
          />

          <div className="flex items-center space-x-2">
            <input
              id="wantsReply"
              type="checkbox"
              checked={wantsReply}
              onChange={handleCheckbox}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label htmlFor="wantsReply" className="text-sm text-gray-700">Recevoir une réponse à mon avis</label>
          </div>

          {wantsReply && (
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
              error={errors.email}
            />
          )}

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              icon={<Send className="h-5 w-5" />}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FeedbackForm;
