// VERSION ADAPTÉE : Garde le formulaire d'origine, avec API de ton backend (Django/DRF)
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
  nom_structure?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  service_concerne?: string;
  note?: string;
  commentaire?: string;
}

const FeedbackForm: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom_structure: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    service_concerne: '',
    note: 0,
    commentaire: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    api.get('/api/services/').then(res => {
      setServices(res.data.results);
      setLoading(false);
    });



    // Préremplissage depuis localStorage
    const prefilled = {
      nom_structure: localStorage.getItem("client_nom_structure") || '',
      nom: localStorage.getItem("client_nom") || '',
      prenom: localStorage.getItem("client_prenom") || '',
      email: localStorage.getItem("client_email") || '',
      telephone: localStorage.getItem("client_telephone") || '',
    };

    setFormData(prev => ({ ...prev, ...prefilled }));
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nom_structure.trim()) newErrors.nom_structure = 'Le nom de l’entreprise est requis';
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) newErrors.email = 'L’email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email invalide';
    if (!formData.service_concerne) newErrors.service_concerne = 'Veuillez sélectionner un service';
    if (formData.note === 0) newErrors.note = 'Veuillez sélectionner une note';
    if (formData.note <= 3 && !formData.commentaire.trim()) newErrors.commentaire = 'Commentaire requis pour note ≤ 3';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const client_id = localStorage.getItem("client_id");
      const payload = { ...formData, client: client_id };
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };
      // Envoi de l'avis
      await api.post('/api/avis/', payload, { headers });
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






          <Input
            id="nom_structure"
            name="nom_structure"
            label="Nom de l'entreprise"
            value={formData.nom_structure}
            onChange={handleChange}
            placeholder="Entrez le nom de votre entreprise"
            required
            error={errors.nom_structure}
            readOnly={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="nom"
              name="nom"
              label="Nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Entrez votre nom"
              required
              error={errors.nom}
              readOnly={true}
            />
            <Input
              id="prenom"
              name="prenom"
              label="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Entrez votre prénom"
              required
              error={errors.prenom}
              readOnly={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              readOnly={true}
            />
            <Input
              id="telephone"
              name="telephone"
              label="Téléphone (facultatif)"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="06XXXXXXXX"
              error={errors.telephone}
              readOnly={true}
            />
          </div>

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
