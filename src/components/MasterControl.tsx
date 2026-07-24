import React from 'react'
import { Play, Pause } from 'lucide-react'
import { formatTime } from '../utils/utils';

// Interface with master control play and pause function
interface MasterControlProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void
  onToggle: () => void;
}

const MasterControl = ({ isPlaying, currentTime, duration, onSeek, onToggle }: MasterControlProps) => {
    return (
        <div className='flex items-center gap-6 p-4 bg-track-surface rounded-xl border border-accent-gold/20 shadow-lg'>
            <button className='text-accent-gold hover:scale-110 transition-transform cursor-pointer' onClick={onToggle}>
                {!isPlaying ? (
                    <Play fill="currentColor" size={32} />
                ) : (
                    <Pause fill="currentColor" size={32}/>
                )}   
            </button>

            <div className='flex-1 flex flex-col gap-3'>
                <input
                    type="range"
                    className='w-full h-1.5 bg-accent-gold/10 rounded-lg appearance-none cursor-pointer accent-accent-gold'
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => onSeek(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-accent-gold/40 font-bold">
                    <span>Início</span>
                    <span>Progresso do Cântico</span>
                    <span>Fim</span>
                </div>
            </div>


            <div className='text-right'>
                <span className=' block text-xs font-mono text-accent-gold/70'>
                    {formatTime(currentTime)} / 
                    {formatTime(duration)}
                </span>
            </div>
        </div>
    )
}

export default MasterControl