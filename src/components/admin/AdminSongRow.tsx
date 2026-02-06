import { Pencil, Trash2 } from 'lucide-react'
import type { AdminActions }  from '../../types/song'

const AdminSongRow: React.FC<AdminActions> = ({ id, title, composer, category, voices, onEdit, onDelete }) => {
  return (
    <div className='grid grid-cols-[1fr_150px_120px_100px] items-center p-4 border-b border-track-border/50 hover:bg-track-button/20 transition-colors'>
        <span className='text-track-text font-medium truncate pr-4'>{title} - {composer}</span>

        <span className='text-sm text-track-text/70'>{category}</span>

        <span className='text-sm text-track-text/70'>{voices} {voices >= 1 ? 'vozes' : 'voz'}</span>

        <div className='flex items-center gap-4'>
            <button onClick={ () => {onEdit(id)}} className='hover:text-accent-gold'><Pencil size={18}/></button>

            <button onClick={() => { if(confirm(`Tem a certeza que deseja apagar o cântico ${title}`)) onDelete(id) }}  className='hover:text-red-600'><Trash2 size={20}/></button>
        </div>
    </div>
  )
}

export default AdminSongRow