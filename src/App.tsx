import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import Home from './components/Home'
import SongDetail from './components/SongDetail'
import Layout from './components/Layout'
import AdminSongRow from './components/admin/AdminSongRow'
import AdminDashboard from './components/admin/AdminDashboard'
import SongForm from './components/admin/SongForm'

function App() {
  return (
    <SongForm />
  )
}

export default App
