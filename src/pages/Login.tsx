import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import {useToast} from "../hooks/useToast.ts";
import {logger} from "../utils/logger.ts";
import {getFriendlyErrorMessage} from "../utils/errorMapping.ts";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [loading, setLoading] = useState<boolean>(false)

    const { showError, showSuccess} = useToast()

    const navigate = useNavigate()

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()

        setLoading(true)

        try {
            
            const credentials = await signInWithEmailAndPassword(auth, email, password);
            if (credentials.user) {
                logger.info('Login', 'Utilizador autenticado com sucesso');
                showSuccess('Sessão iniciada com sucesso!');
                navigate('/');
                return;
            }
        } catch (error) {
            logger.error('Login', 'Falha ao autenticar utilizador.', error);
            const msg = getFriendlyErrorMessage(error);
            showError(msg)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='bg-base-surface min-h-screen flex items-center justify-center px-4 '>
        <div className='w-full max-w-sm flex flex-col items-center'>
            <h1 className='font-title text-3xl text-accent-gold text-center mb-1'>Harmonia Sacra</h1>
            <p className='text-sm text-text-main/80 text-center mb-8'>Acesse a sua conta</p>
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
                    
                    <label htmlFor="password" className='block text-text-main/70 font-semibold mb-1'>Palavra-passe</label>
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

export default Login