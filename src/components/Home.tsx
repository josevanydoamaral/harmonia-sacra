import { useState } from 'react'
import backgroundImage from '../assets/hero-img.png'
import Header from './Header'
import SearchBar from './SearchBar'
import SongCard from './SongCard'
import { motion } from 'framer-motion'

const Voices = {
    oneVoice: 1,
    twoVoices: 2,
    threeVoices: 3,
    fourVoices: 4
} as const

type VoicesType = typeof Voices[keyof typeof Voices]

const songs = [
  { id: 1, title: "Ave Maria", composer: "Victoria", category: "Advento", voices: 4 },
  { id: 2, title: "Kyrie Eleison", composer: "Palestrina", category: "Comum", voices: 4 },
  { id: 3, title: "O Magnum Mysterium", composer: "Victoria", category: "Natal", voices: 4 },
    { id: 4, title: "Ave Maria", composer: "Victoria", category: "Advento", voices: 4 },
  { id: 5, title: "Kyrie Eleison", composer: "Palestrina", category: "Comum", voices: 4 },
  { id: 6, title: "O Magnum Mysterium", composer: "Victoria", category: "Natal", voices: 4 },
    { id: 7, title: "Ave Maria", composer: "Victoria", category: "Advento", voices: 4 },
  { id: 8, title: "Kyrie Eleison", composer: "Palestrina", category: "Comum", voices: 4 },
  { id: 9, title: "O Magnum Mysterium", composer: "Victoria", category: "Natal", voices: 4 },
    { id: 10, title: "Ave Maria", composer: "Victoria", category: "Advento", voices: 4 },
  { id: 11, title: "Kyrie Eleison", composer: "Palestrina", category: "Comum", voices: 4 },
  { id: 12, title: "O Magnum Mysterium", composer: "Victoria", category: "Natal", voices: 4 },
];

const Home = () => {
  const [search, setSearch] = useState("")
  const filteredSongs = songs.filter(fs => fs.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  return (
      <div className='relative min-h-screen bg-[#fcf2d9]'>

        <div style={{ backgroundImage: `url(${backgroundImage})` }} className='absolute top-0 left-0 w-full h-100 bg-no-repeat bg-fixed bg-center bg-cover opacity-50'>
        </div>

        <div className='absolute w-full h-100 bg-linear-to-b from-transparent to-[#fcf2d9]'></div>

        <div className='relative z-10'>
          <Header />

          <SearchBar value={search} onChange={setSearch}/>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-30 px-3 items-start transition-all duration-1000">
            {filteredSongs.map(song => <SongCard key={song.id} id={song.id} title={song.title} composer={song.composer} category={song.category} voices={song.voices as VoicesType} />)}
          </motion.div>
          
        </div>
      </div>
  )
}

export default Home