import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutApi } from '../api/auth.api'
import { DASHBOARD_ROLES } from '../utils/permissions'
import './MainLayout.css'

const NAV = [
  { to: '/dashboard',   label: 'Dashboard',   icon: 'D', roles: DASHBOARD_ROLES },
  { to: '/productos',   label: 'Productos',   icon: 'P', roles: ['admin', 'inventario', 'vendedor', 'reportes', 'cliente_web'] },
  { to: '/variantes',   label: 'Variantes',   icon: 'V', roles: ['admin', 'inventario', 'vendedor', 'reportes', 'cliente_web'] },
  { to: '/categorias',  label: 'Categorias',  icon: 'C', roles: ['admin', 'inventario', 'vendedor', 'reportes', 'cliente_web'] },
  { to: '/proveedores', label: 'Proveedores', icon: 'R', roles: ['admin', 'inventario', 'reportes'] },
  { to: '/clientes',    label: 'Clientes',    icon: 'L', roles: ['admin', 'vendedor', 'reportes'] },
  { to: '/empleados',   label: 'Empleados',   icon: 'E', roles: ['admin'] },
  { to: '/ventas',      label: 'Ventas',      icon: 'S', roles: ['admin', 'vendedor', 'reportes'] },
  { to: '/reportes',    label: 'Reportes',    icon: 'I', roles: ['admin', 'reportes'] },
]

const ROL_LABEL = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
  inventario: 'Inventario',
  reportes: 'Reportes',
  cliente_web: 'Cliente Web',
}

const ROL_COLOR = {
  admin: '#1A1916',
  vendedor: '#2D6A4F',
  inventario: '#2D5BA3',
  reportes: '#7D5A00',
  cliente_web: '#6B3FA0',
}

export default function MainLayout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logoutApi() } catch { /* ignorar error de red */ }
    logout()
    navigate('/login', { replace: true })
  }

  const navVisible = NAV.filter(item =>
    !item.roles || item.roles.includes(usuario?.rol)
  )

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-display">SOLE</span>
          <span className="brand-sub">inventory</span>
        </div>

        <nav className="sidebar-nav">
          {navVisible.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''}`
              }
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{usuario?.username}</span>
            <span
              className="sidebar-user-rol"
              style={{ color: ROL_COLOR[usuario?.rol] }}
            >
              {ROL_LABEL[usuario?.rol] || usuario?.rol}
            </span>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Cerrar sesion">
            Salir
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
