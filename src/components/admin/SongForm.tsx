import React, { useState } from 'react'

const SongForm = () => {
    const handleAudioChange = (voice: string, value: string) => {
        setFormData(prev => ({
            ...prev, // Mantém o título, compositor, etc.
            audioUrls: {
                ...prev.audioUrls,
                [voice]: value // Atualiza apenas o que mudou
            }
        }))
    }
    const [formData, setFormData] = useState({
        title: '',
        composer: '',
        category: 'Comum',
        voices: 4,
        audioUrls: {
            soprano: '',
            alto: '',
            tenor: '',
            bass: ''
        }
    })
    return (
        <div>
            <h2>Registar Novo Cântico</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className="space-y-1">
                    <label className='block text-xs font-bold uppercase tracking-wider text-track-text/60 mb-2'>Título do Cântico</label>
                    <input className='w-full bg-base-surface border border-track-border rounded-md px-4 py-2 focus:border-accent-gold outline-none transition-all' type="text" placeholder='Ex: Glória in Excelsis Deo' />

                    <label className='block text-xs font-bold uppercase tracking-wider text-track-text/60 mb-2'>Compositor</label>

                    <input className='w-full bg-base-surface border border-track-border rounded-md px-4 py-2 focus:border-accent-gold outline-none transition-all' type="text" placeholder='Ex: A. Cartageno' />

                    <div className='flex gap-4'>
                        <div className="flex flex-col w-full">

                            <label className='block text-xs font-bold uppercase tracking-wider text-track-text/60 mb-2'>Categoria</label>

                            <select className='w-full bg-base-surface border border-track-border rounded-md px-4 py-2 focus:border-accent-gold outline-none transition-all' name="" id="">{['advento', 'natal', 'comum', 'quaresma', 'pascoa', 'pentecostes'].map((categoria) => (
                                <option key={categoria}>{categoria.toLocaleUpperCase()}</option>
                            ))}</select>

                        </div>

                        <div className="flex-col w-1/3">
                            <label className='block text-xs font-bold uppercase tracking-wider text-track-text/60 mb-2'>Vozes</label>

                            <select className='w-full bg-base-surface border border-track-border rounded-md px-4 py-2 focus:border-accent-gold outline-none transition-all' name="" id="">
                                {['1', '2', '3', '4'].map((voice) => (
                                    <option value={voice} key={voice}>{voice}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>
                <div className="space-y-1">
                    {['soprano', 'contralto', 'tenor', 'bass'].map((voice) => (
                        <div key={voice}>
                            <label className='block text-xs font-bold uppercase tracking-wider text-track-text/60 mb-2'>{voice}</label>
                            <input
                                className='w-full bg-base-surface border border-track-border rounded-md px-4 py-2 focus:border-accent-gold outline-none transition-all' type="text"
                                placeholder={`URL do áudio ${voice}`}
                                value={(formData.audioUrls as any)[voice]}
                                onChange={(e) => handleAudioChange(voice, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-end gap-6 mt-8'>
                <button className='text-track-text/50 hover:text-track-text transition-colors'>Cancelar</button>
                <button className='bg-[#B38B4D] hover:bg-[#a07a3d] text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all hover:scale-105' type='submit'>Guardar</button>
            </div>
        </div>
    )
}

export default SongForm