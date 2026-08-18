import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { LanguageProvider } from './context/LanguageContext'
import './styles/main.scss'

document.documentElement.dataset.theme = 'light'
document.documentElement.style.colorScheme = 'light'
window.localStorage.removeItem('tattoo-stories-theme')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)