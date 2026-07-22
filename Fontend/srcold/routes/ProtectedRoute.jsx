/* ============================================
   SKILL-BRIDGE — ProtectedRoute
   Login නැතිනම් /login ට redirect කරනවා
   ============================================ */

import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loader from '../components/common/Loader'
import { ROUTES } from '../utils/constants'

/*
  Usage (AppRoutes.jsx ඇතුළේ):
  ─────────────────────────────────────────────
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/my-projects" element={<MyProjects />} />
  </Route>
*/

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Auth state load වෙනකල් wait කරනවා
  if (loading) {
    return <Loader fullPage text="Loading..." />
  }

  // Login නැතිනම් — login page ට යවනවා
  // current location save කරනවා — login වුනාම ආපහු එන්ට
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute