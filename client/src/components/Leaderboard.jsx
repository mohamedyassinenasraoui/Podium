import { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';

const Leaderboard = ({ socket }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams');
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      showToast('Erreur lors du chargement du leaderboard', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();

    // Listen for real-time updates
    socket.on('leaderboard:updated', () => {
      fetchTeams();
      showToast('Leaderboard mis à jour', 'info');
    });

    socket.on('teams:updated', () => {
      fetchTeams();
    });

    return () => {
      socket.off('leaderboard:updated');
      socket.off('teams:updated');
    };
  }, [socket, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900" id="leaderboard-title">
        Classement des Équipes
      </h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden" role="table" aria-labelledby="leaderboard-title">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Tableau de classement des équipes">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Équipe
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team, index) => (
                <tr 
                  key={team._id} 
                  className="hover:bg-gray-50 transition-colors"
                  aria-rowindex={index + 1}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: team.color }}
                        aria-hidden="true"
                      ></div>
                      <span className="text-sm font-medium text-gray-900">{team.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-primary-600">{team.points}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      team.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : team.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {team.status === 'active' ? 'Actif' : team.status === 'inactive' ? 'Inactif' : 'Disqualifié'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {teams.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune équipe enregistrée
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;



