import React from 'react'
import { motion } from 'framer-motion';
import type { Song } from '../types/song';


const SongCard: React.FC<Song> = ({ id, title, composer, category, voices }) => {
    return (
        <motion.div layout className='flex w-full bg-white text-sm justify-normal items-center px-3 py-2 gap-4 rounded-2xl ring-1 ring-stone-100 shadow-sm hover:cursor-pointer transition-shadow'>
            <div className='bg-[#f5f1e8] p-3 rounded-xl'></div>
            <div className='flex flex-col'>
                <h3 className='font-bold text-[#5c4d37]'>{title} - {composer}</h3>
                <div className="flex text-xs text-stone-400 gap-2 mt-2">
                    <span className='bg-[#f5f1e8] px-2 py-1 rounded-md'>{category}</span>
                    <span className='bg-stone-100 tracking-wider px-2 py-1 rounded-md'>{voices} {voices == 1 ? 'voice' : 'voices'}</span>
                </div>
            </div>

        </motion.div>
    )
}

export default SongCard