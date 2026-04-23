import { AudioLines, Volume2 } from 'lucide-react'
import React from 'react'
import { motion, scale } from 'framer-motion'
import { TrackProps } from '../types/song'

const TrackControl = ({ label, audioUrl} : TrackProps) => {
    return (
        <div className='relative flex justify-center max-w-lg mx-auto  p-3'>
            <div className='flex flex-col w-full p-3 bg-track-surface rounded-md shadow-xl border border-track-border'>
                <h3 className='text-lg text-track-text'>{label}</h3>
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center mt-3">
                    <div className="flex items-center gap-2">
                        <button><Volume2 className='text-track-slider' width={20} /></button>
                        <input className='text-amber-50 accent-track-slider cursor-pointer' style={{ maxWidth: "70px", maxHeight: "5px" }} type="range" name="" id="" />
                    </div>
                    <div className="flex items-center justify-center gap-2 w-full">
                        <AudioLines className='text-track-wave' width='100%' />
                    </div>
                    <div className='flex items-center gap-2'>
                        <motion.button whileHover={{scale: 1.1}}  whileTap={{ scale: 0.9 }} className='bg-track-button text-track-text aspect-square px-2 py-1 rounded-md shadow-md ring-1 ring-accent-gold cursor-pointer'>M</motion.button>
                        <motion.button whileHover={{scale: 1.1}} whileTap={{ scale: 0.9 }} className='bg-track-button text-track-text aspect-square px-2 py-1 rounded-md shadow-md ring-1 ring-accent-gold cursor-pointer'>S</motion.button>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default TrackControl