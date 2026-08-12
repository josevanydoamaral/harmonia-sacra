import React from 'react'
import { useToast } from '../../hooks/useToast'
import { X } from 'lucide-react';

const ToastContainer = () => {
    const { toasts, removeToast} = useToast();

    if (toasts.length === 0) return null;
  return (
    <div className='flex fixed top-5 right-5 z-50 flex-col gap-2 w-full max-w-sm pointer-events-none'>
       { 
            toasts.map((t) => {
                    const typeStyles = t.type === 'error' 
                        ? 'bg-red-950/90 border-red-500/50 text-red-200'
                        : t.type === 'success'
                        ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                        : 'bg-blue-950/90 border-blue-500/50 text-blue-200'

                    return (
                        <div key={t.id}  className={`flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md pointer-events-auto transition-all ${typeStyles}`}>
                            <p className='text-sm font-medium'>{t.message}</p>
                            <button onClick={() => removeToast(t.id)}>
                                <X className='w-4 h-4 cursor-pointer hover:opacity-70' />
                            </button>
                        </div>
                    )
            })
       }
    </div>
  )
}

export default ToastContainer