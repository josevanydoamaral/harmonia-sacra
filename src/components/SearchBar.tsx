import React from "react";
import { Search } from "lucide-react"
import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;

  onChange: (s: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className='relative flex justify-center max-w-lg mx-auto mt-40'>
        <motion.input whileFocus={{ scale: 1.02, boxShadow: "0 0 8px var(--color-accent-gold)" }}  type="text" className='w-sm sm:w-full px-8 py-3 bg-card-surface text-card-text rounded-full shadow-xl border border-border-subtle focus:outline-none focus:ring-1 ring-border-subtle placeholder-[#78716c] transition-all duration-300' placeholder="Pesquisar Cântico..." value={value} onChange={(e) => onChange(e.target.value)}/>
        <motion.button whileHover={{scale: 1.02, rotate: 5}} whileTap={{scale: 0.98}} className="absolute right-17 sm:right-2 top-1/2 -translate-y-1/2 bg-button-surface hover:bg-hover-button p-2 rounded-full hover:cursor-pointer transition-all duration-300"><Search size={20} color="white" /></motion.button>
    </div>
  )
}

export default SearchBar