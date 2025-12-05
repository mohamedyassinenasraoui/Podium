import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import TeamManagement from './components/TeamManagement';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import ToastContainer from './components/ToastContainer';

const socket = io('http://localhost:5000');

function App() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setIsAuthenticated(true);
            setUser(data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return (
      <AuthProvider>
        <ToastProvider>
          <Login onLogin={handleLogin} />
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            user={user} 
            onLogout={handleLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <a href="#main-content" className="skip-link">
            Aller au contenu principal
          </a>
          <main id="main-content" className="container mx-auto px-4 py-8" role="main" tabIndex="-1">
            {activeTab === 'leaderboard' && <Leaderboard socket={socket} />}
            {activeTab === 'teams' && <TeamManagement socket={socket} />}
            {activeTab === 'admin' && user?.role === 'admin' && <AdminPanel socket={socket} />}
          </main>
          <ToastContainer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

