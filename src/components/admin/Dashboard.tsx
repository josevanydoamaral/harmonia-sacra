import { SquarePen, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSongs } from '../../hooks/useSongs'
import { getAudioStatus } from '../../utils/songUtils';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SongModal from './SongModal';


const Dashboard = () => {
    const { songs, loading, error } = useSongs();
    const [isModalOpen, setIsModalOpen] = useState(true);

    if (loading) return "A carregar";
    if (error) return alert("Erro ao buscar cânticos");

    const totalSongs = songs.length;
    const incompleteSongs = songs.filter(s => getAudioStatus(s) !== "Completo").length
    const totalCategories = new Set(songs.map(s => s.category).filter(Boolean)).size;

    const handleDelete = async (id: string): Promise<void> => {
        if(window.confirm("Tem a certeza que quer eliminar este cântico?")) {
            try {
                await deleteDoc(doc(db, 'songs', id));
                window.alert("Cântico apagado com sucesso");
            } catch (error) {
                window.alert("Erro ao apagar cântico.");
            }
        }
    }

    

    return (
        <>

            <section className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                <article className="bg-card-surface border border-border-subtle p-5 rounded-2xl">
                    <span className='text-sm text-text-main/60 block mb-2'>Total de Cânticos</span>
                    <p className='text-3xl font-bold text-text-main'>{totalSongs}</p>
                </article>

                <article className="bg-card-surface border border-border-subtle p-5 rounded-2xl">
                    <span className='text-sm text-text-main/60 block mb-2'>Categorias</span>
                    <p className='text-3xl font-bold text-text-main'>{totalCategories}</p>
                </article>

                <article className="bg-card-surface border border-border-subtle p-5 rounded-2xl">
                    <span className='text-sm text-text-main/60 block mb-2'>Sem áudio completo</span>
                    <p className='text-3xl font-bold text-text-main'>{incompleteSongs}</p>
                </article>
            </section>
            <div className="flex justify-between items-center mb-4">
                <h2 className='text-xl font-bold text-text-main'>Cânticos</h2>
                <button className='bg-accent-gold text-black font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition hover:cursor-pointer'>+ Adicionar Cântico</button>
            </div>
            <div className="w-full bg-card-surface border border-border-subtle rounded-2xl overflow-hidden shadow-sm">

                <table className='w-full text-left'>

                    <thead className='bg-accent-gold/20'>
                        <tr className='border-b border-border-subtle/60'>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Título</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Categoria</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Vozes</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Áudio</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            songs.length === 0
                                ? <tr>
                                    <td colSpan={5} className='text-center text-text-main/50 p-3'>
                                    Sem cânticos
                                    </td>
                                </tr>

                                : songs.map((song) => (
                                    <tr key={song.id} className="
                            border-b 
                            border-border-subtle/50 
                            last:border-b-0 
                            hover:bg-white/5 t
                            ransition">

                                        <td className='p-4'>

                                            <span className='
                                    font-semibold 
                                    text-text-main'>
                                                {song.title} - {song.composer}
                                            </span>

                                        </td>

                                        <td className='p-4'>
                                            <span className='
                                    text-text-main/60'>
                                                {song.category}
                                            </span>
                                        </td>

                                        <td className='p-4'>
                                            <span className='font-semibold text-text-main'>3</span>
                                        </td>
                                        <td className='p-4'>
                                            {(() => {
                                                const status = getAudioStatus(song);
                                                const colorClass = 
                                                status === 'Completo'
                                                ? 'text-emerald-400'
                                                : status === 'Parcial'
                                                ? 'text-amber-400'
                                                : 'text-rose-400';

                                                return (
                                                    <span className={`
                                                        text-sm 
                                                        font-medium ${colorClass}`}>
                                                        {status}
                                                    </span>
                                                )
                                            })()}
                                        </td>
                                        <td className="p-4">
                                            <div className="
                                    flex 
                                    items-center 
                                    justify-end 
                                    gap-5">

                                                <button className='
                                        p-1.5 
                                        rounded-lg 
                                        transition 
                                        hover:text-text-main 
                                        cursor-pointer'>

                                                    <SquarePen className='
                                            w-5 
                                            text-text-main/60 
                                            hover:text-text-main/10 
                                            transition' />
                                                </button>

                                                <button className='
                                        p-1.5 
                                        rounded-lg 
                                        transition 
                                        hover:text-text-main 
                                        cursor-pointer'
                                        onClick={() => handleDelete(song.id)}
                                        >

                                                    <Trash2 className='
                                            w-5 
                                            text-red-400/70 
                                            hover:text-red-500/80' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                        }

                    </tbody>
                </table>
            </div>
            <SongModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        </>



    )
}

export default Dashboard