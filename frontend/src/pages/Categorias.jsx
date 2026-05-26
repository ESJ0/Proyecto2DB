import { useState }     from 'react'
import useFetch         from '../hooks/useFetch'
import useForm          from '../hooks/useForm'
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../api/categorias.api'
import PageHeader    from '../components/PageHeader'
import Button        from '../components/Button'
import Table         from '../components/Table'
import Modal         from '../components/Modal'
import ConfirmModal  from '../components/ConfirmModal'
import FormField     from '../components/FormField'
import ErrorMessage  from '../components/ErrorMessage'
import Spinner       from '../components/Spinner'
import { useAuth }   from '../context/AuthContext'
import { can, denyPermission } from '../utils/permissions'
import './Page.css'

const EMPTY = { nombre: '', descripcion: '' }

const COLUMNS = [
  { key: 'id_categoria', label: 'ID' },
  { key: 'nombre',       label: 'Nombre' },
  { key: 'descripcion',  label: 'Descripción' },
]

export default function Categorias() {
  const { usuario } = useAuth()
  const { data: categorias, loading, error, reload } = useFetch(getCategorias)

  const [modalOpen,    setModalOpen]    = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [submitError,  setSubmitError]  = useState(null)
  const [submitting,   setSubmitting]   = useState(false)

  // Estado para el modal de confirmación
  const [confirmOpen,  setConfirmOpen]  = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { values, errors, handleChange, reset, validate } = useForm(EMPTY)

  const guard = (action, fn) => (...args) => {
    if (!can(usuario?.rol, 'categorias', action)) {
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
    reset({ nombre: row.nombre, descripcion: row.descripcion || '' })
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
        await updateCategoria(editTarget.id_categoria, values)
      } else {
        await createCategoria(values)
      }
      handleClose()
      reload()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (row) => {
    setDeleteTarget(row)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    setConfirmOpen(false)
    try {
      await deleteCategoria(deleteTarget.id_categoria)
      reload()
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleteTarget(null)
    }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMessage message={error} />

  return (
    <div className="page">
      <PageHeader
        title="Categorías"
        subtitle={`${categorias?.length ?? 0} categorías registradas`}
        action={<Button onClick={guard('create', openCreate)}>+ Nueva categoría</Button>}
      />

      <Table
        columns={COLUMNS}
        data={categorias}
        onEdit={guard('update', openEdit)}
        onDelete={guard('delete', handleDelete)}
        emptyMessage="No hay categorías registradas"
      />

      {/* Modal crear / editar */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editTarget ? 'Editar categoría' : 'Nueva categoría'}
      >
        <div className="form">
          <ErrorMessage message={submitError} />

          <FormField label="Nombre" error={errors.nombre}>
            <input
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              placeholder="Ej. Zapatillas Deportivas"
            />
          </FormField>

          <FormField label="Descripción">
            <textarea
              name="descripcion"
              value={values.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción opcional..."
            />
          </FormField>

          <div className="form-actions">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteTarget(null) }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar categoría?"
        message={`La categoría "${deleteTarget?.nombre}" será eliminada permanentemente.`}
        confirmLabel="Eliminar categoría"
      />
    </div>
  )
}