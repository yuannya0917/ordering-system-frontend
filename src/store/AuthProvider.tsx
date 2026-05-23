import { useMemo, useState, type ReactNode } from 'react'
import {
  AUTH_STORAGE_KEY,
  AuthContext,
  type AuthContextValue,
  type StoredAuth,
} from './auth-context'

function getStoredAuth(): StoredAuth {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) {
      return { userId: '', userType: '' }
    }

    const parsed = JSON.parse(stored) as Partial<StoredAuth>
    const userType =
      parsed.userType === 'admin' || parsed.userType === 'customer' ? parsed.userType : ''

    return {
      userId: typeof parsed.userId === 'string' ? parsed.userId : '',
      userType,
    }
  } catch {
    return { userId: '', userType: '' }
  }
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState(getStoredAuth)

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn: auth.userId.length > 0 && auth.userType === 'admin',
      userId: auth.userId,
      userType: auth.userType,
      login: (nextUserId: string, nextUserType) => {
        const normalizedUserId = nextUserId.trim()
        const nextAuth = { userId: normalizedUserId, userType: nextUserType }
        setAuth(nextAuth)
        window.localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(nextAuth),
        )
      },
      logout: () => {
        setAuth({ userId: '', userType: '' })
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
      },
    }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
