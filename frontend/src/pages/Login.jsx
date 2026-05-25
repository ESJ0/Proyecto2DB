import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginApi } from '../api/auth.api'
import './Login.css'

// Usuarios de prueba para referencia rápida
const DEMO_USERS = [
  { username: 'admin_user',      password: 'admin123',      rol: 'admin',       label: 'Administrador' },
  { username: 'vendedor_user',   password: 'vendedor123',   rol: 'vendedor',    label: 'Vendedor' },
  { username: 'inventario_user', password: 'inventario123', rol: 'inventario',  label: 'Inventario' },
  { username: 'reportes_user',   password: 'reportes123',   rol: 'reportes',    label: 'Reportes' },
  { username: 'cliente_user',    password: 'cliente123',    rol: 'cliente_web', label: 'Cliente Web' },
]

const ROL_COLOR = {
  admin:       'badge--admin',
  vendedor:    'badge--vendedor',
  inventario:  'badge--inventario',
  reportes:    'badge--reportes',
  cliente_web: 'badge--cliente',
}

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [values,     setValues]     = useState({ username: '', password: '' })
  const [error,      setError]      = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [showPass,   setShowPass]   = useState(false)

  const handleChange = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!values.username || !values.password) {
      setError('Completa usuario y contraseña')
      return
    }
    try {
      setLoading(true)
      setError(null)
      const data = await loginApi(values)
      login(data.token, data.usuario)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (u) => {
    setValues({ username: u.username, password: u.password })
    setError(null)
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <span className="login-brand-name">ESJ0 SHOP</span>
          <span className="login-brand-sub">inventory · sistema de gestión</span>
        </div>
        <p className="login-tagline">
          Controla tu inventario y tus ventas.
        </p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h1 className="login-title">Iniciar sesión</h1>
            <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="login-error">
              <span className="login-error-icon">!</span>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Usuario</label>
              <input
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="Ej. admin_user"
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="login-field">
              <label className="login-label">Contraseña</label>
              <div className="login-pass-wrap">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-pass-toggle"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                >
                  {showPass ? '🔍' : '👁'}
                </button>
              </div>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>

          {/* Acceso rápido para calificación */}
          <div className="login-demo">
            <p className="login-demo-title">Usuarios de prueba</p>
            <div className="login-demo-grid">
              {DEMO_USERS.map(u => (
                <button
                  key={u.username}
                  className="login-demo-btn"
                  onClick={() => fillDemo(u)}
                >
                  <span className={`login-demo-badge ${ROL_COLOR[u.rol]}`}>
                    {u.label}
                  </span>
                  <span className="login-demo-user">{u.username}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}