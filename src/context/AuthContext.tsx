import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { initialUsers } from '../services/mockData';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (email: string, role: Role) => Promise<void>;
  switchRole: (role: Role) => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kisan_market_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState<Role | null>(() => {
    return user ? user.role : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('kisan_market_user', JSON.stringify(user));
      setRole(user.role);
    } else {
      localStorage.removeItem('kisan_market_user');
      setRole(null);
    }
  }, [user]);

  const login = async (email: string, targetRole: Role) => {
    const loggedInUser = await api.login(email, targetRole);
    setUser(loggedInUser);
    setRole(targetRole);
  };

  const switchRole = (newRole: Role) => {
    const persona = initialUsers.find(u => u.role === newRole) || {
      id: 99,
      name: `${newRole.toUpperCase()} User`,
      email: `${newRole}@kisanmarket.in`,
      role: newRole,
      is_verified: true,
      verification_badge: 'VERIFIED' as const,
      reliability_score: 4.8
    };
    setUser(persona);
    setRole(newRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAuthenticated: !!user,
      login,
      switchRole,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
