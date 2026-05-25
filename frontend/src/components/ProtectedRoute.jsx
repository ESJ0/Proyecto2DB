import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

// Si no se pasa roles, solo verifica que esté autenticado
export default function ProtectedRoute({ children, roles }) {
  const { usuario, loading } = useAuth()

  if (loading) return <Spinner />

  if (!usuario) return <Navigate to="/login" replace />

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/sin-permiso" replace />
  }

  return children
}