import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import backgroundImage from '../assets/hero-img.png'
import Header from './Header'
import SearchBar from './SearchBar'
import SongCard from './SongCard'
import { motion } from 'framer-motion'
import { db } from '../lib/firebase'

const Voices = {
  oneVoice: 1,
  twoVoices: 2,
  threeVoices: 3,
  fourVoices: 4
} as const

type VoicesType = typeof Voices[keyof typeof Voices]

const Home = () => {
  const [search, setSearch] = useState("")
  const [songs, setSongs] = useState<any[]>([])

  useEffect(() => {
    const songsCollection = collection(db, "songs");

    const unsubscribe = onSnapshot(songsCollection,
      (snapshot) => {
    
        const songsData = snapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() }))
        setSongs(songsData)
      },
      (error) => { console.error("Erro no Firebase: ", error) })

    return () => unsubscribe();
  }, [])

  const filteredSongs = songs.filter(fs => fs.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  return (
    <div className='relative min-h-screen bg-[#f6e1ab]'>

      <div style={{ backgroundImage: `url(${backgroundImage})` }} className='absolute top-0 left-0 w-full h-100 bg-no-repeat bg-fixed bg-center bg-cover opacity-50'>
      </div>

      <div className='absolute w-full h-100 bg-linear-to-b from-transparent to-[#f6e1ab]'></div>

      <div className='relative z-10'>
        <Header />

        <SearchBar value={search} onChange={setSearch} />

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-30 px-6 items-start transition-all duration-1000">
          {filteredSongs.map(song => <SongCard key={song.id} id={song.id} title={song.title} composer={song.composer} category={song.category} voices={song.voices as VoicesType} />)}
        </motion.div>

      </div>
    </div>
  )
}

export default Home