import React, { createContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  view: 'profile' | 'admin' | 'login' | 'register';
  setView: (view: 'profile' | 'admin' | 'login' | 'register') => void;
  refreshUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<'profile' | 'admin' | 'login' | 'register'>('login');

  useEffect(() => {
    const storedToken = localStorage.getItem('mgmt_token');
    const storedUser = localStorage.getItem('mgmt_user_data');
    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setView(parsedUser.role === 'admin' ? 'admin' : 'profile');
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('mgmt_token', newToken);
    localStorage.setItem('mgmt_user_data', JSON.stringify(newUser));
    setView(newUser.role === 'admin' ? 'admin' : 'profile');
  };

  const refreshUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('mgmt_user_data', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mgmt_token');
    localStorage.removeItem('mgmt_user_data');
    setView('login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, view, setView, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
