import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://task-management-backend-production-8391.up.railway.app';

const AuthContext = createContext<AuthState | undefined>(undefined);

// Mock users for demo - replace with actual API calls
const MOCK_USERS: User[] = [
  {
    _id: '1',
    id: '1',
    email: 'admin@taskmanager.com',
    username: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    id: '2',
    email: 'manager@taskmanager.com',
    username: 'Manager User',
    role: 'manager',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    id: '3',
    email: 'user@taskmanager.com',
    username: 'Regular User',
    role: 'user',
    managerId: '2',
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      const user = data.user;
      const token = data.token;

      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      toast.success(`Welcome back, ${user.username}!`);
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
