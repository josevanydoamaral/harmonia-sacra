import { useState } from "react"
import React from "react";
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string;

  onChange: (s: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    const [search, setSearch] = useState("")
  return (
    <div className='relative flex justify-center max-w-lg mx-auto mt-40'>
        <input type="text" className='w-sm sm:w-full px-8 py-3 bg-card-surface text-card-text rounded-full shadow-xl border border-border-subtle focus:outline-none focus:ring-1 ring-border-subtle placeholder-[#78716c]' placeholder="Pesquisar Cântico..." value={value} onChange={(e) => onChange(e.target.value)}/>
        <button className="absolute right-17 sm:right-2 top-1/2 -translate-y-1/2 bg-button-surface hover:bg-hover-button p-2 rounded-full hover:cursor-pointer"><Search size={20} color="white" /></button>
    </div>
  )
}

export default SearchBar