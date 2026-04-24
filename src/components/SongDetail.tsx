import React, { useEffect, useRef, useState } from 'react'
import TrackControl from './TrackControl'
import { useParams } from 'react-router-dom'
import type { Song } from '../types/song';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MasterControl from './MasterControl';


const SongDetail = () => {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null)
  const [isPlaying, SetIsPlaying] = useState(false)

  // References for each voices
  const sopranoRef = useRef<HTMLAudioElement | null>(null);
  const altoRef = useRef<HTMLAudioElement | null>(null);
  const tenorRef = useRef<HTMLAudioElement | null>(null);
  const bassRef = useRef<HTMLAudioElement | null>(null);

  // List of all audio elements
  const allAudios = [sopranoRef, altoRef, tenorRef, bassRef];

  // Everytime  isPlaying changes this useEffect runs
  useEffect(() => {

    allAudios.forEach(ref => {
      if (ref.current) {
        if (isPlaying) {
          ref.current.play();
        } else {
          ref.current.pause();
        }
      }
    })
  }, [isPlaying]);

  const [volumes, SetVolumes] = useState({
    soprano: 0.8, // initial volume value = 80%
    alto: 0.8,
    tenor: 0.8,
    bass: 0.8
  })

  const [muted, setMuted] = useState({
    soprano: false,
    alto: false,
    tenor: false,
    bass: false
  });

  // If volumes and muted changed run this
  useEffect(() => {
    if (sopranoRef.current) {
      sopranoRef.current.volume = volumes.soprano
      sopranoRef.current.muted = muted.soprano
    }

    if (altoRef.current) {
      altoRef.current.volume = volumes.alto
      altoRef.current.muted = muted.alto
    }

    if (tenorRef.current) {
      tenorRef.current.volume = volumes.tenor
      tenorRef.current.muted = muted.tenor
    }

    if (bassRef.current) {
      bassRef.current.volume = volumes.bass
      bassRef.current.muted = muted.bass
    }
  }, [volumes, muted])

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
          style={{ border: 'none' }}
        >
          <p>O seu navegador não suporta iframes. <a href={song.pdfUrl}>Clique aqui para descarregar o PDF.</a></p>
        </iframe>
      </div>
      <div className="w-full lg:w-1/2 p-6">
        <div className="my-8">
          <MasterControl isPlaying={isPlaying} onToggle={() => SetIsPlaying(!isPlaying)} />
        </div>
        <TrackControl label="Soprano" audioUrl={song.audioUrls?.soprano} volume={volumes.soprano} onVolumeChange={(v) => SetVolumes({ ...volumes, soprano: v })} isMuted={muted.soprano} onMuteToggle={() => { setMuted({ ...muted, soprano: !muted.soprano }) }} />
        <TrackControl label="Contralto" audioUrl={song.audioUrls?.alto} volume={volumes.alto} onVolumeChange={(v) => SetVolumes({ ...volumes, alto: v })} isMuted={muted.alto} onMuteToggle={() => setMuted({ ...muted, alto: !muted.alto })} />
        <TrackControl label="Tenor" audioUrl={song.audioUrls?.tenor} volume={volumes.tenor} onVolumeChange={(v) => SetVolumes({ ...volumes, tenor: v })} isMuted={muted.tenor} onMuteToggle={() => setMuted({ ...muted, tenor: !muted.tenor })} />
        <TrackControl label="Baixo" audioUrl={song.audioUrls?.bass} volume={volumes.bass} onVolumeChange={(v) => SetVolumes({ ...volumes, bass: v })} isMuted={muted.bass} onMuteToggle={() => setMuted({ ...muted, bass: !muted.bass })} />
      </div>

      <audio ref={sopranoRef} src={song.audioUrls?.soprano} />
      <audio ref={altoRef} src={song.audioUrls?.alto} />
      <audio ref={tenorRef} src={song.audioUrls?.tenor} />
      <audio ref={bassRef} src={song.audioUrls?.bass} />
    </div>
  )
}

export default SongDetail