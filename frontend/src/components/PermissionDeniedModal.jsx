import { useEffect, useState } from 'react'
import './PermissionDeniedModal.css'

export default function PermissionDeniedModal() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const handler = () => {
      setClosing(false)
      setVisible(true)
    }
    window.addEventListener('permission-denied', handler)
    return () => window.removeEventListener('permission-denied', handler)
  }, [])

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(handleClose, 4000)
    return () => clearTimeout(t)
  }, [visible])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
    }, 250)
  }

  if (!visible) return null

  return (
    <div className={`pdm-overlay ${closing ? 'pdm-overlay--out' : ''}`}>
      <div className={`pdm-modal ${closing ? 'pdm-modal--out' : ''}`}>
        <div className="pdm-icon-wrap">
          <div className="pdm-icon-ring">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        <div className="pdm-content">
          <p className="pdm-title">Acceso restringido</p>
          <p className="pdm-desc">Tu rol no tiene permiso para realizar esta acción.</p>
        </div>

        <button className="pdm-close" onClick={handleClose} aria-label="Cerrar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="pdm-progress">
          <div className="pdm-progress-bar" />
        </div>
      </div>
    </div>
  )
}