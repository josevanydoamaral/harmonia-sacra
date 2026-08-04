import React, { useEffect, useRef, useState } from 'react'
import TrackControl from './TrackControl'
import { Link, useParams } from 'react-router-dom'
import type { AudioTrack, Song } from '../types/song';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MasterControl from './MasterControl';
import { useAudioEngine } from '../hooks/useAudioEngine';


const SongDetail = () => {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null)


  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [muteds, setMuteds] = useState<Record<string, boolean>>({});


  const [soloVoice, setSoloVoice] = useState<string | null>(null);

  const {
    duration,
    elapsedTime,
    isLoaded,
    getWaveformData,
    isPlaying,
    pause,
    play,
    seek,
    setMuted,
    setSolo,
    setVolume

  } = useAudioEngine(song?.tracks);


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

          const songData = docSnap.data() as Song;
          const songTracks: AudioTrack[] = songData.tracks

          if (songTracks) {
            const initialVolumes: Record<string, number> = {}
            const initialMuteds: Record<string, boolean> = {}

            songTracks.forEach(t => { initialVolumes[t.id] = 0.8; initialMuteds[t.id] = false })

            setVolumes(initialVolumes)
            setMuteds(initialMuteds)

          }

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
          <MasterControl isPlaying={isPlaying} currentTime={elapsedTime} duration={duration} onSeek={seek} onToggle={() => isPlaying ? pause() : play()} />
        </div>
        {
          song.tracks.map(t => 
            <TrackControl 
              key={t.id}
              label={t.label}
              audioUrl={t.url}
              volume={volumes[t.id]}
              isMuted={muteds[t.id]}
              isSolo={soloVoice === t.id}
              
              onVolumeChange={(newVol) => {
                setVolumes(prev => ({ ...prev, [t.id]: newVol }))
                setVolume(t.id, newVol)
              }}

              onMuteToggle={() => {
                const newMuted = !muteds[t.id];
                setMuteds(prev => ({ ...prev, [t.id]: newMuted }));
                setMuted(t.id, newMuted);
              }}

              onSoloToggle={() => {
                const isCurrentlySolo = soloVoice === t.id;
                const newSoloStatus = isCurrentlySolo ? null : t.id;

                setSoloVoice(newSoloStatus);
                setSolo(newSoloStatus);
              }}
            />
          )
        }
      </div>
    </div>
  )
}

export default SongDetail