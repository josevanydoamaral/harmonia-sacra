import React, { useState } from 'react';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { Play, Pause } from 'lucide-react';

const TEST_TRACKS = {
    soprano: "/audio/soprano.m4a",
    tenor: "/audio/tenor.m4a"
};

const AudioTestPage = () => {
    const { 
        isPlaying, elapsedTime, isLoaded, 
        pause, play, seek, setMuted, setSolo, duration 
    } = useAudioEngine(TEST_TRACKS);

    const [sopranoMuted, setSopranoMuted] = useState(false);
    const [tenorMuted, setTenorMuted] = useState(false);
    const [activeSolo, setActiveSolo] = useState<string | null>(null);

    const handleTogglePlay = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    const handleToggleMute = (voice: 'soprano' | 'tenor') => {
        if (voice === 'soprano') {
            const nextState = !sopranoMuted;
            setSopranoMuted(nextState);
            setMuted('soprano', nextState);
        } else {
            const nextState = !tenorMuted;
            setTenorMuted(nextState);
            setMuted('tenor', nextState);
        }
    };

    const handleToggleSolo = (voice: 'soprano' | 'tenor') => {
        const nextSolo = activeSolo === voice ? null : voice;
        setActiveSolo(nextSolo);
        setSolo(nextSolo);
    };

    return (
        <div className='bg-base-surface h-screen text-text-main flex flex-col items-center justify-center gap-6 p-6'>
            <span className='text-sm text-gray-400'>
                Status: {isLoaded ? "Áudio Pronto" : "Carregando áudio..."}
            </span>

            <div className='flex items-center gap-4'>
                <button 
                    disabled={!isLoaded}
                    onClick={handleTogglePlay}
                    className='bg-accent-gold text-black p-3 rounded-full hover:opacity-90 transition disabled:opacity-50 cursor-pointer'
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <input 
                    type='range' 
                    min={0} 
                    max={duration || 100} 
                    step={0.1}
                    value={elapsedTime}
                    onChange={(e) => seek(Number(e.target.value))}
                    className='w-64 cursor-pointer'
                />

                <p className='font-mono'>{elapsedTime.toFixed(1)}s</p>
            </div>

            <div className='flex gap-8'>
                <div className='flex flex-col items-center gap-2'>
                    <span className='font-bold uppercase tracking-wide'>soprano</span>
                    <div className='flex gap-2'>
                        <button 
                            onClick={() => handleToggleMute('soprano')}
                            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer ${
                                sopranoMuted ? 'bg-red-500 text-white' : 'bg-accent-gold text-black'
                            }`}
                        >
                            {sopranoMuted ? 'Unmute' : 'Mute'}
                        </button>
                        <button 
                            onClick={() => handleToggleSolo('soprano')}
                            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer ${
                                activeSolo === 'soprano' ? 'bg-blue-500 text-white' : 'bg-accent-gold text-black'
                            }`}
                        >
                            Solo
                        </button>
                    </div>
                </div>

                <div className='flex flex-col items-center gap-2'>
                    <span className='font-bold uppercase tracking-wide'>tenor</span>
                    <div className='flex gap-2'>
                        <button 
                            onClick={() => handleToggleMute('tenor')}
                            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer ${
                                tenorMuted ? 'bg-red-500 text-white' : 'bg-accent-gold text-black'
                            }`}
                        >
                            {tenorMuted ? 'Unmute' : 'Mute'}
                        </button>
                        <button 
                            onClick={() => handleToggleSolo('tenor')}
                            className={`px-4 py-2 rounded-xl font-semibold transition cursor-pointer ${
                                activeSolo === 'tenor' ? 'bg-blue-500 text-white' : 'bg-accent-gold text-black'
                            }`}
                        >
                            Solo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioTestPage;