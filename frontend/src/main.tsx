import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/authContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import SignupPage from './pages/SignupPage'
import Users from './pages/User'
import Organizations from './pages/Organization'
import OrganizationDetail from './pages/OrganizationDetails'
import Cars from './pages/Cars'
import CreateCar from './pages/CreateCar'
import CreateCategory from './pages/CreateCarCategory'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetails'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <Router>
 <AuthProvider>
  <Routes>
    <Route path="/login" element={<Login />}/>
    <Route path='/signup' element={<SignupPage />} />
    <Route  element={<Layout />}>
    <Route path='/users' element={<Users />}/>
    <Route path='/organizations' element={<Organizations />}/>
    <Route path='/organizations/:id' element={<OrganizationDetail />}/>
    <Route path='/cars' element={<Cars />}/>
    <Route  path='/create-car' element={<CreateCar />}/>
    <Route  path='/create-Category' element={<CreateCategory />}/>
    <Route  path='/categories' element={<Categories />}/>
    <Route  path='/category/:id' element={<CategoryDetail />}/>
    </Route>
  </Routes>
  </AuthProvider>
 </Router>
  </StrictMode>,
)
