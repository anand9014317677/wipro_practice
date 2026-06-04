import { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';
import { getStoredUser, getToken, setSession, clearSession } from '../utils/auth';

const AuthContext = createContext(null);

/**
 * Holds auth state and exposes login / register / logout.
 * State is initialised from localStorage so a refresh keeps you signed in.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setSession(data.accessToken, data.user);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      setSession(data.accessToken, data.user);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const value = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user && !!getToken(),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
