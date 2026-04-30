import { NavLink, Outlet } from 'react-router-dom'
import './MainLayout.css'

const nav = [
  { to: '/dashboard',  label: 'Dashboard',   icon: '▦' },
  { to: '/productos',  label: 'Productos',    icon: '◫' },
  { to: '/variantes',  label: 'Variantes',    icon: '◈' },
  { to: '/categorias', label: 'Categorías',   icon: '◻' },
  { to: '/proveedores',label: 'Proveedores',  icon: '◇' },
  { to: '/clientes',   label: 'Clientes',     icon: '○' },
  { to: '/empleados',  label: 'Empleados',    icon: '◎' },
  { to: '/ventas',     label: 'Ventas',       icon: '◈' },
  { to: '/reportes',   label: 'Reportes',     icon: '◱' },
]

export default function MainLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-display">SOLE</span>
          <span className="brand-sub">inventory</span>
        </div>

        <nav className="sidebar-nav">
          {nav.map(({ to, label, icon }) => (
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

        <div className="sidebar-footer">
          <div className="sidebar-footer-dot" />
          <span>Sistema activo</span>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}