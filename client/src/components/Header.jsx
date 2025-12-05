import { useToast } from '../contexts/ToastContext';

const Header = ({ user, onLogout, activeTab, setActiveTab }) => {
  const { showToast } = useToast();

  const handleLogout = () => {
    onLogout();
    showToast('Déconnexion réussie', 'success');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            🏆 Leaderboard des Équipes
          </h1>
          
          <nav className="flex items-center gap-4" role="navigation" aria-label="Navigation principale">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'leaderboard'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-current={activeTab === 'leaderboard' ? 'page' : undefined}
            >
              Leaderboard
            </button>
            
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'teams'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-current={activeTab === 'teams' ? 'page' : undefined}
            >
              Équipes
            </button>
            
            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={activeTab === 'admin' ? 'page' : undefined}
              >
                Administration
              </button>
            )}
            
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <span className="text-sm text-gray-600" aria-label={`Connecté en tant que ${user?.username}`}>
                👤 {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Se déconnecter"
              >
                Déconnexion
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;



