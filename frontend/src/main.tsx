import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/authContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import SignupPage from './pages/SignupPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <Router>
 <AuthProvider>
  <Routes>
    <Route path="/login" element={<Login />}></Route>
    <Route path='/signup' element={<SignupPage />}></Route>
    <Route path='/dashboard' element={<Layout />}>
    </Route>
  </Routes>
  </AuthProvider>
 </Router>
  </StrictMode>,
)
