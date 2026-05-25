import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout   from '../layouts/MainLayout'
import Login        from '../pages/Login'
import SinPermiso   from '../pages/SinPermiso'
import Dashboard    from '../pages/Dashboard'
import Productos    from '../pages/Productos'
import Variantes    from '../pages/Variantes'
import Categorias   from '../pages/Categorias'
import Proveedores  from '../pages/Proveedores'
import Clientes     from '../pages/Clientes'
import Empleados    from '../pages/Empleados'
import Ventas       from '../pages/Ventas'
import Reportes     from '../pages/Reportes'
import { DASHBOARD_ROLES, defaultPathForRole } from '../utils/permissions'
import { useAuth } from '../context/AuthContext'

function DefaultRedirect() {
  const { usuario } = useAuth()
  return <Navigate to={defaultPathForRole(usuario?.rol)} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login"       element={<Login />} />
      <Route path="/sin-permiso" element={<SinPermiso />} />

      {/* Protegidas — requieren autenticación */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DefaultRedirect />} />

        {/* Todos los roles autenticados */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute roles={DASHBOARD_ROLES}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catálogo — todos los roles */}
        <Route
          path="productos"
          element={
            <ProtectedRoute roles={['admin','inventario','vendedor','reportes','cliente_web']}>
              <Productos />
            </ProtectedRoute>
          }
        />
        <Route
          path="categorias"
          element={
            <ProtectedRoute roles={['admin','inventario','vendedor','reportes','cliente_web']}>
              <Categorias />
            </ProtectedRoute>
          }
        />

        {/* Inventario */}
        <Route
          path="variantes"
          element={
            <ProtectedRoute roles={['admin','inventario','vendedor','reportes','cliente_web']}>
              <Variantes />
            </ProtectedRoute>
          }
        />
        <Route
          path="proveedores"
          element={
            <ProtectedRoute roles={['admin','inventario','reportes']}>
              <Proveedores />
            </ProtectedRoute>
          }
        />

        {/* Ventas */}
        <Route
          path="clientes"
          element={
            <ProtectedRoute roles={['admin','vendedor','reportes']}>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="ventas"
          element={
            <ProtectedRoute roles={['admin','vendedor','reportes']}>
              <Ventas />
            </ProtectedRoute>
          }
        />

        {/* Solo admin */}
        <Route
          path="empleados"
          element={
            <ProtectedRoute roles={['admin']}>
              <Empleados />
            </ProtectedRoute>
          }
        />

        {/* Reportes */}
        <Route
          path="reportes"
          element={
            <ProtectedRoute roles={['admin','reportes']}>
              <Reportes />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  )
}
