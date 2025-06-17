'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, PurchaseHistory } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'balance'>) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addPurchaseHistory: (purchase: Omit<PurchaseHistory, 'id'>) => void;
  getPurchaseHistory: () => PurchaseHistory[];
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check if user exists in localStorage
      const savedUsers = localStorage.getItem('users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      
      const foundUser = users.find((u: User) => 
        u.username === username && u.email === password // Using email as password for demo
      );
      
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'balance'>): Promise<boolean> => {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        balance: 1000, // Starting balance for demo
      };

      // Save to users list
      const savedUsers = localStorage.getItem('users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      
      // Check if username already exists
      if (users.some((u: User) => u.username === userData.username)) {
        return false;
      }
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set as current user
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in users list
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const updatedUsers = users.map((u: User) => 
          u.id === user.id ? updatedUser : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    }
  };

  const addPurchaseHistory = (purchase: Omit<PurchaseHistory, 'id'>) => {
    const newPurchase: PurchaseHistory = {
      ...purchase,
      id: Date.now().toString(),
    };

    const savedHistory = localStorage.getItem('purchaseHistory');
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    history.unshift(newPurchase); // Add to beginning
    localStorage.setItem('purchaseHistory', JSON.stringify(history));
  };

  const getPurchaseHistory = (): PurchaseHistory[] => {
    const savedHistory = localStorage.getItem('purchaseHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateBalance,
    addPurchaseHistory,
    getPurchaseHistory,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
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