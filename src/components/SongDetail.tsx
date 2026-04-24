import React, { useEffect, useState } from 'react'
import TrackControl from './TrackControl'
import { useParams } from 'react-router-dom'
import type { Song } from '../types/song';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MasterControl from './MasterControl';


const SongDetail = () => {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null)
  const [isPlaying, SetIsPlaying] = useState<Boolean>(false)

  useEffect(() => {
    // Async function to fetch songs from firebase
    const fetchSong = async () => {
      // Check if id exists
      if (!id) return;

      try {
        const docRef = doc(db, "songs", id);

        const docSnap = await getDoc(docRef)

        // Verify if docs exists
        if (docSnap.exists()) {
          setSong({ id: docSnap.id, ...docSnap.data() } as Song);
        } else {
          console.warn("Cântico não encontrado no banco de dados.");
        }
      } catch (error) {
          console.error("Erro ao procurar o cântico no Firestore: ", error);
      }
    }
    fetchSong()
  }, [id])

  if (!song) return <div className="p-10 text-white">A carregar cântico...</div>; 

  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      
      <div className="w-full lg:w-1/2 h-250 lg:h-screen p-4 shrink-0">
        <iframe 
          className='w-full h-250 bg-white rounded-lg shadow-2xl border border-accent-gold/20'
          src={song.pdfUrl || ""}
          title={song.title}
          style={{ border: 'none'}}
          >
          <p>O seu navegador não suporta iframes. <a href={song.pdfUrl}>Clique aqui para descarregar o PDF.</a></p>
        </iframe>
      </div>
      <div className="w-full lg:w-1/2 p-6">
        <div className="my-8">
          <MasterControl isPlaying={isPlaying} onToggle={() => SetIsPlaying(!isPlaying)} />
        </div>
        <TrackControl label="Soprano" audioUrl={song.audioUrls?.soprano }/>
        <TrackControl label="Contralto" audioUrl={song.audioUrls?.alto}/>
        <TrackControl label="Tenor" audioUrl={song.audioUrls?.tenor}/>
        <TrackControl label="Baixo" audioUrl={song.audioUrls?.bass}/>
      </div>
    </div>
  )
}

export default SongDetail