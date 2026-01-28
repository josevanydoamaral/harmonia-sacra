import React from 'react'

const Header = () => {
  return (
    <header className='flex justify-between items-center p-6'>
        <h1 className='font-serif text-2xl text-[#5c4d37]'>Harmonia Sacra</h1>
        <button className='bg-[#b38b4d] text-white rounded-2xl px-6 py-2 shadow-md'>&hearts; Doe</button>
    </header>
  )
}

export default Header