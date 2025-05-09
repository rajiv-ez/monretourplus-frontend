import React, { useEffect, useState } from 'react';
import { User, Building2, Phone, Mail, Clock, AlertTriangle, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import api from '../api';


const token = localStorage.getItem('access_token');
export const getFullClientProfile = async () => {
    try {
        const response = await api.get('client/full-profile/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.error(error);
        throw error;
    }

};

type Feedback = {
    id: number;
    nom_structure?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    service_concerne_detail?: { nom: string };
    note?: string;
    commentaire?: string;
    date_submitted?: string;
};

const UserProfilePage: React.FC = () => {
    const [client, setClient] = useState({
        nom: '',
        prenom: '',
        email: '',
        nom_structure: '',
        telephone: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(client);
    const [loading, setLoading] = useState(true);

    function getClientMe() {
        throw new Error('Function not implemented.');
    }
    const [userComplaints, setUserComplaints] = useState<any[]>([]);

    const [userFeedback, setUserFeedback] = useState<any[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getFullClientProfile();
                if (!data) {
                    toast.error('Aucun utilisateur trouvé');
                    return;
                }


                setClient(data.client);
                setFormData(data.client);
                setUserComplaints(data.reclamations);
                setUserFeedback(data.avis);
            } catch (error) {
                toast.error('Erreur lors du chargement du profil');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (!token) {
                toast.error("Utilisateur non authentifié.");
                return;
            }

            const updatedData = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                nom_structure: formData.nom_structure,
                telephone: formData.telephone
            };

            const response = await api.put('/client/update-profile/', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const res = response.data;
            if (res.status !== 'success') {
                toast.error('Échec de la mise à jour');
                return;
            }

            const updatedUser = {
                nom: res.nom,
                prenom: res.prenom,
                email: res.email,
                nom_structure: res.nom_structure,
                telephone: res.telephone
            };

            setClient(updatedUser);
            setFormData(updatedUser);
            toast.success('Profil mis à jour avec succès');
        } catch (error) {
            toast.error("Échec de la mise à jour");
        } finally {
            setIsEditing(false);
        }
    };


    if (loading) {
        return <div className="text-center py-12 text-gray-500">Chargement du profil...</div>;
    }



    const getStatusBadge = (statut: string) => {
        if (statut === 'pending') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <AlertCircle className="h-3 w-3 mr-1" /> En attente
            </span>;
        } else if (statut === 'inProgress') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Clock className="h-3 w-3 mr-1" /> En cours
            </span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" /> Résolu
            </span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

                    <div className="space-y-6">
                        {/* Profile Information */}
                        <Card>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Informations personnelles
                                </h2>
                                {!isEditing && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                        icon={<User className="h-5 w-5" />}
                                    >
                                        Modifier
                                    </Button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        id="nom"
                                        name="nom"
                                        label="Nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        icon={<User className="h-5 w-5 text-gray-400" />}
                                    />

                                    <Input
                                        id="prenom"
                                        name="prenom"
                                        label="Prénom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        icon={<User className="h-5 w-5 text-gray-400" />}
                                    />


                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        icon={<Mail className="h-5 w-5 text-gray-400" />}
                                    />

                                    <Input
                                        id="nom_structure"
                                        name="nom_structure"
                                        label="Entreprise"
                                        value={formData.nom_structure}
                                        onChange={handleChange}
                                        icon={<Building2 className="h-5 w-5 text-gray-400" />}
                                    />

                                    <Input
                                        id="telephone"
                                        name="telephone"
                                        label="Téléphone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        icon={<Phone className="h-5 w-5 text-gray-400" />}
                                    />

                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setFormData(client);
                                                setIsEditing(false);
                                            }}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                        >
                                            Enregistrer
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                                        <dd className="mt-1 flex items-center text-gray-900">
                                            <User className="h-5 w-5 text-gray-400 mr-2" />
                                            {client.nom} {client.prenom}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 flex items-center text-gray-900">
                                            <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                            {client.email}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                                        <dd className="mt-1 flex items-center text-gray-900">
                                            <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                                            {client.nom_structure}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                                        <dd className="mt-1 flex items-center text-gray-900">
                                            <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                            {client.telephone}
                                        </dd>
                                    </div>
                                </dl>
                            )}
                        </Card>

                        {/* Recent Complaints */}
                        <Card>
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Mes réclamations récentes
                            </h2>

                            <div className="space-y-6">
                                {setUserComplaints.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        Aucune réclamation pour le moment
                                    </p>
                                ) : (
                                    userComplaints.map(complaint => (
                                        <div
                                            key={complaint.id}
                                            className="border-b border-gray-200 last:border-0 pb-6 last:pb-0 relative"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {complaint.sujet}
                                                    </h3>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(complaint.date_submitted)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">{complaint.description}</p>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-gray-500">
                                                    Service: {complaint.service_concerne_detail.nom}
                                                </span>
                                            </div>
                                            <span className="text-gray-500">
                                                Numéro de Suivi: {complaint.numero_suivi}
                                            </span>

                                            {/* Badge positionné en bas à droite */}
                                            <div className="absolute bottom-2 right-2">
                                                {getStatusBadge(complaint.statut)}
                                            </div>
                                        </div>

                                    ))
                                )}
                            </div>
                        </Card>

                        {/* Recent Feedback */}
                        <Card>
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Mes avis récents
                            </h2>

                            <div className="space-y-6">
                                {userFeedback.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        Aucun avis pour le moment
                                    </p>
                                ) : (
                                    userFeedback.map((feedback: Feedback) => (
                                        <div
                                            key={feedback.id}
                                            className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                    <span className="text-lg font-medium text-gray-900">
                                                        Avis sur {feedback.service_concerne_detail?.nom || 'Service inconnu'}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(feedback.date_submitted || '')}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-yellow-500">
                                                    {'★'.repeat(Number(feedback.note) || 0)}
                                                    {'☆'.repeat(5 - (Number(feedback.note) || 0))}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    ({feedback.note}/5)
                                                </span>
                                            </div>
                                            {feedback.commentaire && (
                                                <p className="text-gray-600">{feedback.commentaire}</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;



