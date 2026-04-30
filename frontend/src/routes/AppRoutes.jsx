import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout   from '../layouts/MainLayout'
import Dashboard    from '../pages/Dashboard'
import Productos    from '../pages/Productos'
import Variantes    from '../pages/Variantes'
import Categorias   from '../pages/Categorias'
import Proveedores  from '../pages/Proveedores'
import Clientes     from '../pages/Clientes'
import Empleados    from '../pages/Empleados'
import Ventas       from '../pages/Ventas'
import Reportes     from '../pages/Reportes'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"   element={<Dashboard />} />
        <Route path="productos"   element={<Productos />} />
        <Route path="variantes"   element={<Variantes />} />
        <Route path="categorias"  element={<Categorias />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="clientes"    element={<Clientes />} />
        <Route path="empleados"   element={<Empleados />} />
        <Route path="ventas"      element={<Ventas />} />
        <Route path="reportes"    element={<Reportes />} />
      </Route>
    </Routes>
  )
}