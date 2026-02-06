import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import Home from './components/Home'
import SongDetail from './components/SongDetail'
import Layout from './components/Layout'
import AdminSongRow from './components/admin/AdminSongRow'

function App() {
  return (
    <AdminSongRow />
  )
}

export default App
