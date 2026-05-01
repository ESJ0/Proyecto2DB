import { useState }  from 'react'
import useFetch      from '../hooks/useFetch'
import useForm       from '../hooks/useForm'
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from '../api/clientes.api'
import PageHeader   from '../components/PageHeader'
import Button       from '../components/Button'
import Table        from '../components/Table'
import Modal        from '../components/Modal'
import FormField    from '../components/FormField'
import ErrorMessage from '../components/ErrorMessage'
import Spinner      from '../components/Spinner'
import './Page.css'

const EMPTY = { nombre: '', telefono: '', email: '' }

const COLUMNS = [
  { key: 'id_cliente', label: 'ID' },
  { key: 'nombre',     label: 'Nombre' },
  { key: 'telefono',   label: 'Teléfono' },
  { key: 'email',      label: 'Email' },
]

export default function Clientes() {
  const { data: clientes, loading, error, reload } = useFetch(getClientes)

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
      nombre: (v) => !v?.trim() ? 'El nombre es requerido' : null,
      email:  (v) => v && !v.includes('@') ? 'Email inválido' : null
    })
    if (!isValid) return

    try {
      setSubmitting(true)
      setSubmitError(null)
      if (editTarget) {
        await updateCliente(editTarget.id_cliente, values)
      } else {
        await createCliente(values)
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
    if (!confirm(`¿Eliminar al cliente "${row.nombre}"?`)) return
    try {
      await deleteCliente(row.id_cliente)
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
        title="Clientes"
        subtitle={`${clientes?.length ?? 0} clientes registrados`}
        action={<Button onClick={openCreate}>+ Nuevo cliente</Button>}
      />

      <Table
        columns={COLUMNS}
        data={clientes}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No hay clientes registrados"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editTarget ? 'Editar cliente' : 'Nuevo cliente'}
      >
        <div className="form">
          <ErrorMessage message={submitError} />

          <FormField label="Nombre" error={errors.nombre}>
            <input
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              placeholder="Ej. Pedro Alvarado"
            />
          </FormField>

          <FormField label="Teléfono">
            <input
              name="telefono"
              value={values.telefono}
              onChange={handleChange}
              placeholder="Ej. 44441001"
            />
          </FormField>

          <FormField label="Email" error={errors.email}>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Ej. pedro@gmail.com"
            />
          </FormField>

          <div className="form-actions">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear cliente'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}