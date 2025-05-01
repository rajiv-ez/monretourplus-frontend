import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Lock, User, Phone, Mail, Building, AlertCircle, LucideIcon } from 'lucide-react';
import api from '../../services/api';
import { toast, Toaster } from 'react-hot-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom_structure: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    user: {
      username: '',
      email: '',
      password: '',
    },
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('user.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        user: { ...prev.user, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/api/clients/', form);
      toast.success("Inscription réussie, vous pouvez vous connecter !");
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: { label: string; name: string; icon: LucideIcon }[] = [
    { label: 'Nom de l’entreprise', name: 'nom_structure', icon: Building },
    { label: 'Nom', name: 'nom', icon: User },
    { label: 'Prénom', name: 'prenom', icon: User },
    { label: 'Téléphone', name: 'telephone', icon: Phone },
    { label: 'Adresse e-mail du client', name: 'email', icon: Mail },
    { label: "Nom d'utilisateur", name: 'user.username', icon: User },
    { label: 'Email de connexion', name: 'user.email', icon: Mail },
    { label: 'Mot de passe', name: 'user.password', icon: Lock },
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 bg-gray-50">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full space-y-8 bg-white p-8 rounded-xl shadow-md"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <img src="/logo.png" alt="Logo" className="h-20 w-20 rounded-full object-cover" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Inscription Client</h2>
          <p className="mt-2 text-sm text-gray-600">Créez votre compte pour accéder aux services personnalisés</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="flex-shrink-0 mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {fields.map(({ label, name, icon: Icon }) => {
            const isUserField = typeof name === 'string' && name.startsWith('user.');
            const value = isUserField
              ? form.user[name.split('.')[1] as keyof typeof form.user]
              : form[name as keyof typeof form] as string;

            return (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="text-gray-400" size={20} />
                  </div>
                  <input
                    name={name}
                    type={name.includes('password') ? 'password' : 'text'}
                    value={value}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-msc-blue focus:border-msc-blue transition-all"
                    placeholder=""
                  />
                </div>
              </div>
            );
          })}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-msc-blue transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" size={20} />
                  S'inscrire
                </>
              )}
            </button>
          </div>

          <div className="mt-10 my-auto text-center font-bold">
            <Link to="/login">ou Connectez-vous</Link>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default Register;
