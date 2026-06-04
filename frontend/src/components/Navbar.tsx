import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, view, setView } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="bg-slate-800 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <span className="font-bold text-xl tracking-tight text-indigo-400">SecureAuth</span>
        <div className="space-x-2">
          {user.role === 'admin' && (
            <button 
              onClick={() => setView('admin')} 
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'admin' ? 'bg-slate-900 text-indigo-400' : 'hover:bg-slate-700'}`}
            >
              Console Admin
            </button>
          )}
          <button 
            onClick={() => setView('profile')} 
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'profile' ? 'bg-slate-900 text-indigo-400' : 'hover:bg-slate-700'}`}
          >
            Mon Profil
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xs bg-slate-700 px-3 py-1 rounded-full text-slate-300 font-mono">{user.email}</span>
        <button onClick={logout} className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};
