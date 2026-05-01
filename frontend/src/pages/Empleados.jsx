import { useState }  from 'react'
import useFetch      from '../hooks/useFetch'
import useForm       from '../hooks/useForm'
import {
  getEmpleados,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado
} from '../api/empleados.api'
import PageHeader   from '../components/PageHeader'
import Button       from '../components/Button'
import Table        from '../components/Table'
import Modal        from '../components/Modal'
import FormField    from '../components/FormField'
import ErrorMessage from '../components/ErrorMessage'
import Spinner      from '../components/Spinner'
import { formatDate } from '../utils/formatters'
import './Page.css'

const EMPTY = { nombre: '', telefono: '', email: '', fecha_contra: '' }

const COLUMNS = [
  { key: 'id_empleado',  label: 'ID' },
  { key: 'nombre',       label: 'Nombre' },
  { key: 'email',        label: 'Email' },
  { key: 'telefono',     label: 'Teléfono' },
  {
    key: 'fecha_contra',
    label: 'Contratación',
    render: (v) => formatDate(v)
  },
]

export default function Empleados() {
  const { data: empleados, loading, error, reload } = useFetch(getEmpleados)

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
      nombre:       row.nombre,
      telefono:     row.telefono    || '',
      email:        row.email       || '',
      fecha_contra: row.fecha_contra
        ? row.fecha_contra.split('T')[0]
        : ''
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
      nombre:       (v) => !v?.trim() ? 'El nombre es requerido'            : null,
      email:        (v) => !v?.trim() ? 'El email es requerido'             : null,
      fecha_contra: (v) => !v         ? 'La fecha de contrato es requerida' : null,
    })
    if (!isValid) return

    try {
      setSubmitting(true)
      setSubmitError(null)
      if (editTarget) {
        await updateEmpleado(editTarget.id_empleado, values)
      } else {
        await createEmpleado(values)
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
    if (!confirm(`¿Eliminar al empleado "${row.nombre}"?`)) return
    try {
      await deleteEmpleado(row.id_empleado)
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
        title="Empleados"
        subtitle={`${empleados?.length ?? 0} empleados registrados`}
        action={<Button onClick={openCreate}>+ Nuevo empleado</Button>}
      />

      <Table
        columns={COLUMNS}
        data={empleados}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No hay empleados registrados"
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editTarget ? 'Editar empleado' : 'Nuevo empleado'}
      >
        <div className="form">
          <ErrorMessage message={submitError} />

          <FormField label="Nombre" error={errors.nombre}>
            <input
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              placeholder="Ej. Carlos García"
            />
          </FormField>

          <FormField label="Teléfono">
            <input
              name="telefono"
              value={values.telefono}
              onChange={handleChange}
              placeholder="Ej. 55551001"
            />
          </FormField>

          <FormField label="Email" error={errors.email}>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Ej. carlos@zapateria.com"
            />
          </FormField>

          <FormField label="Fecha de contratación" error={errors.fecha_contra}>
            <input
              name="fecha_contra"
              type="date"
              value={values.fecha_contra}
              onChange={handleChange}
            />
          </FormField>

          <div className="form-actions">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear empleado'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}