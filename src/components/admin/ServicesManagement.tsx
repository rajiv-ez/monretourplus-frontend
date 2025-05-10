import React, { useState, useEffect } from 'react';
import { Plus, Trash, Edit } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import toast from 'react-hot-toast';
import api from '../../../services/api';

interface Service {
    id: number;
    nom: string;
    description: string;
}

const ServiceManagement: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [newService, setNewService] = useState({
        nom: '',
        description: '',
    });
    const [showForm, setShowForm] = useState(false);
    const [editService, setEditService] = useState<Service | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await api.get('/api/services/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices(Array.isArray(res.data) ? res.data : res.data.results || []);
        } catch (err) {
            toast.error("Erreur lors du chargement des services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };
            const payload = { nom: newService.nom, description: newService.description };
            await api.post('/api/services/', payload, { headers });

            toast.success("Service ajouté");
            setNewService({ nom: '', description: '' });
            setShowForm(false);
            fetchServices();
        } catch (err) {
            toast.error("Erreur lors de la création du service");
        }
    };

    const handleDelete = async () => {
        if (!serviceToDelete) return;

        try {
            const token = localStorage.getItem('access_token');
            await api.delete(`/api/services/${serviceToDelete}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Service supprimé");
            setServices(services.filter(s => s.id !== serviceToDelete));
            setIsModalOpen(false);
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleEdit = (service: Service) => {
        setEditService(service);
        setShowForm(true);
    };

    const handleUpdate = async () => {
        if (!editService) return;

        try {
            const token = localStorage.getItem('access_token');
            const headers = { Authorization: `Bearer ${token}` };
            await api.put(`/api/services/${editService.id}/`, editService, { headers });

            toast.success("Service mis à jour");
            setEditService(null);
            setShowForm(false);
            fetchServices();
        } catch (err) {
            toast.error("Erreur lors de la mise à jour du service");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Gestion des services</h2>
                <Button
                    variant="primary"
                    onClick={() => setShowForm(true)}
                    icon={<Plus className="h-5 w-5" />}
                    className="hover:bg-blue-700 transition duration-300"
                >
                    Ajouter
                </Button>
            </div>

            {showForm && (
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            id="nom"
                            name="nom"
                            label="Nom du service"
                            value={editService?.nom || newService.nom}
                            onChange={(e) => {
                                if (editService) {
                                    setEditService({ ...editService, nom: e.target.value });
                                } else {
                                    setNewService({ ...newService, nom: e.target.value });
                                }
                            }}
                            required
                        />
                        <Input
                            id="description"
                            name="description"
                            label="Description"
                            value={editService?.description || newService.description}
                            onChange={(e) => {
                                if (editService) {
                                    setEditService({ ...editService, description: e.target.value });
                                } else {
                                    setNewService({ ...newService, description: e.target.value });
                                }
                            }}
                        />
                    </div>
                    <div className="mt-4 flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => setShowForm(false)} className="hover:bg-gray-200 transition duration-300">Annuler</Button>
                        <Button
                            variant="primary"
                            onClick={editService ? handleUpdate : handleCreate}
                            className="hover:bg-blue-700 transition duration-300"
                        >
                            {editService ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </div>
                </Card>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {services.length === 0 ? (
                    <div className="px-6 py-4 text-center text-gray-500">Aucun service disponible pour l'instant</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 table-auto">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {services.map(service => (
                                    <tr key={service.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.nom}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleEdit(service)}
                                                icon={<Edit className="h-4 w-4" />}
                                                className="hover:bg-yellow-300 transition duration-300"
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => {
                                                    setServiceToDelete(service.id);
                                                    setIsModalOpen(true);
                                                }}
                                                icon={<Trash className="h-4 w-4" />}
                                                className="hover:bg-red-600 transition duration-300"
                                            >
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for deletion confirmation */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 animate__animated animate__fadeIn">
                        <h3 className="text-lg font-semibold">Confirmation de suppression</h3>
                        <p>Êtes-vous sûr de vouloir supprimer ce service ?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                className="hover:bg-gray-200 transition duration-300"
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                className="hover:bg-red-700 transition duration-300"
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ServiceManagement;
