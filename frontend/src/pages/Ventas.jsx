import { useState }  from 'react'
import useFetch      from '../hooks/useFetch'
import { getVentas, createVenta } from '../api/ventas.api'
import { getClientes }   from '../api/clientes.api'
import { getEmpleados }  from '../api/empleados.api'
import { getVariantes }  from '../api/variantes.api'
import PageHeader   from '../components/PageHeader'
import Button       from '../components/Button'
import Table        from '../components/Table'
import Modal        from '../components/Modal'
import FormField    from '../components/FormField'
import ErrorMessage from '../components/ErrorMessage'
import Spinner      from '../components/Spinner'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import './Page.css'
import './Ventas.css'

const METODOS = ['Efectivo', 'Tarjeta']

const COLUMNS = [
  { key: 'id_venta',    label: 'ID' },
  { key: 'fecha',       label: 'Fecha',    render: (v) => formatDateTime(v) },
  { key: 'cliente',     label: 'Cliente' },
  { key: 'empleado',    label: 'Empleado' },
  { key: 'metodo_pago', label: 'Método',
    render: (v) => (
      <span className={`badge ${v === 'Efectivo' ? 'badge--success' : 'badge--neutral'}`}>{v}</span>
    )
  },
  { key: 'total',       label: 'Total',    render: (v) => formatCurrency(v) },
]

const ITEM_EMPTY = { id_variante: '', cantidad: 1, precio_unitario: '' }

export default function Ventas() {
  const { data: ventas,    loading: loadingV, error, reload } = useFetch(getVentas)
  const { data: clientes,  loading: loadingC }  = useFetch(getClientes)
  const { data: empleados, loading: loadingE }  = useFetch(getEmpleados)
  const { data: variantes, loading: loadingVar }= useFetch(getVariantes)

  const [modalOpen,   setModalOpen]   = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitting,  setSubmitting]  = useState(false)

  // Cabecera de la venta
  const [head, setHead] = useState({ id_cliente: '', id_empleado: '', metodo_pago: '' })
  const [headErrors, setHeadErrors] = useState({})

  // Items del detalle
  const [items, setItems] = useState([{ ...ITEM_EMPTY }])

  const openCreate = () => {
    setHead({ id_cliente: '', id_empleado: '', metodo_pago: '' })
    setHeadErrors({})
    setItems([{ ...ITEM_EMPTY }])
    setSubmitError(null)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setSubmitError(null)
  }

  const handleHeadChange = (e) => {
    const { name, value } = e.target
    setHead(prev => ({ ...prev, [name]: value }))
    if (headErrors[name]) setHeadErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }

      // Autocompletar precio al seleccionar variante
      if (field === 'id_variante' && value) {
        const variante = variantes?.find(v => v.id_variante === parseInt(value))
        if (variante) next[index].precio_unitario = variante.precio_actual
      }

      return next
    })
  }

  const addItem    = () => setItems(prev => [...prev, { ...ITEM_EMPTY }])
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const totalVenta = items.reduce((acc, item) => {
    const cant  = parseFloat(item.cantidad)      || 0
    const precio= parseFloat(item.precio_unitario)|| 0
    return acc + cant * precio
  }, 0)

  const validate = () => {
    const errs = {}
    if (!head.id_cliente)  errs.id_cliente  = 'Requerido'
    if (!head.id_empleado) errs.id_empleado = 'Requerido'
    if (!head.metodo_pago) errs.metodo_pago = 'Requerido'
    setHeadErrors(errs)
    if (Object.keys(errs).length > 0) return false

    for (const item of items) {
      if (!item.id_variante || !item.cantidad || !item.precio_unitario) {
        setSubmitError('Completa todos los campos de cada producto')
        return false
      }
      if (parseInt(item.cantidad) <= 0) {
        setSubmitError('La cantidad debe ser mayor a 0')
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      setSubmitting(true)
      setSubmitError(null)
      await createVenta({
        id_cliente:  parseInt(head.id_cliente),
        id_empleado: parseInt(head.id_empleado),
        metodo_pago: head.metodo_pago,
        items: items.map(item => ({
          id_variante:     parseInt(item.id_variante),
          cantidad:        parseInt(item.cantidad),
          precio_unitario: parseFloat(item.precio_unitario)
        }))
      })
      handleClose()
      reload()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingV || loadingC || loadingE || loadingVar) return <Spinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="page">
      <PageHeader
        title="Ventas"
        subtitle={`${ventas?.length ?? 0} ventas registradas`}
        action={<Button onClick={openCreate}>+ Nueva venta</Button>}
      />

      <Table
        columns={COLUMNS}
        data={ventas}
        emptyMessage="No hay ventas registradas"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Nueva venta"
      >
        <div className="form">
          <ErrorMessage message={submitError} />

          {/* Cabecera */}
          <div className="form-row">
            <FormField label="Cliente" error={headErrors.id_cliente}>
              <select name="id_cliente" value={head.id_cliente} onChange={handleHeadChange}>
                <option value="">Seleccionar...</option>
                {clientes?.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Empleado" error={headErrors.id_empleado}>
              <select name="id_empleado" value={head.id_empleado} onChange={handleHeadChange}>
                <option value="">Seleccionar...</option>
                {empleados?.map(e => (
                  <option key={e.id_empleado} value={e.id_empleado}>{e.nombre}</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Método de pago" error={headErrors.metodo_pago}>
            <select name="metodo_pago" value={head.metodo_pago} onChange={handleHeadChange}>
              <option value="">Seleccionar...</option>
              {METODOS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </FormField>

          {/* Items */}
          <div className="venta-items-header">
            <span className="form-label">Productos</span>
            <button className="venta-add-btn" onClick={addItem}>+ Agregar</button>
          </div>

          <div className="venta-items">
            {items.map((item, i) => (
              <div key={i} className="venta-item">
                <div className="venta-item-select">
                  <select
                    value={item.id_variante}
                    onChange={e => handleItemChange(i, 'id_variante', e.target.value)}
                  >
                    <option value="">Seleccionar variante...</option>
                    {variantes?.map(v => (
                      <option key={v.id_variante} value={v.id_variante}>
                        {v.producto} — T:{v.talla} {v.color} (Stock: {v.stock_total})
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  className="venta-item-qty"
                  type="number" min="1"
                  placeholder="Cant."
                  value={item.cantidad}
                  onChange={e => handleItemChange(i, 'cantidad', e.target.value)}
                />

                <input
                  className="venta-item-price"
                  type="number" min="0" step="0.01"
                  placeholder="Precio"
                  value={item.precio_unitario}
                  onChange={e => handleItemChange(i, 'precio_unitario', e.target.value)}
                />

                <span className="venta-item-sub">
                  {formatCurrency((item.cantidad || 0) * (item.precio_unitario || 0))}
                </span>

                {items.length > 1 && (
                  <button className="venta-item-remove" onClick={() => removeItem(i)}>✕</button>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="venta-total">
            <span className="venta-total-label">Total</span>
            <span className="venta-total-value">{formatCurrency(totalVenta)}</span>
          </div>

          <div className="form-actions">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Registrando...' : 'Registrar venta'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}