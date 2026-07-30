import React, { useState } from 'react'
import { FileMusic, FileUp, Upload, X } from 'lucide-react';

interface DraftTrack {
    id: string;
    label: string;
    file: File | null;
}

interface SongModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SongModal = ({ isOpen, onClose }: SongModalProps) => {
    const [title, setTitle] = useState('')
    const [composer, setComposer] = useState('')
    const [category, setCategory] = useState('')

    const [pdfFile, setPdfFile] = useState<File | null>(null)

    const [tracks, setTracks] = useState<DraftTrack[]>([{id: "blabla", label: "teste", file: null}]);
    const validTracksCount = tracks.filter(track => track.file !== null).length;

    const handleAddTrack = () => {
        const track = {
            id: crypto.randomUUID(),
            label: '',
            file: null
        }

        setTracks([...tracks, track])
    }

    const handleRemoveTrack = (id: string) => {
        setTracks((items) =>
            items.filter((item) => item.id !== id)
        )
    }

    const handleLabelChange = (id: string, label: string) => {

        setTracks((tracks) =>
            tracks.map((track) => {
                if (track.id === id) {
                    return { ...track, label: label }
                }
                return track
            })
        )
    }

    const handleFileChange = (id: string, file: File | null) => {
        setTracks((tracks) =>
            tracks.map((track) => {
                if (track.id === id) {
                    return { ...track, file: file }
                }
                return track
            })
        )
    }

    if (!isOpen) return null;

    return (
        <div className='flex items-center justify-center fixed inset-0 bg-base-surface/80 backdrop-blur-sm z-50'>

            <div className='max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-base-surface border border-border-subtle rounded-3xl shadow-2xl p-8'>
                <div className="flex items-center justify-between mb-8">
                    <h2 className='text-2xl text-accent-gold font-serif'>Adicionar Cântico</h2>
                    <button onClick={onClose}><X className='text-text-main hover:cursor-pointer hover:text-red-400 transition' width={40} height={40} /></button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="title">Título</label>
                        <input className='w-full bg-card-surface border border-border-subtle rounded-xl text-sm text-card-text/60 px-4 py-3 focus:outline-none focus:border-accent-gold placeholder:text-card-text/50' type="text" placeholder='Ex.: O Cordeiro que foi imolado' onChange={(e) => setTitle(e.target.value)} id='title' />
                    </div>

                    <div>
                        <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="compositor">Compositor</label>
                        <input className='w-full bg-card-surface px-4 py-3 rounded-xl border border-border-subtle text-card-text/60 text-sm focus:outline-none focus:border-accent-gold placeholder:text-card-text/50' type="text" id='compositor' placeholder='A. Cartageno' onChange={(e) => setComposer(e.target.value)} />
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="category">Category</label>
                    <input className='w-full bg-card-surface px-4 py-3 rounded-xl border border-border-subtle placeholder:text-card-text/50 text-card-text/60 text-sm focus:outline-none focus:border-accent-gold' type="text" id='category' placeholder='Páscoa' onChange={(e) => setCategory(e.target.value)} />
                </div>
                <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="pdfUploader">Partitura (PDF)</label>
                <div className='flex items-center justify-between gap-4 mb-4 bg-card-surface p-4 rounded-xl border border-dashed border-border-subtle hover:border-accent-gold transition'>
                    <div className='flex items-center justify-between gap-3'>
                        <FileUp className='text-accent-gold' />
                        <span className='text-card-text/50'>{pdfFile ? pdfFile.name : "Clicar ou arrastar o ficheiro .pdf"}</span>
                    </div>
                    <div className='flex items-center justify-end'>
                        <label className='text-accent-gold font-medium hover:cursor-pointer hover:underline'>{pdfFile ? "Substituir" : "Procurar"}
                            <input
                                type='file'
                                accept='application/pdf'
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                className='hidden'
                            />
                        </label>
                    </div>
                </div>
                <div className="flex items center justify-between mb-3 pt-2">
                    <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="">Faixas de áudio por voz</label>
                    <button className='font-semibold text-sm text-accent-gold border border-accent-gold/50 hover:border-accent-gold cursor-pointer px-4 py-1 rounded-lg transition' onClick={handleAddTrack}>+ Adicionar Voz</button>
                </div>
                <section className='space-y-3 mb-1'>
                    {tracks.length === 0
                        ? <span className='text-md text-card-text/60 mb-1.5 block'>Nenhuma voz adicionada. Clica em "+ Adicionar voz" para começar</span>
                        : tracks.map(track =>
                            <div key={track.id}  className={`flex items-center justify-between gap-4 mb-4  p-4 rounded-xl border  border-border-subtle hover:border-accent-gold transition ${track.file ? 'bg-card-surface' : 'border-dashed'}`}>
                                <div className='flex items-center justify-between gap-3'>
                                <input 
                                    type="text" 
                                    value={track.label}
                                    onChange={(e) => handleLabelChange(track.id, e.target.value)}
                                    placeholder='Nome da voz'
                                    className='w-36 p-1.5 placeholder:text-card-text/50 text-card-text text-md font-medium outline-none shadow-md px-4 rounded-lg border-b border-accent-gold/50' 
                                />
                                {track.file 
                                ? <FileMusic className='text-accent-gold' /> 
                                : <Upload className='text-card-text/50' /> }
                                
                                <label className='text-card-text/50 hover:cursor-pointer'>{track.file ? track.file.name : "Clicar ou arrastar para adicionar ficheiro .mp3"}
                                        <input
                                            type='file'
                                            accept='audio/*'
                                            onChange={(e) => handleFileChange(track.id, e.target.files?.[0] || null)}
                                            className='hidden'
                                        />
                                    </label>
                            </div>
                                <div className='flex items-center justify-end'>
                                    <button onClick={() => handleRemoveTrack(track.id)}>
                                        <X className='text-card-text/50 hover:text-red-400 hover:cursor-pointer transition' />
                                    </button>
                                    
                                </div>

                            </div>
                        )
                    }
                </section>
                <div className='pt-1 text-card-text/50 flex items-center gap-2'>
                    <span>&#128712;</span>
                    <span>{tracks.length} vozes adicionadas - Alinhamento disponível a partir de 2 faixas</span>
                </div>
                <button className=
                {`w-full py-3.5 rounded-xl mt-8 text-lg font-semibold ${validTracksCount < 2 
                ? 'bg-card-surface text-card-text/30 cursor-not-allowed border border-border-subtle' 
                : 'bg-accent-gold text-black hover:brightness-110 cursor-pointer'
                }`}>Guardar cântico
                </button>
            </div>
        </div>
    )
}

export default SongModal