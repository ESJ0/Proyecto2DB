import { useState }  from 'react'
import {
  getVentasDetalladas,
  getInventarioCompleto,
  getDetalleVentasProductos,
  getClientesConCompras,
  getProductosStockBajo,
  getCategoriasMasVendidas,
  getTopProductosMes,
  getVentasPorEmpleado,
  getProductosMasVendidos
} from '../api/reportes.api'
import PageHeader   from '../components/PageHeader'
import Table        from '../components/Table'
import ErrorMessage from '../components/ErrorMessage'
import Spinner      from '../components/Spinner'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import './Page.css'
import './Reportes.css'

// ── Definición de reportes ──────────────────────────────────
const REPORTES = [
  {
    id:       'ventas-detalladas',
    label:    'Ventas detalladas',
    tag:      'JOIN',
    desc:     'Ventas con cliente, empleado y total calculado',
    fetch:    getVentasDetalladas,
    columns:  [
      { key: 'id_venta',    label: 'ID' },
      { key: 'fecha',       label: 'Fecha',    render: (v) => formatDateTime(v) },
      { key: 'cliente',     label: 'Cliente' },
      { key: 'empleado',    label: 'Empleado' },
      { key: 'metodo_pago', label: 'Método' },
      { key: 'total',       label: 'Total',    render: (v) => formatCurrency(v) },
    ]
  },
  {
    id:       'inventario',
    label:    'Inventario completo',
    tag:      'JOIN',
    desc:     'Productos con categoría, proveedor y stock por variante',
    fetch:    getInventarioCompleto,
    columns:  [
      { key: 'sku',           label: 'SKU' },
      { key: 'producto',      label: 'Producto' },
      { key: 'marca',         label: 'Marca' },
      { key: 'categoria',     label: 'Categoría' },
      { key: 'proveedor',     label: 'Proveedor' },
      { key: 'talla',         label: 'Talla' },
      { key: 'color',         label: 'Color' },
      { key: 'stock_total',   label: 'Stock',
        render: (v) => (
          <span className={`badge ${v <= 5 ? 'badge--error' : v <= 15 ? 'badge--warning' : 'badge--success'}`}>
            {v}
          </span>
        )
      },
      { key: 'precio_actual', label: 'Precio', render: (v) => formatCurrency(v) },
    ]
  },
  {
    id:       'detalle-ventas-productos',
    label:    'Detalle ventas por producto',
    tag:      'JOIN',
    desc:     'Detalle de cada venta con variante y subtotal',
    fetch:    getDetalleVentasProductos,
    columns:  [
      { key: 'id_venta',         label: 'Venta' },
      { key: 'fecha',            label: 'Fecha',     render: (v) => formatDateTime(v) },
      { key: 'producto',         label: 'Producto' },
      { key: 'marca',            label: 'Marca' },
      { key: 'talla',            label: 'Talla' },
      { key: 'color',            label: 'Color' },
      { key: 'cantidad',         label: 'Cant.' },
      { key: 'precio_unitario',  label: 'P. Unit.',  render: (v) => formatCurrency(v) },
      { key: 'subtotal',         label: 'Subtotal',  render: (v) => formatCurrency(v) },
    ]
  },
  {
    id:       'clientes-con-compras',
    label:    'Clientes con compras',
    tag:      'EXISTS',
    desc:     'Clientes que han realizado al menos una compra (subquery EXISTS)',
    fetch:    getClientesConCompras,
    columns:  [
      { key: 'id_cliente', label: 'ID' },
      { key: 'nombre',     label: 'Nombre' },
      { key: 'telefono',   label: 'Teléfono' },
      { key: 'email',      label: 'Email' },
    ]
  },
  {
    id:       'productos-stock-bajo',
    label:    'Stock bajo el promedio',
    tag:      'SUBQUERY',
    desc:     'Variantes con stock menor al promedio general',
    fetch:    getProductosStockBajo,
    columns:  [
      { key: 'producto',    label: 'Producto' },
      { key: 'marca',       label: 'Marca' },
      { key: 'talla',       label: 'Talla' },
      { key: 'color',       label: 'Color' },
      { key: 'stock_total', label: 'Stock',
        render: (v) => (
          <span className="badge badge--error">{v}</span>
        )
      },
    ]
  },
  {
    id:       'categorias-mas-vendidas',
    label:    'Categorías más vendidas',
    tag:      'GROUP BY',
    desc:     'Categorías con más de 1 unidad vendida, agrupadas por ingresos',
    fetch:    getCategoriasMasVendidas,
    columns:  [
      { key: 'categoria',        label: 'Categoría' },
      { key: 'total_productos',  label: 'Productos' },
      { key: 'unidades_vendidas',label: 'Uds. vendidas' },
      { key: 'total_ingresos',   label: 'Ingresos', render: (v) => formatCurrency(v) },
    ]
  },
  {
    id:       'top-productos-mes',
    label:    'Top productos del mes',
    tag:      'CTE',
    desc:     'Top 5 productos más vendidos del mes actual (WITH)',
    fetch:    getTopProductosMes,
    columns:  [
      { key: 'producto',          label: 'Producto' },
      { key: 'marca',             label: 'Marca' },
      { key: 'precio_actual',     label: 'Precio',    render: (v) => formatCurrency(v) },
      { key: 'unidades_vendidas', label: 'Uds. vendidas' },
      { key: 'total_ingresos',    label: 'Ingresos',  render: (v) => formatCurrency(v) },
    ]
  },
  {
    id:       'ventas-por-empleado',
    label:    'Ventas por empleado',
    tag:      'VIEW',
    desc:     'Total de ventas e ingresos por empleado (vista SQL)',
    fetch:    getVentasPorEmpleado,
    columns:  [
      { key: 'empleado',       label: 'Empleado' },
      { key: 'cargo',          label: 'Cargo' },
      { key: 'total_ventas',   label: 'Ventas' },
      { key: 'total_ingresos', label: 'Ingresos', render: (v) => formatCurrency(v) },
    ]
  },
  {
    id:       'productos-mas-vendidos',
    label:    'Productos más vendidos',
    tag:      'VIEW',
    desc:     'Ranking de productos por unidades vendidas (vista SQL)',
    fetch:    getProductosMasVendidos,
    columns:  [
      { key: 'producto',          label: 'Producto' },
      { key: 'marca',             label: 'Marca' },
      { key: 'categoria',         label: 'Categoría' },
      { key: 'unidades_vendidas', label: 'Uds. vendidas' },
      { key: 'total_ingresos',    label: 'Ingresos', render: (v) => formatCurrency(v) },
    ]
  },
]

