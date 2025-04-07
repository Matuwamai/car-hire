import { StrictMode, useContext } from 'react'
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
import BookPage from './pages/CreateBooking'
import CarOwners from './pages/CarOwners'
import BookingsPage from './pages/Bookings'
import SingleBookingPage from './pages/BookingDetails'
import OwnerCarsPage from './pages/CarOwnerCars'
import CarOwnerPage from './pages/SingleCarOwner'
import OrganizationBookings from './pages/OganazitionBookings'
import ProtectedRoute from './components/ProtectedRoutes'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path='/cars' element={<Cars />} />
              <Route path='/categories' element={<Categories />} />
              <Route path='/category/:id' element={<CategoryDetail />} />

              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path='/users' element={<Users />} />
                <Route path='/organizations' element={<Organizations />} />
                <Route path='/organizations/:id' element={<OrganizationDetail />} />
                <Route path='/create-Category' element={<CreateCategory />} />
                <Route path='/bookings' element={<BookingsPage />} />
                <Route path="/car-owners" element={<CarOwners />} />
                <Route path="/carowners/:id" element={<CarOwnerPage />} />
                <Route path="/book/:carId" element={<BookPage />} />
                <Route path='/booking/:id' element={<SingleBookingPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["CAR_OWNER"]} />}>
                <Route path='/create-car' element={<CreateCar />} />
                <Route path='/my-cars' element={<OwnerCarsPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["ORGANIZATION"]} />}>
                <Route path="/myBookings" element={<OrganizationBookings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode >,
)
