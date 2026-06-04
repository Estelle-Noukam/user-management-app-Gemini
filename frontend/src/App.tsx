import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { AdminDashboard } from './components/AdminDashboard';

const AppContent: React.FC = () => {
  const { view } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {view === 'login' && <Login />}
        {view === 'register' && <Register />}
        {view === 'profile' && <Profile />}
        {view === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
