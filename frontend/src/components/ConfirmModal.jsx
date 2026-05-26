import { useEffect } from 'react'
import './ConfirmModal.css'

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Eliminar registro?',
  message = 'Esta acción no se puede deshacer.',
  confirmLabel = 'Eliminar',
}) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter') onConfirm()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose, onConfirm])

  if (!isOpen) return null

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-modal" onClick={e => e.stopPropagation()}>

        <div className="cm-icon-wrap">
          <div className="cm-icon-ring">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>
        </div>

        <h3 className="cm-title">{title}</h3>
        <p className="cm-message">{message}</p>

        <div className="cm-actions">
          <button className="cm-btn cm-btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="cm-btn cm-btn--confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  )
}