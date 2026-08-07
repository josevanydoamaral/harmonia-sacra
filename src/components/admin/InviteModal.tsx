import { X } from 'lucide-react';
import React, { useState } from 'react'

interface InviteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<void>;
}

const InviteModal = ({ isOpen, onClose, onInvite}: InviteEditorModalProps) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent) => {
        try {
            e.preventDefault()
            setIsSubmitting(true);
            await onInvite(email);
            setEmail('');
            onClose();
        } catch (error) {
            setErrorMessage("Erro ao enviar convite");
        } finally {
            setIsSubmitting(false);
        }
    }
    

    if (!isOpen) return null;
  return (
           <div className='flex items-center justify-center fixed inset-0 bg-base-surface/80 backdrop-blur-sm z-50'>

            <form 
                onSubmit={handleSubmit}
                className='flex flex-col max-w-3xl w-full max-h-[90vh] bg-base-surface border border-border-subtle rounded-3xl shadow-2xl p-8'>
                <header>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className='text-2xl text-accent-gold font-serif'>Adicionar Conta</h2>
                        <button type='button' onClick={onClose}><X className='text-text-main hover:cursor-pointer hover:text-red-400 transition' width={40} height={40} /></button>
                    </div>
                </header>
                <section className='flex-1 overflow-y-auto modal-scroll-body pr-2 py-4'>
                    <div className='grid grid-cols-1 gap-4 mb-4'>
                        <div>
                            <label className='text-md text-card-text/60 mb-1.5 block' htmlFor="email">Email</label>
                            <input className='w-full bg-card-surface border border-border-subtle rounded-xl text-sm text-card-text/60 px-4 py-3 focus:outline-none focus:border-accent-gold placeholder:text-card-text/50' type="email" value={email} placeholder='Ex.: example@gmail.com' onChange={(e) => setEmail(e.target.value)} id='email' />
                        </div>
 
                    </div>
          
            
                </section>
                <footer>
                 
                    {errorMessage &&
                        <p className='text-red-400 text-sm'>{errorMessage}</p>
                    }
                    <button
                        type="submit"
                        disabled={!email || isSubmitting}
                        className=
                        {`w-full py-3.5 rounded-xl mt-8 text-lg font-semibold ${!email || isSubmitting
                            ? 'bg-card-surface text-card-text/30 cursor-not-allowed border border-border-subtle'
                            : 'bg-accent-gold text-black hover:brightness-110 cursor-pointer'
                            }`}>{
                            isSubmitting
                                ? 'A enviar convite...'
                                : 'Enviar convite'}
                    </button>
                </footer>
            </form>
        </div>
  )
}

export default InviteModal