// ── Tag colors ──────────────────────────────────────────────
const TAG_CLASS = {
  'JOIN':     'rtag--join',
  'EXISTS':   'rtag--exists',
  'SUBQUERY': 'rtag--subquery',
  'GROUP BY': 'rtag--groupby',
  'CTE':      'rtag--cte',
  'VIEW':     'rtag--view',
}

// ── Componente de un reporte individual ────────────────────
function ReportePanel({ reporte }) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [open,    setOpen]    = useState(false)

  const handleToggle = async () => {
    if (open) { setOpen(false); return }
    setOpen(true)
    if (data) return   // ya cargado, no volver a fetchear

    try {
      setLoading(true)
      setError(null)
      const result = await reporte.fetch()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`reporte-panel ${open ? 'reporte-panel--open' : ''}`}>
      <button className="reporte-header" onClick={handleToggle}>
        <div className="reporte-header-left">
          <span className={`rtag ${TAG_CLASS[reporte.tag] || ''}`}>{reporte.tag}</span>
          <div>
            <span className="reporte-title">{reporte.label}</span>
            <span className="reporte-desc">{reporte.desc}</span>
          </div>
        </div>
        <span className="reporte-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="reporte-body">
          {loading && <Spinner />}
          {error   && <ErrorMessage message={error} />}
          {data    && (
            <>
              <p className="reporte-count">{data.length} registros</p>
              <Table
                columns={reporte.columns}
                data={data}
                emptyMessage="Sin resultados"
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Página principal ────────────────────────────────────────
export default function Reportes() {
  return (
    <div className="page">
      <PageHeader
        title="Reportes"
        subtitle="Consultas SQL avanzadas sobre la base de datos"
      />

      <div className="reportes-list">
        {REPORTES.map(r => (
          <ReportePanel key={r.id} reporte={r} />
        ))}
      </div>
    </div>
  )
}