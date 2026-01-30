import React from 'react'
import { motion } from 'framer-motion';
import type { Song } from '../types/song';


const SongCard: React.FC<Song> = ({ id, title, composer, category, voices }) => {
    return (
        <motion.div layout className='flex w-full bg-card-surface text-sm justify-normal items-center px-3 py-2 gap-4 rounded-2xl ring-1 ring-border-subtle shadow-sm hover:cursor-pointer transition-shadow'>
            <div className='bg-tag-surface p-3 rounded-xl'></div>
            <div className='flex flex-col'>
                <h3 className='font-bold text-card-text'>{title} - {composer}</h3>
                <div className="flex text-xs text-stone-400 gap-2 mt-2">
                    <span className='bg-tag-surface px-2 py-1 rounded-md'>{category}</span>
                    <span className='bg-tag-surface tracking-wider px-2 py-1 rounded-md'>{voices} {voices == 1 ? 'voice' : 'voices'}</span>
                </div>
            </div>

        </motion.div>
    )
}

export default SongCard