import React, { useEffect, useState } from 'react'
import { type Song, type VoicesType } from '../../types/song'
import AdminSongRow from './AdminSongRow';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';



const AdminDashboard = () => {
    const [songs, setSongs] = useState<Song[]>([])

    async function handleEdit(id: string): Promise<void> {
        console.log("Oi")
    }

    async function handleDelete(id: string): Promise<void> {
        const song = doc(db, "songs", id);

        try {
            await deleteDoc(song)
        } catch(error) {
          console.log("Erro ao apagar dado: ", error)  
        }

    }

    useEffect(() => {
        const songsColletion = collection(db, "songs")

        const unsubscribe = onSnapshot(songsColletion, (snapshot) => {
            const songsData = snapshot.docs.map(
                doc => ({ id: doc.id, ...doc.data() } as Song)
            )
            setSongs(songsData)
        }, (error) => {
            console.log("Erro no firebase: ", error)
        })

        return () => unsubscribe()
    }, [])
    return (
        <div className='max-w-6xl mx-auto p-8'>
            <div className='flex justify-between'>
                <h3>Admin Dashboard</h3>
                <button>OI</button>
            </div>

            <div className='grid grid-cols-[1fr_150px_120px_100px] items-center px-4 py-2 bg-track-button/10 text-track-text text-xs font-bold uppercase tracking-wider rounded-t-lg'>
                <span>TÍTULO</span>
                <span>CATEGORIA</span>
                <span>VOZES</span>
                <span>Ações</span>

            </div>
            <div className='w-full'>
                {songs.map((song) =>
                    <AdminSongRow key={song.id} id={song.id} title={song.title} composer={song.composer} category={song.category} voices={song.voices as VoicesType} onDelete={() => handleDelete(song.id)} onEdit={() => handleEdit(song.id)} />
                )}
            </div>
        </div>
    )
}

export default AdminDashboard