import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockLogin, mockRegister, mockLogout, mockDeleteUser, mockGetAllUsers } from '../services/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'volunteer' | 'admin';
  location?: string;
  phone?: string;
  skills?: string[];
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'user' | 'volunteer') => Promise<void>;
  logout: () => void;
  updateProfile: (updatedInfo: Partial<User>) => void;
  deleteUser?: (userId: string) => Promise<void>;
  getAllUsers?: () => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // No token: ensure logged-out state
        localStorage.removeItem('currentUser');
        setUser(null);
        setIsLoading(false);
        return;
      }
      // Try to hydrate from backend
      try {
        const BASE = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5001/api';
        const res = await fetch(`${BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Unauthenticated');
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      } catch {
        // Token invalid: clear and logout
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await mockLogin(email, password);
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'volunteer') => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await mockRegister(name, email, password, role);
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    mockLogout();
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    // Scroll to top after logout
    window.scrollTo(0, 0);
  };

  const updateProfile = (updatedInfo: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedInfo };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  // Admin functions
  const deleteUser = async (userId: string) => {
    if (user?.role !== 'admin') return;
    await mockDeleteUser(userId);
  };

  const getAllUsers = async () => {
    if (user?.role !== 'admin') return [];
    return mockGetAllUsers();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      login, 
      register, 
      logout, 
      updateProfile,
      deleteUser: user?.role === 'admin' ? deleteUser : undefined,
      getAllUsers: user?.role === 'admin' ? getAllUsers : undefined
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};