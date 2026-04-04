import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
  const { firebaseUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-farm-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-farm-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-farm-muted text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return firebaseUser ? <Outlet /> : <Navigate to="/login" replace />
}
