import React, { useState, useEffect } from 'react';
import { User, Trash, Key } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import toast from 'react-hot-toast';
import api from '../../../services/api';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    is_superuser: false
  });
  const [showForm, setShowForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState<{ userId: number; password: string } | null>(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await api.get('/accounts/api/users/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/accounts/api/register/', newUser);
      toast.success("Utilisateur créé");
      setNewUser({ username: '', email: '', password: '', is_superuser: false });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      const token = localStorage.getItem('access_token');
      await api.delete(`/accounts/api/users/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Utilisateur supprimé");
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleChangePassword = async () => {
    if (!changingPassword) return;
    try {
      const token = localStorage.getItem('access_token');
      await api.post(`/accounts/api/change-password/${changingPassword.userId}/`, {
        new_password: changingPassword.password
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Mot de passe mis à jour");
      setChangingPassword(null);
    } catch (err) {
      toast.error("Erreur lors du changement de mot de passe");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Gestion des utilisateurs admin</h2>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          icon={<User className="h-5 w-5" />}
        >
          Ajouter
        </Button>
      </div>

      {showForm && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="username"
              name="username"
              label="Nom d'utilisateur"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <Input
              id="password"
              name="password"
              label="Mot de passe"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <div className="flex items-center space-x-2">
              <input
                id="is_superuser"
                type="checkbox"
                checked={newUser.is_superuser}
                onChange={(e) => setNewUser({ ...newUser, is_superuser: e.target.checked })}
              />
              <label htmlFor="is_superuser" className="text-sm text-gray-700">Admin ?</label>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            <Button variant="primary" onClick={handleCreate}>Créer</Button>
          </div>
        </Card>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${user.is_superuser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                    {user.is_superuser ? 'Admin' : 'Utilisateur'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChangingPassword({ userId: user.id, password: '' })}
                    icon={<Key className="h-4 w-4" />}
                  >
                    MDP
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    icon={<Trash className="h-4 w-4" />}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {changingPassword && (
        <Card className='bg-gray-100/20'>
          <h3 className="text-lg font-medium mb-2">Changer mot de passe</h3>
          <Input
            id="new-password"
            name="new-password"
            label="Nouveau mot de passe"
            type="password"
            value={changingPassword.password}
            onChange={(e) => setChangingPassword({ ...changingPassword, password: e.target.value })}
            required
          />
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setChangingPassword(null)}>Annuler</Button>
            <Button variant="primary" onClick={handleChangePassword}>Valider</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
