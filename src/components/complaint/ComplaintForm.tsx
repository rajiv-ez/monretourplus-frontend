import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import Card from '../common/Card';
import toast from 'react-hot-toast';
import api from '../../../services/api';

interface FormErrors {
  sujet?: string;
  description?: string;
  service_concerne?: string;
  email?: string;
  booking_number?: string;
}

const ComplaintForm: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wantsReply, setWantsReply] = useState(false);

  const [formData, setFormData] = useState({
    sujet: '',
    description: '',
    service_concerne: '',
    booking_number: '',
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

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setWantsReply(checked);
    if (!checked) {
      setFormData(prev => ({ ...prev, email: '' }));
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sujet.trim()) newErrors.sujet = 'Le sujet est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    else if (formData.description.length < 20) newErrors.description = 'Minimum 20 caractères requis';
    if (!formData.service_concerne) newErrors.service_concerne = 'Veuillez sélectionner un service';
    if (!formData.booking_number.trim()) newErrors.booking_number = 'Numéro de booking requis';
    if (wantsReply) {
      if (!formData.email.trim()) newErrors.email = "L'email est requis";
      else if (!validateEmail(formData.email)) newErrors.email = 'Format d’email invalide';
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
      await api.post('/api/reclamations/', payload);
      toast.success('Votre réclamation a été soumise avec succès!');
      navigate('/', { state: { fromReclamation: true } });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réclamation:", error);
      toast.error('Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Soumettre une réclamation</h1>
      <p className="text-gray-600 mb-8 text-center">
        Nous traitons toutes les réclamations avec le plus grand sérieux. Veuillez fournir des informations précises pour nous permettre de résoudre votre problème efficacement.
      </p>

      <Card className="transition-all duration-300 hover:shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="sujet"
            name="sujet"
            label="Sujet de la réclamation"
            value={formData.sujet}
            onChange={handleChange}
            placeholder="Résumez brièvement votre réclamation"
            required
            error={errors.sujet}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="service_concerne"
              name="service_concerne"
              label="Service concerné"
              value={formData.service_concerne}
              onChange={handleChange}
              options={services.map(c => ({ label: c.nom, value: c.id }))}
              required
              error={errors.service_concerne}
            />

            <Input
              id="booking_number"
              name="booking_number"
              label="N° BL / Booking"
              value={formData.booking_number}
              onChange={handleChange}
              placeholder="Ex: MSC12345678"
              required
              error={errors.booking_number}
            />
          </div>

          <TextArea
            id="description"
            name="description"
            label="Description détaillée"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez votre problème en détail (date, contexte, impact...)"
            required
            error={errors.description}
            rows={6}
          />

          <div className="flex items-center space-x-2">
            <input
              id="wantsReply"
              type="checkbox"
              checked={wantsReply}
              onChange={handleCheckbox}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label htmlFor="wantsReply" className="text-sm text-gray-700">Recevoir une réponse à ma réclamation</label>
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
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre la réclamation'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ComplaintForm;
