import { useState }  from 'react'
import useFetch      from '../hooks/useFetch'
import useForm       from '../hooks/useForm'
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from '../api/productos.api'
import { getCategorias } from '../api/categorias.api'
import { getProveedores } from '../api/proveedores.api'
import PageHeader   from '../components/PageHeader'
import Button       from '../components/Button'
import Table        from '../components/Table'
import Modal        from '../components/Modal'
import FormField    from '../components/FormField'
import ErrorMessage from '../components/ErrorMessage'
import Spinner      from '../components/Spinner'
import { formatCurrency } from '../utils/formatters'
import './Page.css'

const EMPTY = {
  id_categoria:  '',
  id_proveedor:  '',
  nombre:        '',
  sku:           '',
  marca:         '',
  descripcion:   '',
  genero:        '',
  precio_actual: '',
  imagen:        ''
}

const GENEROS = ['M', 'F', 'Unisex']

const COLUMNS = [
  { key: 'sku',           label: 'SKU' },
  { key: 'nombre',        label: 'Nombre' },
  { key: 'marca',         label: 'Marca' },
  { key: 'categoria',     label: 'Categoría' },
  { key: 'genero',        label: 'Género' },
  {
    key: 'precio_actual',
    label: 'Precio',
    render: (v) => formatCurrency(v)
  },
]

export default function Productos() {
  const { data: productos,  loading: loadingP, error: errorP, reload } = useFetch(getProductos)
  const { data: categorias, loading: loadingC } = useFetch(getCategorias)
  const { data: proveedores,loading: loadingPr } = useFetch(getProveedores)

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
      id_categoria:  row.id_categoria  || '',
      id_proveedor:  row.id_proveedor  || '',
      nombre:        row.nombre        || '',
      sku:           row.sku           || '',
      marca:         row.marca         || '',
      descripcion:   row.descripcion   || '',
      genero:        row.genero        || '',
      precio_actual: row.precio_actual || '',
      imagen:        row.imagen        || ''
    })
    setSubmitError(null)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
    setSubmitError(null)
  }

  const handleSubmit = async () => {
    const isValid = validate({
      nombre:        (v) => !v?.trim() ? 'El nombre es requerido'    : null,
      sku:           (v) => !v?.trim() ? 'El SKU es requerido'       : null,
      marca:         (v) => !v?.trim() ? 'La marca es requerida'     : null,
      descripcion:   (v) => !v?.trim() ? 'La descripción es requerida': null,
      genero:        (v) => !v         ? 'El género es requerido'    : null,
      precio_actual: (v) => !v || isNaN(v) || v <= 0
                              ? 'El precio debe ser mayor a 0'       : null,
      id_categoria:  (v) => !v         ? 'La categoría es requerida' : null,
      id_proveedor:  (v) => !v         ? 'El proveedor es requerido' : null,
      imagen:        (v) => !v?.trim() ? 'La imagen es requerida'    : null,
    })
    if (!isValid) return

    try {
      setSubmitting(true)
      setSubmitError(null)
      const payload = {
        ...values,
        precio_actual: parseFloat(values.precio_actual),
        id_categoria:  parseInt(values.id_categoria),
        id_proveedor:  parseInt(values.id_proveedor)
      }
      if (editTarget) {
        await updateProducto(editTarget.id_producto, payload)
      } else {
        await createProducto(payload)
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
    if (!confirm(`¿Eliminar el producto "${row.nombre}"?`)) return
    try {
      await deleteProducto(row.id_producto)
      reload()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loadingP || loadingC || loadingPr) return <Spinner />
  if (errorP) return <ErrorMessage message={errorP} />

  return (
    <div className="page">
      <PageHeader
        title="Productos"
        subtitle={`${productos?.length ?? 0} productos registrados`}
        action={<Button onClick={openCreate}>+ Nuevo producto</Button>}
      />

      <Table
        columns={COLUMNS}
        data={productos}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No hay productos registrados"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editTarget ? 'Editar producto' : 'Nuevo producto'}
      >
        <div className="form">
          <ErrorMessage message={submitError} />

          <div className="form-row">
            <FormField label="Nombre" error={errors.nombre}>
              <input
                name="nombre"
                value={values.nombre}
                onChange={handleChange}
                placeholder="Ej. Air Max 90"
              />
            </FormField>

            <FormField label="SKU" error={errors.sku}>
              <input
                name="sku"
                value={values.sku}
                onChange={handleChange}
                placeholder="Ej. NIK-AM90"
              />
            </FormField>
          </div>

          <div className="form-row">
            <FormField label="Marca" error={errors.marca}>
              <input
                name="marca"
                value={values.marca}
                onChange={handleChange}
                placeholder="Ej. Nike"
              />
            </FormField>

            <FormField label="Género" error={errors.genero}>
              <select name="genero" value={values.genero} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                {GENEROS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="form-row">
            <FormField label="Categoría" error={errors.id_categoria}>
              <select name="id_categoria" value={values.id_categoria} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                {categorias?.map(c => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Proveedor" error={errors.id_proveedor}>
              <select name="id_proveedor" value={values.id_proveedor} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                {proveedores?.map(p => (
                  <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Descripción" error={errors.descripcion}>
            <textarea
              name="descripcion"
              value={values.descripcion}
              onChange={handleChange}
              rows={2}
              placeholder="Descripción del producto..."
            />
          </FormField>

          <div className="form-row">
            <FormField label="Precio (GTQ)" error={errors.precio_actual}>
              <input
                name="precio_actual"
                type="number"
                min="0"
                step="0.01"
                value={values.precio_actual}
                onChange={handleChange}
                placeholder="0.00"
              />
            </FormField>

            <FormField label="Imagen (nombre archivo)" error={errors.imagen}>
              <input
                name="imagen"
                value={values.imagen}
                onChange={handleChange}
                placeholder="Ej. nike_airmax90.jpg"
              />
            </FormField>
          </div>

          <div className="form-actions">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}