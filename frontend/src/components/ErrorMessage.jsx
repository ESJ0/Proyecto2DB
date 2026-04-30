import './ErrorMessage.css'

export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="error-message">
      <span className="error-message-icon">!</span>
      {message}
    </div>
  )
}