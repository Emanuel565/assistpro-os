import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, senha: string) => Promise<void>;
  switchDemo: (userId?: number, cargo?: UserRole) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { MOCK_DEMO_USERS } from '../utils/mockData';

const DEMO_USER_KEY = 'assistpro_demo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async (jwtToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(data.user));
      } else if (jwtToken !== 'demo-token-preview') {
        logout();
      }
    } catch {
      // Se a API falhar (ex: GitHub Pages estático), mantém o usuário demo salvo
      if (!user) {
        const fallback = MOCK_DEMO_USERS[0];
        setUser(fallback);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (loginStr: string, senhaStr: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginStr, senha: senhaStr })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao realizar login');
      }
      setAuthToken(data.token);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(data.user));
    } catch (err: any) {
      // Fallback para ambiente de demonstração estático no GitHub Pages
      const matched: User = MOCK_DEMO_USERS.find(u => u.login.toLowerCase() === loginStr.toLowerCase()) || {
        id: 1,
        nome: loginStr === 'admin' ? 'Administrador Geral' : loginStr,
        login: loginStr,
        cargo: 'ADMIN' as UserRole,
        status: 'ONLINE'
      };
      setAuthToken('demo-token-preview');
      setToken('demo-token-preview');
      setUser(matched);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(matched));
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemo = async (userId?: number, cargo?: UserRole) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cargo })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao alternar perfil demo');
      }
      setAuthToken(data.token);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(data.user));
    } catch {
      // Fallback para GitHub Pages
      const matched = MOCK_DEMO_USERS.find(u => (cargo && u.cargo === cargo) || (userId && u.id === userId)) || MOCK_DEMO_USERS[0];
      setAuthToken('demo-token-preview');
      setToken('demo-token-preview');
      setUser(matched);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(matched));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem(DEMO_USER_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        switchDemo,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
