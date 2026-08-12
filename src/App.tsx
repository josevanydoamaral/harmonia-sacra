import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import SongDetail from './components/SongDetail'
import Layout from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './components/admin/Dashboard'
import Login from './pages/Login'
import AdminLayout from './components/layouts/AdminLayout'
import AudioTestPage from './pages/AudioTestPage'
import { GuestRoute } from './components/GuestRoute'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ui/ToastContainer'


function App() {
  const routes = createRoutesFromElements(
    <>
      <Route path='/' element={<Home />} />

      <Route element={<Layout />}>
        <Route path='/cantico/:id' element={<SongDetail />} />

      </Route>

      <Route path='/login' element={
        <GuestRoute>
          <Login />
        </GuestRoute>}
      >
      </Route>

      <Route path='/dashboard' element=
        {
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>

        <Route index element={<Dashboard />} />
      </Route>
    </>



  );

  const router = createBrowserRouter(routes);

  return (
    <ToastProvider>
      <ToastContainer />

      <RouterProvider router={router} />
    </ToastProvider>
  )
}

export default App
