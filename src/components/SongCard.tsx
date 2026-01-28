import React from 'react'

const Voices = {
    oneVoice: 1,
    twoVoices: 2,
    threeVoices: 3,
    fourVoices: 4
} as const

type VoicesType = typeof Voices[keyof typeof Voices]

interface SongProps {
    title: string;
    composer: string;
    category: string;
    voices: VoicesType;
}

const SongCard: React.FC<SongProps> = ({ title, composer, category, voices }) => {
    return (
        <div className='flex w-full bg-white text-sm justify-normal items-center px-3 py-2 gap-4 rounded-2xl shadow-sm'>
            <div className='bg-[#f5f1e8] p-3 rounded-xl'></div>
            <div className='flex flex-col'>
                <h3 className='font-bold text-[#5c4d37]'>{title} - {composer}</h3>
                <div className="flex text-xs text-stone-400 gap-2">
                    <span className='bg-[#f5f1e8] px-2 py-1 rounded-md'>{category}</span>
                    <span className='bg-stone-100 tracking-wider px-2 py-1 rounded-md'>{voices} {voices == 1 ? 'voice' : 'voices'}</span>
                </div>
            </div>

        </div>
    )
}

export default SongCard