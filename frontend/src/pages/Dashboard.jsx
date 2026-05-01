import { useEffect, useState } from 'react'
import { getVentas }           from '../api/ventas.api'
import { getProductos }        from '../api/productos.api'
import { getClientes }         from '../api/clientes.api'
import { getProductosMasVendidos } from '../api/reportes.api'
import Spinner      from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import './Dashboard.css'

export default function Dashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [ventas, productos, clientes, topProductos] = await Promise.all([
          getVentas(),
          getProductos(),
          getClientes(),
          getProductosMasVendidos()
        ])

        const totalIngresos = ventas.reduce((acc, v) => acc + parseFloat(v.total || 0), 0)

        setStats({
          totalVentas:   ventas.length,
          totalProductos: productos.length,
          totalClientes:  clientes.length,
          totalIngresos,
          ultimasVentas:  ventas.slice(0, 5),
          topProductos:   topProductos.slice(0, 5)
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Spinner />
  if (error)   return <ErrorMessage message={error} />

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1 className="dash-title">Dashboard</h1>
        <p className="dash-subtitle">Resumen general de la tienda</p>
      </div>

      {/* KPIs */}
      <div className="dash-kpis">
        <div className="kpi">
          <span className="kpi-label">Ingresos totales</span>
          <span className="kpi-value kpi-value--lg">{formatCurrency(stats.totalIngresos)}</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Ventas realizadas</span>
          <span className="kpi-value">{stats.totalVentas}</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Productos activos</span>
          <span className="kpi-value">{stats.totalProductos}</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Clientes registrados</span>
          <span className="kpi-value">{stats.totalClientes}</span>
        </div>
      </div>

      <div className="dash-grid">
        {/* Últimas ventas */}
        <div className="dash-card">
          <h2 className="dash-card-title">Últimas ventas</h2>
          <div className="dash-list">
            {stats.ultimasVentas.map(v => (
              <div key={v.id_venta} className="dash-list-item">
                <div className="dash-list-item-left">
                  <span className="dash-list-item-title">{v.cliente}</span>
                  <span className="dash-list-item-sub">{formatDateTime(v.fecha)}</span>
                </div>
                <div className="dash-list-item-right">
                  <span className="dash-list-item-amount">{formatCurrency(v.total)}</span>
                  <span className={`dash-badge dash-badge--${v.metodo_pago === 'Efectivo' ? 'cash' : 'card'}`}>
                    {v.metodo_pago}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top productos */}
        <div className="dash-card">
          <h2 className="dash-card-title">Productos más vendidos</h2>
          <div className="dash-list">
            {stats.topProductos.map((p, i) => (
              <div key={p.id_producto} className="dash-list-item">
                <div className="dash-list-item-left">
                  <span className="dash-rank">0{i + 1}</span>
                  <div>
                    <span className="dash-list-item-title">{p.producto}</span>
                    <span className="dash-list-item-sub">{p.marca}</span>
                  </div>
                </div>
                <div className="dash-list-item-right">
                  <span className="dash-list-item-amount">{p.unidades_vendidas} uds</span>
                  <span className="dash-list-item-sub">{formatCurrency(p.total_ingresos)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}