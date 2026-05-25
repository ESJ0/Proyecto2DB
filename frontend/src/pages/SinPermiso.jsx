import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './SinPermiso.css'

export default function SinPermiso() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="sin-permiso">
      <div className="sin-permiso-card">
        <span className="sin-permiso-code">403</span>
        <h1 className="sin-permiso-title">Acceso denegado</h1>
        <p className="sin-permiso-desc">
          Tu rol <strong>{usuario?.rol}</strong> no tiene permiso para acceder a esta sección.
        </p>
        <button className="sin-permiso-btn" onClick={() => navigate('/dashboard')}>
          Volver al Dashboard
        </button>
      </div>
    </div>
  )
}