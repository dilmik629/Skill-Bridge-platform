/* ============================================
   SKILL-BRIDGE — AdminRoute
   Admin role නැතිනම් block කරනවා
   ============================================ */

import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loader from '../components/common/Loader'
import { ROUTES } from '../utils/constants'

/*
  Usage (AppRoutes.jsx ඇතුළේ):
  ─────────────────────────────────────────────
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/projects" element={<AdminProjects />} />
  </Route>
*/

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <Loader fullPage text="Loading..." />
  }

  // Login නෑ නම් → login ට
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  // Login ඉන්නවා හැබැයි admin නෙමෙයි → dashboard ට
  if (!isAdmin) {
    return <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />
  }

  return children
}

export default AdminRoute