import React, { useState } from 'react'
import { X } from 'lucide-react';

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

    const [tracks, setTracks] = useState<DraftTrack[]>([]);

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
            <div className="flex items-center justify-between">
                <h2 className='text-2xl text-accent-gold font-serif'>Adicionar Cântico</h2>
                <button onClick={onClose}><X className='text-text-main' width={40} height={40} /></button>
            </div>
        </div>
    </div>
  )
}

export default SongModal