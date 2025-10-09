"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'


interface AuthContextType {
  user: any | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)


  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Login failed');
    }
    const data = await res.json();
    setUser({ ...data.user, token: data.token });
    // Optionally, store token in localStorage/sessionStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }));
    }
  };


  const signup = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Signup failed');
    }
    const data = await res.json();
    setUser({ ...data.user, token: data.token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  // On mount, restore user from localStorage if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}