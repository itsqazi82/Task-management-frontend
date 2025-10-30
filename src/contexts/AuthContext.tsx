import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';
import { toast } from 'sonner';

const AuthContext = createContext<AuthState | undefined>(undefined);

// Mock users for demo - replace with actual API calls
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@taskmanager.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'manager@taskmanager.com',
    name: 'Manager User',
    role: 'manager',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'user@taskmanager.com',
    name: 'Regular User',
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
    // Mock authentication - replace with actual API call
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
    } else {
      toast.error('Invalid email or password');
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
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
