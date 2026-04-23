import React, { useEffect, useState } from 'react'
import TrackControl from './TrackControl'
import { useParams } from 'react-router-dom'
import { Song } from '../types/song';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';


const SongDetail = () => {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null)

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
      
      <div className="w-full lg:w-1/2">
        <iframe 
          className='bg-white'
          src="https://example.org"
          title='Canticos'
          width={600}
          height={700}
          >

        </iframe>
      </div>
      <div className="w-full lg:w-1/2 p-6">
        <TrackControl label="Soprano" audioUrl={song.audioUrls?.soprano }/>
        <TrackControl label="Contralto" audioUrl={song.audioUrls?.alto}/>
        <TrackControl label="Tenor" audioUrl={song.audioUrls?.tenor}/>
        <TrackControl label="Baixo" audioUrl={song.audioUrls?.bass}/>
      </div>
    </div>
  )
}

export default SongDetail