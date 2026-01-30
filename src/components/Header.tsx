import React from 'react'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  return (
    <header className='flex justify-between items-center p-6 bg-white/93 dark:bg-base-surface/93 shadow-2xl'>
        <h1 className='font-title text-2xl text-accent-gold '>Harmonia Sacra</h1>
        <ThemeToggle />
        <button className='bg-button-surface hover:bg-hover-button text-white rounded-2xl px-6 py-2 shadow-md cursor-pointer'>&hearts; Doe</button>
    </header>
  )
}

export default Header