import { useState } from "react"
import { Search } from "lucide-react"

const SearchBar = () => {
    const [search, setSearch] = useState("")
  return (
    <div className='relative max-w-lg mx-auto mt-10'>
        <input type="text" className='w-full px-8 py-3 rounded-full shadow-xl border border-stone-200 focus:outline-none focus:ring-1 ring-[#b38b4d]' value={search} onChange={(e) => setSearch(e.target.value)}/>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#b38b4d] p-2 rounded-full"><Search size={20} color="white" /></button>
    </div>
  )
}

export default SearchBar