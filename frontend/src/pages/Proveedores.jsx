import { useState }     from 'react'
import useFetch         from '../hooks/useFetch'
import useForm          from '../hooks/useForm'
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor
} from '../api/proveedores.api'
import PageHeader   from '../components/PageHeader'
import Button       from '../components/Button'
import Table        from '../components/Table'
import Modal        from '../components/Modal'
import FormField    from '../components/FormField'
import ErrorMessage from '../components/ErrorMessage'
import Spinner      from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { can, denyPermission } from '../utils/permissions'
import './Page.css'

const EMPTY = { nombre: '', telefono: '', email: '' }

const COLUMNS = [
  { key: 'id_proveedor', label: 'ID' },
  { key: 'nombre',       label: 'Nombre' },
  { key: 'telefono',     label: 'Teléfono' },
  { key: 'email',        label: 'Email' },
]

export default function Proveedores() {
  const { usuario } = useAuth()
  const { data: proveedores, loading, error, reload } = useFetch(getProveedores)

  const [modalOpen,   setModalOpen]   = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submitting,  setSubmitting]  = useState(false)

  const { values, errors, handleChange, reset, validate } = useForm(EMPTY)

  const guard = (action, fn) => (...args) => {
    if (!can(usuario?.rol, 'proveedores', action)) {
      denyPermission()
      return
    }
    fn(...args)
  }

  const openCreate = () => {
    setEditTarget(null)
    reset(EMPTY)
    setSubmitError(null)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditTarget(row)
    reset({ nombre: row.nombre, telefono: row.telefono || '', email: row.email || '' })
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
      nombre: (v) => !v?.trim() ? 'El nombre es requerido' : null
    })
    if (!isValid) return

    try {
      setSubmitting(true)
      setSubmitError(null)
      if (editTarget) {
        await updateProveedor(editTarget.id_proveedor, values)
      } else {
        await createProveedor(values)
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
    if (!confirm(`¿Eliminar el proveedor "${row.nombre}"?`)) return
    try {
      await deleteProveedor(row.id_proveedor)
      reload()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMessage message={error} />

  return (
    <div className="page">
      <PageHeader
        title="Proveedores"
        subtitle={`${proveedores?.length ?? 0} proveedores registrados`}
        action={<Button onClick={guard('create', openCreate)}>+ Nuevo proveedor</Button>}
      />

      <Table
        columns={COLUMNS}
        data={proveedores}
        onEdit={guard('update', openEdit)}
        onDelete={guard('delete', handleDelete)}
        emptyMessage="No hay proveedores registrados"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editTarget ? 'Editar proveedor' : 'Nuevo proveedor'}
      >
        <div className="form">
          <ErrorMessage message={submitError} />

          <FormField label="Nombre" error={errors.nombre}>
            <input
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              placeholder="Ej. Nike Distribution GT"
            />
          </FormField>

          <FormField label="Teléfono">
            <input
              name="telefono"
              value={values.telefono}
              onChange={handleChange}
              placeholder="Ej. 22001001"
            />
          </FormField>

          <FormField label="Email">
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Ej. ventas@proveedor.com"
            />
          </FormField>

          <div className="form-actions">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear proveedor'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
