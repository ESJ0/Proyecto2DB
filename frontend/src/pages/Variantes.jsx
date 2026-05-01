import { useState }  from 'react'
import useFetch      from '../hooks/useFetch'
import useForm       from '../hooks/useForm'
import {
  getVariantes,
  createVariante,
  updateVariante,
  deleteVariante
} from '../api/variantes.api'
import { getProductos } from '../api/productos.api'
import PageHeader   from '../components/PageHeader'
import Button       from '../components/Button'
import Table        from '../components/Table'
import Modal        from '../components/Modal'
import FormField    from '../components/FormField'
import ErrorMessage from '../components/ErrorMessage'
import Spinner      from '../components/Spinner'
import './Page.css'

const EMPTY = {
  id_producto: '',
  talla: '', color: '',
  peso: '', alto: '', ancho: '', largo: '',
  stock_total: '0'
}

const COLUMNS = [
  { key: 'producto',    label: 'Producto' },
  { key: 'sku',         label: 'SKU' },
  { key: 'talla',       label: 'Talla' },
  { key: 'color',       label: 'Color' },
  { key: 'stock_total', label: 'Stock',
    render: (v) => (
      <span className={`badge ${v <= 5 ? 'badge--error' : v <= 15 ? 'badge--warning' : 'badge--success'}`}>
        {v}
      </span>
    )
  },
]

export default function Variantes() {
  const { data: variantes, loading: loadingV, error, reload } = useFetch(getVariantes)
  const { data: productos, loading: loadingP } = useFetch(getProductos)

  const [modalOpen,   setModalOpen]   = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submitting,  setSubmitting]  = useState(false)

  const { values, errors, handleChange, reset, validate } = useForm(EMPTY)

  const openCreate = () => {
    setEditTarget(null)
    reset(EMPTY)
    setSubmitError(null)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditTarget(row)
    reset({
      id_producto: row.id_producto || '',
      talla:       row.talla       || '',
      color:       row.color       || '',
      peso:        row.peso        || '',
      alto:        row.alto        || '',
      ancho:       row.ancho       || '',
      largo:       row.largo       || '',
      stock_total: row.stock_total ?? '0'
    })
    setSubmitError(null)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
    setSubmitError(null)
  }

  const numValidator = (label) => (v) =>
    !v || isNaN(v) || parseFloat(v) <= 0 ? `${label} debe ser mayor a 0` : null

  const handleSubmit = async () => {
    const isValid = validate({
      id_producto: (v) => !v      ? 'El producto es requerido'  : null,
      talla:       (v) => !v?.trim() ? 'La talla es requerida'  : null,
      color:       (v) => !v?.trim() ? 'El color es requerido'  : null,
      peso:  numValidator('Peso'),
      alto:  numValidator('Alto'),
      ancho: numValidator('Ancho'),
      largo: numValidator('Largo'),
    })
    if (!isValid) return

    try {
      setSubmitting(true)
      setSubmitError(null)
      const payload = {
        ...values,
        id_producto: parseInt(values.id_producto),
        peso:        parseFloat(values.peso),
        alto:        parseFloat(values.alto),
        ancho:       parseFloat(values.ancho),
        largo:       parseFloat(values.largo),
        stock_total: parseInt(values.stock_total) || 0
      }
      if (editTarget) {
        await updateVariante(editTarget.id_variante, payload)
      } else {
        await createVariante(payload)
      }
      handleClose()
      reload()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (row) => {
    if (!confirm(`¿Eliminar variante ${row.talla} / ${row.color} de "${row.producto}"?`)) return
    try {
      await deleteVariante(row.id_variante)
      reload()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loadingV || loadingP) return <Spinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="page">
      <PageHeader
        title="Variantes"
        subtitle={`${variantes?.length ?? 0} variantes registradas`}
        action={<Button onClick={openCreate}>+ Nueva variante</Button>}
      />

      <Table
        columns={COLUMNS}
        data={variantes}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No hay variantes registradas"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editTarget ? 'Editar variante' : 'Nueva variante'}
      >
        <div className="form">
          <ErrorMessage message={submitError} />

          <FormField label="Producto" error={errors.id_producto}>
            <select name="id_producto" value={values.id_producto} onChange={handleChange}>
              <option value="">Seleccionar producto...</option>
              {productos?.map(p => (
                <option key={p.id_producto} value={p.id_producto}>
                  {p.nombre} — {p.marca}
                </option>
              ))}
            </select>
          </FormField>

          <div className="form-row">
            <FormField label="Talla" error={errors.talla}>
              <input
                name="talla"
                value={values.talla}
                onChange={handleChange}
                placeholder="Ej. 42"
              />
            </FormField>

            <FormField label="Color" error={errors.color}>
              <input
                name="color"
                value={values.color}
                onChange={handleChange}
                placeholder="Ej. Negro/Blanco"
              />
            </FormField>
          </div>

          <div className="form-row">
            <FormField label="Peso (kg)" error={errors.peso}>
              <input name="peso" type="number" step="0.01" min="0"
                value={values.peso} onChange={handleChange} placeholder="0.00" />
            </FormField>

            <FormField label="Stock inicial" >
              <input name="stock_total" type="number" min="0"
                value={values.stock_total} onChange={handleChange} placeholder="0" />
            </FormField>
          </div>

          <div className="form-row form-row--3">
            <FormField label="Alto (cm)" error={errors.alto}>
              <input name="alto" type="number" step="0.1" min="0"
                value={values.alto} onChange={handleChange} placeholder="0.0" />
            </FormField>

            <FormField label="Ancho (cm)" error={errors.ancho}>
              <input name="ancho" type="number" step="0.1" min="0"
                value={values.ancho} onChange={handleChange} placeholder="0.0" />
            </FormField>

            <FormField label="Largo (cm)" error={errors.largo}>
              <input name="largo" type="number" step="0.1" min="0"
                value={values.largo} onChange={handleChange} placeholder="0.0" />
            </FormField>
          </div>

          <div className="form-actions">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear variante'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}