"use client"
import { createContext, useContext, useState, ReactNode } from 'react'
import { mockUsers } from '../lib/mockData'

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
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid credentials')
    setUser(user)
  }

  const signup = async (name: string, email: string, password: string) => {
    const exists = mockUsers.find(u => u.email === email)
    if (exists) throw new Error('Email already exists')
    const newUser = { id: String(mockUsers.length + 1), name, email, password, role: 'user', fast2smsApiKey: '', creditBalance: 0 }
    mockUsers.push(newUser)
    setUser(newUser)
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}