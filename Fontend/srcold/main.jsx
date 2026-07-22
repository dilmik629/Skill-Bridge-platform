import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// ─── Global Styles (import order matters) ───
import './styles/variables.css'
import './styles/global.css'
import './styles/animations.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)