import { BrowserRouter } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import { ToastProvider } from './hooks/useToast.jsx'
import useToast          from './hooks/useToast.jsx'
import AppRoutes         from './routes/AppRoutes'
import ErrorBoundary     from './components/common/ErrorBoundary'
import ScrollToTop       from './components/common/ScrollToTop'
import ToastContainer    from './components/common/Toast'

// Toast state එක App.jsx එකටම කෙලින්ම access කරන්න බෑ (Provider ඇතුලෙන් විතරයි),
// ඉතින් Provider ඇතුලෙන්ම මේ small component එකෙන් render කරනවා
const ToastRenderer = () => {
  const { toasts, removeToast } = useToast()
  return <ToastContainer toasts={toasts} onRemove={removeToast} />
}

const App = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <ToastRenderer />
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  </BrowserRouter>
)

export default App