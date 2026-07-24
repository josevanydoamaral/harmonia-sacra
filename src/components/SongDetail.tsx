import React, { useEffect, useRef, useState } from 'react'
import TrackControl from './TrackControl'
import { Link, useParams } from 'react-router-dom'
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

  const [soloVoice, setSoloVoice] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime)

    sopranoRef.current && (sopranoRef.current.currentTime = newTime)
    altoRef.current && (altoRef.current.currentTime = newTime)
    tenorRef.current && (tenorRef.current.currentTime = newTime)
    bassRef.current && (bassRef.current.currentTime = newTime)
    
  }

  // If volumes and muted changed run this
  // An audio component should be muted only if there if mutted button is selected or if there is a solo button active in any of the other components. And when we click at the solo button in a place where mute button is active it disables mute and play the solo.
  useEffect(() => {
    if (sopranoRef.current) {
      sopranoRef.current.volume = volumes.soprano
      sopranoRef.current.muted = muted.soprano || (soloVoice !== null && soloVoice !== 'soprano')
    }

    if (altoRef.current) {
      altoRef.current.volume = volumes.alto
      altoRef.current.muted = muted.alto || (soloVoice !== null && soloVoice !== 'alto')
    }

    if (tenorRef.current) {
      tenorRef.current.volume = volumes.tenor
      tenorRef.current.muted = muted.tenor || (soloVoice !== null && soloVoice !== 'tenor')
    }

    if (bassRef.current) {
      bassRef.current.volume = volumes.bass
      bassRef.current.muted = muted.bass || (soloVoice !== null && soloVoice !== 'bass')
    }
  }, [volumes, muted, soloVoice])

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

      <div className="w-full lg:w-1/2 h-[650px] lg:h-screen p-4 shrink-0">
        <iframe
          className='w-full h-full bg-white rounded-lg shadow-2xl border border-accent-gold/20'
          src={song.pdfUrl || ""}
          title={song.title}
          style={{ border: 'none' }}
        >
          <p>O seu navegador não suporta iframes. <a href={song.pdfUrl}>Clique aqui para descarregar o PDF.</a></p>
        </iframe>
      </div>
      <div className="w-full lg:w-1/2 p-6">

        <div className="my-8">
          <MasterControl isPlaying={isPlaying} currentTime={currentTime} duration={duration} onSeek={handleSeek} onToggle={() => SetIsPlaying(!isPlaying)} />
        </div>

        <TrackControl 
          label="Soprano" 
          audioUrl={song.audioUrls?.soprano} 
          volume={volumes.soprano} 
          onVolumeChange={(v) => SetVolumes({ ...volumes, soprano: v })} 
          isMuted={muted.soprano} 
          onMuteToggle={() => setMuted({ ...muted, soprano: !muted.soprano })} 
          isSolo={soloVoice === 'soprano'}
          onSoloToggle={() => {
            const isCurrentlySolo = soloVoice === 'soprano';
            setSoloVoice(isCurrentlySolo ? null : 'soprano');
            if (!isCurrentlySolo) {
              setMuted((prev) => ({ ...prev, soprano: false }))
            }
          }}

        />

        <TrackControl 
          label="Contralto" 
          audioUrl={song.audioUrls?.alto} 
          volume={volumes.alto} 
          onVolumeChange={(v) => SetVolumes({ ...volumes, alto: v })} 
          isMuted={muted.alto}
          onMuteToggle={() => setMuted({ ...muted, alto: !muted.alto })}
          isSolo={soloVoice === 'alto'}
          onSoloToggle={() => {
            const isCurrentlySolo = soloVoice === 'alto';
            setSoloVoice(isCurrentlySolo ? null : 'alto')
            if (!isCurrentlySolo) {
              setMuted((prev) => ({ ...prev, alto: false }))
            }
          }}
          

        />

        <TrackControl 
          label="Tenor" 
          audioUrl={song.audioUrls?.tenor} 
          volume={volumes.tenor} 
          onVolumeChange={(v) => SetVolumes({ ...volumes, tenor: v })}
          isMuted={muted.tenor} 
          onMuteToggle={() => setMuted({ ...muted, tenor: !muted.tenor })} 
          isSolo={soloVoice === 'tenor'}
          onSoloToggle={() => {
            const isCurrentlySolo = soloVoice === 'tenor';
            setSoloVoice(isCurrentlySolo ? null : 'tenor');
            if (!isCurrentlySolo) {
              setMuted((prev) => ({ ...prev, tenor: false }))
            }
          }}
         

        />

        <TrackControl 
          label="Baixo" 
          audioUrl={song.audioUrls?.bass} 
          volume={volumes.bass} 
          onVolumeChange={(v) => SetVolumes({ ...volumes, bass: v })} 
          isMuted={muted.bass} 
          onMuteToggle={() => setMuted({ ...muted, bass: !muted.bass })} 
          isSolo={soloVoice === 'bass'}
          onSoloToggle={() => {
            const isCurrentlySolo = soloVoice === 'bass'
            setSoloVoice(isCurrentlySolo ? null : 'bass')
            if (!isCurrentlySolo) {
              setMuted((prev) => ({ ...prev, bass: false }))
            }
          }}

        />
      </div>

      <audio 
        ref={sopranoRef} 
        src={song.audioUrls?.soprano}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} 
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <audio ref={altoRef} src={song.audioUrls?.alto} />
      <audio ref={tenorRef} src={song.audioUrls?.tenor} />
      <audio ref={bassRef} src={song.audioUrls?.bass} />
    </div>
  )
}

export default SongDetail