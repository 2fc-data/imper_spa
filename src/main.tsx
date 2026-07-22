import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { initDarkMode } from './hooks/useDarkMode'
import App from './App.tsx'

initDarkMode()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
