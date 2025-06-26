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
  telephone?: string;
  nom_structure?: string;
  nom?: string;
  prenom?: string;
  booking_number?: string;
}

const ComplaintForm: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    sujet: '',
    description: '',
    service_concerne: '',
    nom_structure: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    booking_number: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    api.get('/api/services/').then(res => {
      setServices(res.data.results);
      setLoading(false);
    });


    // // Préremplissage depuis localStorage
    // const prefilled = {
    //   nom_structure: localStorage.getItem("client_nom_structure") || '',
    //   nom: localStorage.getItem("client_nom") || '',
    //   prenom: localStorage.getItem("client_prenom") || '',
    //   email: localStorage.getItem("client_email") || '',
    //   telephone: localStorage.getItem("client_telephone") || '',
    // };

    // setFormData(prev => ({ ...prev, ...prefilled }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?[0-9]{6,15}$/.test(phone);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sujet.trim()) newErrors.sujet = 'Le sujet est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    else if (formData.description.length < 20) newErrors.description = 'Minimum 20 caractères requis';
    if (!formData.service_concerne) newErrors.service_concerne = 'Veuillez sélectionner un service';
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!validateEmail(formData.email)) newErrors.email = 'Format d’email invalide';
    if (!formData.telephone.trim()) newErrors.telephone = 'Téléphone requis';
    else if (!validatePhone(formData.telephone)) newErrors.telephone = 'Format de téléphone invalide';
    if (!formData.booking_number.trim()) newErrors.booking_number = 'Numéro de booking requis';
    if (!formData.nom_structure.trim()) newErrors.nom_structure = 'Nom entreprise requis';
    if (!formData.nom.trim()) newErrors.nom = 'Nom requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Prénom requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      //const token = localStorage.getItem("access_token");
      // const headers = { Authorization: `Bearer ${token}` };
      // await api.post('/api/reclamations/', payload, { headers });
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

          <Input
            id="nom_structure"
            name="nom_structure"
            label="Nom de l'entreprise"
            value={formData.nom_structure}
            onChange={handleChange}
            placeholder="Entrez le nom de votre entreprise"
            required
            error={errors.nom_structure}
            // readOnly
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
              // readOnly
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
              // readOnly
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
              // readOnly
            />
            <Input
              id="telephone"
              name="telephone"
              label="Téléphone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Ex: +24174123456"
              required
              error={errors.telephone}
              // readOnly
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
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre la réclamation'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ComplaintForm;
