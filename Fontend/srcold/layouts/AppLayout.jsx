/* ============================================
   SKILL-BRIDGE — AppLayout
   Public pages + Student pages
   Navbar + main content + Footer
   ============================================ */

import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ScrollToTop from '../components/common/ScrollToTop'
import '../styles/components/applayout.css'

const AppLayout = () => {
  return (
    <div className="app-layout">
      <ScrollToTop />
      <Navbar />
      <main className="app-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppLayout