import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutApi } from '../api/auth.api'
import { DASHBOARD_ROLES } from '../utils/permissions'
import './MainLayout.css'

const NAV = [
  {
    to: '/dashboard', label: 'Dashboard', roles: DASHBOARD_ROLES,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  {
    to: '/productos', label: 'Productos', roles: ['admin', 'inventario', 'vendedor', 'reportes', 'cliente_web'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    )
  },
  {
    to: '/variantes', label: 'Variantes', roles: ['admin', 'inventario', 'vendedor', 'reportes', 'cliente_web'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3m0 14v3M2 12h3m14 0h3m-4.22-7.78-2.12 2.12M6.34 17.66l-2.12 2.12m0-13.56 2.12 2.12m11.32 11.32 2.12 2.12"/>
      </svg>
    )
  },
  {
    to: '/categorias', label: 'Categorias', roles: ['admin', 'inventario', 'vendedor', 'reportes', 'cliente_web'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
  {
    to: '/proveedores', label: 'Proveedores', roles: ['admin', 'inventario', 'reportes'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    )
  },
  {
    to: '/clientes', label: 'Clientes', roles: ['admin', 'vendedor', 'reportes'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  {
    to: '/empleados', label: 'Empleados', roles: ['admin'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        <line x1="12" y1="11" x2="12" y2="14"/><line x1="10.5" y1="13" x2="13.5" y2="13"/>
      </svg>
    )
  },
  {
    to: '/ventas', label: 'Ventas', roles: ['admin', 'vendedor', 'reportes'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  {
    to: '/reportes', label: 'Reportes', roles: ['admin', 'reportes'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    )
  },
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
    try { await logoutApi() } catch { }
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
          <span className="brand-display">ESJO SHOP</span>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}