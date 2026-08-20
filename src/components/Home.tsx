import { useState } from 'react'
import backgroundImage from '../assets/hero-img.png'
import Header from './Header'
import SearchBar from './SearchBar'
import SongCard from './SongCard'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {useSongs} from "../hooks/useSongs.ts";

const Home = () => {
    const [search, setSearch] = useState("")
    const { songs, loading, error } = useSongs()

    const filteredSongs = songs.filter(fs =>
      fs.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      || fs.composer.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    )

    if (loading) return <div className='p-8 text-center text-text-main/60'>A carregar cânticos...</div>;
    if (error) return <div className='p-8 text-center text-red-400'>Erro ao carregar cânticos. Tente recarregar a página.</div>;

  return (
    <div className='relative min-h-screen bg-base-surface'>
      <div style={{ backgroundImage: `url(${backgroundImage})` }} className='absolute top-0 left-0 w-full h-100 bg-no-repeat bg-fixed bg-center bg-cover opacity-50'>
      </div>

      <div className='absolute w-full h-100 bg-linear-to-b from-transparent to-base-surface'></div>

      <div className='relative z-10'>
        <Header />
        <SearchBar value={search} onChange={setSearch} />

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-30 px-6 items-start transition-all duration-1000">
          { filteredSongs.length === 0
              ? <div className='p-8 text-center text-text-main/60'>Nenhum cântico encontrado.</div>

              : filteredSongs.map(song =>
                <Link key={song.id} to={`cantico/${song.id}`}>
                  <SongCard id={song.id} title={song.title} composer={song.composer} category={song.category} tracks={song.tracks} />
                </Link>
            )
          }
        </motion.div>


      </div>
    </div>
  )
}

export default Home