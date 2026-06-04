import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const { token, user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const body: any = { name, email, role };
        if (password.trim() !== '') body.password = password;
        
        const res = await fetch(`/api/admin/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(body)
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Erreur modification'); }
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name, email, password, role })
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Erreur création'); }
      }
      resetForm();
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (u: UserItem) => {
    setEditingId(u.id);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setPassword('');
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 h-fit">
          <h3 className="text-xl font-bold mb-4 text-slate-800">{editingId ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}</h3>
          {error && <div className="bg-rose-50 text-rose-700 p-3 rounded-lg text-xs mb-4 border border-rose-200">{error}</div>}
          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nom complet</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Adresse email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mot de passe {editingId && '(optionnel)'}</label>
              <input type="password" required={!editingId} value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Rôle</label>
              <select value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')} className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md">
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div className="flex space-x-2 pt-2">
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md font-medium text-sm transition-colors">
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-md font-medium text-sm transition-colors">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Liste globale des utilisateurs</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase">Rôle</th>
                  <th className="px-6 py-3 text-right font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map(u => (
                  <tr key={u.id} className={u.id === currentUser?.id ? 'bg-indigo-50/40' : ''}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{u.name}</div>
                      <div className="text-slate-500 text-xs">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 font-medium">
                      <button onClick={() => handleEdit(u)} className="text-indigo-600 hover:text-indigo-900">Modifier</button>
                      {u.id !== currentUser?.id && (
                        <button onClick={() => handleDelete(u.id)} className="text-rose-600 hover:text-rose-900">Supprimer</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
