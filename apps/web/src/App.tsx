import './App.css'
import SignupPage from './pages/SignUpPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateLayout from './layouts/PrivateLayout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import SigninPage from './pages/SigninPage'
import ProfilePage from './pages/ProfilePage'
 import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <>
      <BrowserRouter>
 <ToastContainer />
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/login" element={<SigninPage />} />

          <Route path="auth" element={<PrivateLayout />}>
            <Route index path='dashboard' element={<Dashboard />} />
            <Route path='expenses' element={<Expenses />} />
            <Route path="expenses/:id" element={<Expenses />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
