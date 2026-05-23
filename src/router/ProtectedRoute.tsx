import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}
