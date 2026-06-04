import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { token, refreshUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setName(data.name);
          setEmail(data.email);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, [token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      const body: any = { name, email };
      if (password.trim() !== '') body.password = password;

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur de mise à jour');
      setMessage({ text: 'Profil mis à jour avec succès.', type: 'success' });
      setPassword('');
      refreshUser(data);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-2xl font-bold mb-6 text-slate-800">Paramètres du profil</h3>
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nom complet</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Adresse email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Nouveau mot de passe (laisser vide pour ne pas modifier)</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm font-medium text-sm transition-colors">
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
};
