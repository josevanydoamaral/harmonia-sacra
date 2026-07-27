import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import SongDetail from './components/SongDetail'
import Layout from './components/Layout'
import AdminSongRow from './components/admin/AdminSongRow'
import AdminDashboard from './components/admin/AdminDashboard'
import SongForm from './components/admin/SongForm'
import Login from './pages/login'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './components/admin/Dashboard'


function App() {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='/cantico/:id' element={<SongDetail />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
      }/>
    </Route>
  )
  
  const router = createBrowserRouter(routes);

  return (
    <RouterProvider router={router} />
  )
}

export default App
