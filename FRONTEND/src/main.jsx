import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './GlobalProvider/AuthContext.jsx'
import ScrollTop from './Components/ScrollTop.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ScrollTop/>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>

)
