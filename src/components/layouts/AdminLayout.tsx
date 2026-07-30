import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle'

const AdminLayout = () => {
    return (
        <main className='bg-base-surface py-8 px-4 mx-auto w-full min-h-screen'>
            <header className='flex justify-between items-center mb-8'>
                <div>
                    
                        <h1 className='text-2xl md:text-3xl font-bold tracking-bold font-title text-accent-gold'><Link to='/'>Harmonia Sacra </Link></h1>
                   
                    <p className='text-text-main/60 text-sm mt-0.5'>Painel Administrativo</p>
                </div>
                <div className='flex items-center gap-3'>
                    <ThemeToggle />
                    <span className='text-text-main/60'>Josevany Amaral</span>
                    <div className='w-10 h-10 rounded-full bg-card-surface border border-border-subtle flex items-center justify-center font-semibold text-sm text-text-main'>JS</div>
                </div>
            </header>
            <Outlet />
        </main>
    )
}

export default AdminLayout