'use client'

import { useState, useEffect, createContext, useContext } from 'react'

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  themePreference: 'dark' | 'light' | 'system'
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  name: 'Dali',
  email: 'hammadih99@gmail.com',
  avatar: '🦞',
  role: 'Lead AI Architect & Owner',
  themePreference: 'dark',
}

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (email: string, name: string) => void
  logout: () => void
  updateProfile: (updates: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  isAuthenticated: true,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('taskflow_user')
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch (e) {
          setUser(DEFAULT_USER)
        }
      }
    }
  }, [])

  const saveUser = (u: UserProfile | null) => {
    setUser(u)
    if (u) {
      localStorage.setItem('taskflow_user', JSON.stringify(u))
    } else {
      localStorage.removeItem('taskflow_user')
    }
  }

  const login = (email: string, name: string) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      email,
      name,
    }
    saveUser(newUser)
  }

  const logout = () => {
    saveUser(null)
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updates }
      saveUser(updated)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
