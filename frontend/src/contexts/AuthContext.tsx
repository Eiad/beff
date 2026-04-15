import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User, JwtPayload } from '../types';
import { BEFF_AUTH_TOKEN } from '../constants';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate auth state from localStorage on mount (no network call needed)
    const token = localStorage.getItem(BEFF_AUTH_TOKEN);
    if (token) {
      try {
        const payload = jwtDecode<JwtPayload>(token);
        if (payload.exp * 1000 > Date.now()) {
          // Token is still valid — restore user from payload
          setUser({ id: payload.sub, name: payload.name, email: payload.email, createdAt: '' });
        } else {
          // Expired — clean up
          localStorage.removeItem(BEFF_AUTH_TOKEN);
        }
      } catch {
        localStorage.removeItem(BEFF_AUTH_TOKEN);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem(BEFF_AUTH_TOKEN, token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(BEFF_AUTH_TOKEN);
    setUser(null);
  };

  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : null));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
