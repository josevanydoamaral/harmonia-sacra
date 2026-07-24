import React from 'react'
import ThemeToggle from './ThemeToggle'
import { motion, scale } from 'framer-motion'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='flex justify-between items-center p-6 bg-white/93 dark:bg-base-surface/93 shadow-2xl'>
        <Link to='/' className='hover:opacity-80 transition-opacity'>
          <h1 className='font-title text-2xl text-accent-gold '>Harmonia Sacra</h1>
        </Link>
        <div className='flex items-center justify-end gap-6'>
          <motion.button whileTap={{scale: 0.98}} whileHover={{scale: 1.02}} className='bg-button-surface hover:bg-hover-button text-white rounded-2xl px-6 py-2 shadow-md cursor-pointer transition-all duration-300'>&hearts; Doe</motion.button>
          <ThemeToggle />
        </div>
    </header>
  )
}

export default Header