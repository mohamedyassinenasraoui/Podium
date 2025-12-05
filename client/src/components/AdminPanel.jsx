import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminPanel = ({ socket }) => {
  const [teams, setTeams] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const { showToast } = useToast();
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchData();

    socket.on('teams:updated', fetchData);
    socket.on('challenges:updated', fetchData);

    return () => {
      socket.off('teams:updated');
      socket.off('challenges:updated');
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      const [teamsRes, challengesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/teams'),
        axios.get('http://localhost:5000/api/challenges')
      ]);
      setTeams(teamsRes.data);
      setChallenges(challengesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Erreur lors du chargement des données', 'error');
      setLoading(false);
    }
  };

  const handleUpdatePoints = async (teamId, points, operation = 'set') => {
    try {
      await axios.patch(
        `http://localhost:5000/api/teams/${teamId}/points`,
        { points, operation },
        { headers: getAuthHeaders() }
      );
      showToast('Points mis à jour avec succès', 'success');
    } catch (error) {
      showToast('Erreur lors de la mise à jour des points', 'error');
    }
  };

  const handleChallengeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      points: parseInt(formData.get('points')),
      status: formData.get('status')
    };

    try {
      if (editingChallenge) {
        await axios.put(`http://localhost:5000/api/challenges/${editingChallenge._id}`, data, {
          headers: getAuthHeaders()
        });
        showToast('Défi mis à jour avec succès', 'success');
      } else {
        await axios.post('http://localhost:5000/api/challenges', data, {
          headers: getAuthHeaders()
        });
        showToast('Défi créé avec succès', 'success');
      }
      setShowChallengeForm(false);
      setEditingChallenge(null);
      e.target.reset();
    } catch (error) {
      showToast(error.response?.data?.error || 'Erreur lors de l\'opération', 'error');
    }
  };

  const handleDeleteChallenge = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce défi ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/challenges/${id}`, {
        headers: getAuthHeaders()
      });
      showToast('Défi supprimé avec succès', 'success');
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Panneau d'Administration</h2>

      {/* Points Management */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6" aria-labelledby="points-section">
        <h3 id="points-section" className="text-xl font-bold mb-4">Gestion des Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: team.color }}
                    aria-hidden="true"
                  ></div>
                  <span className="font-medium">{team.name}</span>
                </div>
                <span className="text-lg font-bold text-primary-600">{team.points}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Points"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const points = parseInt(e.target.value);
                      if (!isNaN(points)) {
                        handleUpdatePoints(team._id, points, 'set');
                        e.target.value = '';
                      }
                    }
                  }}
                  aria-label={`Modifier les points de ${team.name}`}
                />
                <button
                  onClick={() => handleUpdatePoints(team._id, 10, 'add')}
                  className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  aria-label={`Ajouter 10 points à ${team.name}`}
                >
                  +10
                </button>
                <button
                  onClick={() => handleUpdatePoints(team._id, 10, 'subtract')}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  aria-label={`Retirer 10 points à ${team.name}`}
                >
                  -10
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Challenges Management */}
      <section className="bg-white rounded-lg shadow-md p-6" aria-labelledby="challenges-section">
        <div className="flex justify-between items-center mb-4">
          <h3 id="challenges-section" className="text-xl font-bold">Gestion des Défis</h3>
          <button
            onClick={() => {
              setEditingChallenge(null);
              setShowChallengeForm(true);
            }}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            aria-label="Créer un nouveau défi"
          >
            + Nouveau Défi
          </button>
        </div>

        {showChallengeForm && (
          <form onSubmit={handleChallengeSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-bold mb-3">
              {editingChallenge ? 'Modifier le défi' : 'Créer un défi'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="challenge-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  id="challenge-title"
                  name="title"
                  defaultValue={editingChallenge?.title || ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="challenge-points" className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  id="challenge-points"
                  name="points"
                  defaultValue={editingChallenge?.points || 0}
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="challenge-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="challenge-description"
                  name="description"
                  defaultValue={editingChallenge?.description || ''}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="challenge-status" className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  id="challenge-status"
                  name="status"
                  defaultValue={editingChallenge?.status || 'active'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="active">Actif</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                {editingChallenge ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChallengeForm(false);
                  setEditingChallenge(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <div key={challenge._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-lg">{challenge.title}</h4>
                  {challenge.description && (
                    <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                  )}
                </div>
                <span className="text-lg font-bold text-primary-600">{challenge.points} pts</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  challenge.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : challenge.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {challenge.status === 'active' ? 'Actif' : challenge.status === 'completed' ? 'Terminé' : 'Annulé'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingChallenge(challenge);
                      setShowChallengeForm(true);
                    }}
                    className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600"
                    aria-label={`Modifier ${challenge.title}`}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteChallenge(challenge._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    aria-label={`Supprimer ${challenge.title}`}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;



