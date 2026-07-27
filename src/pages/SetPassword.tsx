import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const SetPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()

        setError(null)
        

        if (password !== confirmPassword) {
            setError('As palavras-passe não coincidem')
            setLoading(false)
            return;
        }
        setLoading(true)

        try {
            
            const credentials = await signInWithEmailAndPassword(auth, email, password);
            if (credentials.user) {
                navigate('/');
                return;
            }
        } catch (error) {
            setError('email ou palavra-passe errados.')
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 '>
        <div className='w-full max-w-sm flex flex-col items-center'>
            <h1 className='font-title text-3xl text-accent-gold text-center mb-1'>Harmonia Sacra</h1>
            <p className='text-sm text-text-main/80 text-center mb-8'>Primeiro acesso - defina a sua palavra-passe</p>
            <form onSubmit={handleSubmit} className='w-full space-y-5'>
                
                <div>
                    <label htmlFor="email" className='block text-text-main/70 font-semibold mb-1'>Email</label>
                    <input 
                        className='w-full px-4 py-3 rounded-xl bg-card-surface border border-border-subtle text-text-main placeholder:text-text-main/30 outline-none focus:border-accent-gold transition'
                        type="email" 
                        id='email' 
                        value={email} 
                        placeholder='seuemail@email.com'
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                
                <div>
                    
                    <label htmlFor="password" className='block text-text-main/70 font-semibold mb-1'>Nova palavra-passe</label>
                    <input 
                        className='w-full px-4 py-3 rounded-xl bg-card-surface border border-border-subtle text-text-main placeholder:text-text-main/30 outline-none focus:border-accent-gold transition'
                        type="password" 
                        id='password' 
                        value={password}
                        placeholder='A sua palavra-passe'
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                                <div>
                    
                    <label htmlFor="confirmPassword" className='block text-text-main/70 font-semibold mb-1'>Confirmar palavra-passe</label>
                    <input 
                        className='w-full px-4 py-3 rounded-xl bg-card-surface border border-border-subtle text-text-main placeholder:text-text-main/30 outline-none focus:border-accent-gold transition'
                        type="password" 
                        id='confirmPassword' 
                        value={confirmPassword}
                        placeholder='Repita palavra-passe'
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                </div>

                {error && 
                    <div className='w-full p-3 rounded-xl text-sm text-center bg-red-500/10 border border-red-500/20 text-red-400'>
                        {error}
                    </div>
                }

                <button 
                    type='submit'
                    disabled={loading}
                    className='w-full py-3.5 rounded-xl bg-button-surface hover:bg-hover-button text-black font-semibold text-base transition disabled:opacity-50'
                >
                    {loading ? "A entrar..." : "Entrar"}
                </button>
            </form>
        </div>
    </div>
  )
}

export default SetPassword