import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import SongDetail from './components/SongDetail'
import Layout from './components/Layout'
import AdminSongRow from './components/admin/AdminSongRow'
import AdminDashboard from './components/admin/AdminDashboard'
import SongForm from './components/admin/SongForm'

function App() {
  const routes = createRoutesFromElements(
    <>
      <Route index path='/' element={<Home />} />
      <Route index path='/cantico/:id' element={<SongDetail />} />
    </>
  )
  
  const router = createBrowserRouter(routes);

  return (
    <RouterProvider router={router} />
  )
}

export default App
