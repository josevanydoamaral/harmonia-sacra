import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import SongDetail from './components/SongDetail'
import Layout from './components/Layout'
import AdminSongRow from './components/admin/AdminSongRow'
import AdminDashboard from './components/admin/AdminDashboard'
import SongForm from './components/admin/SongForm'
import Login from './pages/login'


function App() {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index path='/' element={<Home />} />
      <Route path='/cantico/:id' element={<SongDetail />} />
      <Route path='/login' element={<Login />} />
    </Route>
  )
  
  const router = createBrowserRouter(routes);

  return (
    <RouterProvider router={router} />
  )
}

export default App
