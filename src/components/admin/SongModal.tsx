import React, { useState } from 'react'

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



  return (
    <div>SongModal</div>
  )
}

export default SongModal