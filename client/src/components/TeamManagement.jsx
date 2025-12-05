import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TeamManagement = ({ socket }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();
  const { getAuthHeaders } = useAuth();

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams');
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      showToast('Erreur lors du chargement des équipes', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();

    socket.on('teams:updated', () => {
      fetchTeams();
    });

    return () => {
      socket.off('teams:updated');
    };
  }, [socket, showToast]);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/teams/${id}`, {
        headers: getAuthHeaders()
      });
      showToast('Équipe supprimée avec succès', 'success');
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      color: formData.get('color'),
      status: formData.get('status')
    };

    try {
      if (editingTeam) {
        await axios.put(`http://localhost:5000/api/teams/${editingTeam._id}`, data, {
          headers: getAuthHeaders()
        });
        showToast('Équipe mise à jour avec succès', 'success');
      } else {
        await axios.post('http://localhost:5000/api/teams', data, {
          headers: getAuthHeaders()
        });
        showToast('Équipe créée avec succès', 'success');
      }
      setShowForm(false);
      setEditingTeam(null);
      e.target.reset();
    } catch (error) {
      showToast(error.response?.data?.error || 'Erreur lors de l\'opération', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Gestion des Équipes</h2>
        <button
          onClick={() => {
            setEditingTeam(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          aria-label="Créer une nouvelle équipe"
        >
          + Nouvelle Équipe
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6" role="dialog" aria-labelledby="form-title">
          <h3 id="form-title" className="text-xl font-bold mb-4">
            {editingTeam ? 'Modifier l\'équipe' : 'Créer une équipe'}
          </h3>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'équipe
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={editingTeam?.name || ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur
                </label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  defaultValue={editingTeam?.color || '#3B82F6'}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editingTeam?.status || 'active'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="disqualified">Disqualifié</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                {editingTeam ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTeam(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            role="article"
            aria-label={`Équipe ${team.name}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full mr-3"
                  style={{ backgroundColor: team.color }}
                  aria-hidden="true"
                ></div>
                <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Points</p>
              <p className="text-2xl font-bold text-primary-600">{team.points}</p>
            </div>
            <div className="mb-4">
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                team.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : team.status === 'inactive'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {team.status === 'active' ? 'Actif' : team.status === 'inactive' ? 'Inactif' : 'Disqualifié'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(team)}
                className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                aria-label={`Modifier ${team.name}`}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(team._id)}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                aria-label={`Supprimer ${team.name}`}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-md">
          Aucune équipe enregistrée
        </div>
      )}
    </div>
  );
};

export default TeamManagement;



