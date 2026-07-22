/* ============================================
   SKILL-BRIDGE — AdminLayout
   Sidebar + main content area
   ============================================ */

import { Outlet } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import ScrollToTop from '../components/common/ScrollToTop'
import '../styles/components/adminlayout.css'

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <ScrollToTop />
      <Sidebar />
      <div className="admin-layout__content">
        <main className="admin-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout