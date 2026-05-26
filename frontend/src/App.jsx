import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import PermissionDeniedModal from './components/PermissionDeniedModal'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <PermissionDeniedModal />
      </AuthProvider>
    </BrowserRouter>
  )
}