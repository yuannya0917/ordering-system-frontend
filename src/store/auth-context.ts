import { createContext } from 'react'

export const AUTH_STORAGE_KEY = 'ordering-system-auth'

export type AuthUserType = 'customer' | 'admin'

export type StoredAuth = {
  userId: string
  userType: AuthUserType | ''
}

export type AuthContextValue = {
  isLoggedIn: boolean
  userId: string
  userType: AuthUserType | ''
  login: (userId: string, userType: AuthUserType) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
