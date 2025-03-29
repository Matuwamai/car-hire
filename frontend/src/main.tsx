import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './components/Layout'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <Router>
  <Routes>
    <Route element={<Layout />}>
    </Route>
  </Routes>
 </Router>
  </StrictMode>,
)
