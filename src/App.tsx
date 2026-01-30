import { createRoutesFromElements, createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import Home from './components/Home'
import SongDetail from './components/SongDetail'
import Layout from './components/Layout'

function App() {

  const routes = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Home />} />
      <Route path='/cantico/:id' element={<SongDetail />} />
    </Route>
  ))
  return (
    <RouterProvider router={routes}/>
  )
}

export default App
