import { SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useSongs } from '../../hooks/useSongs'
import { getAudioStatus } from '../../utils/songUtils';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SongModal from './SongModal';
import { createSong, updateSong, type RawSongData } from '../../services/songService';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import AccountsPanel from './AccountsPanel';
import type { Song } from '../../types/song';
import {logger} from "../../utils/logger.ts";
import {useToast} from "../../hooks/useToast.ts";
import {getFriendlyErrorMessage} from "../../utils/errorMapping.ts";


const Dashboard = () => {
    const { songs, loading, error } = useSongs();
    const { profile } = useAuth()
    const [activeTab, setActiveTab] = useState<'songs' | 'accounts'>('songs');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<Song | null>(null);

    const { showSuccess, showError } = useToast()

    if (loading) return <div className='p-8 text-center text-text-main/60'>A carregar cânticos...</div>;
    if (error) return <div className='p-8 text-center text-red-400'>Erro ao carregar cânticos. Tente recarregar a página.</div>;

    const totalSongs = songs.length;
    const incompleteSongs = songs.filter(s => getAudioStatus(s) !== "Completo").length
    const totalCategories = new Set(songs.map(s => s.category).filter(Boolean)).size;

    const handleDelete = async (id: string): Promise<void> => {
        if (window.confirm("Tem a certeza que quer eliminar este cântico?")) {
            try {
                await deleteDoc(doc(db, 'songs', id))
                logger.info('DashBoard', `Cântico ${id} eliminado com sucesso`);
                showSuccess("Cântico apagado com sucesso");
            } catch (error) {
                logger.error('Dashboard', 'Erro ao eliminar cântico', error);
                showError(getFriendlyErrorMessage(error));
            }
        }
    }

    const handleSaveSong = async (songData: RawSongData) => {
        if (isEditing) {
            await updateSong(isEditing.id, songData)
        } else {
            await createSong(songData)
        }
    }

    return (
        <>
            <div className='flex gap-2 p-1 bg-card-surface border border-border-subtle rounded-xl w-fit mb-6'>
                <button
                    onClick={() => setActiveTab('songs')}
                    className={`px-4 py-2 rounded-lg transition cursor-pointer font-medium ${activeTab === 'songs'
                        ? 'bg-accent-gold text-black font-bold'
                        : 'text-text-main/60 hover:text-text-main font-medium'}`}
                >Cânticos</button>
                {profile?.role === 'admin' &&

                    <button
                        onClick={() => setActiveTab('accounts')}
                        className={`px-4 py-2 rounded-lg transition cursor-pointer font-medium ${activeTab === 'accounts'
                            ? 'bg-accent-gold text-black font-bold'
                            : 'text-text-main/60 hover:text-text-main font-medium'}`}
                    >
                        Contas
                    </button>
                }

            </div>
            {
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'songs' ? (
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
                                <div className="flex justify-end items-center mb-4">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className='bg-accent-gold text-black font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition hover:cursor-pointer'
                                    >+ Adicionar Cântico
                                    </button>
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
                                                        <tr key={song.id} className="border-b border-border-subtle/50 last:border-b-0 hover:bg-white/5 transition">

                                                            <td className='p-4'>

                                                                <span className='font-semibold text-text-main'>
                                                                    {song.title} - {song.composer}
                                                                </span>

                                                            </td>

                                                            <td className='p-4'>
                                                                <span className='text-text-main/60'>
                                                                    {song.category}
                                                                </span>
                                                            </td>

                                                            <td className='p-4'>
                                                                <span className='font-semibold text-text-main'>{song.tracks?.length || 0}</span>
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
                                                                        <span className={`text-sm font-medium ${colorClass}`}>
                                                                            {status}
                                                                        </span>
                                                                    )
                                                                })()}
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center justify-end gap-5">

                                                                    <button
                                                                        onClick={() => setIsEditing(song)}
                                                                        className='p-1.5 rounded-lg transition hover:text-text-main cursor-pointer'>
                                                                        <SquarePen className='w-5 text-text-main/60 hover:text-text-main/10 transition' />
                                                                    </button>

                                                                    <button className='p-1.5 rounded-lg transition hover:text-text-main cursor-pointer'
                                                                        onClick={() => handleDelete(song.id)}
                                                                    >
                                                                        <Trash2 className='w-5 text-red-400/70 hover:text-red-500/80' />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                            }

                                        </tbody>
                                    </table>
                                </div>
                                <SongModal onSave={handleSaveSong} initialData={isEditing} isOpen={isModalOpen || !!isEditing} onClose={() => { setIsModalOpen(false); setIsEditing(null); }} />
                            </>
                        ) : (
                            <AccountsPanel />
                        )}
                    </motion.div>
                </AnimatePresence>
            }


        </>



    )
}

export default Dashboard