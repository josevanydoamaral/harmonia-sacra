import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Home  from './Home';

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <>
      {isHome ? <Home /> :
        <div className='bg-base-surface'>
          <Header />

          <Outlet />
        </div>
      }


    </>
  )
}

export default Layout