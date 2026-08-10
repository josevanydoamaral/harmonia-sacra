import { SquarePen, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import InviteModal from './InviteModal';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { db, secondaryAuth } from '../../lib/firebase';
import type { UserProfile, UserRole } from '../../types/auth';
import { collection, deleteDoc, doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { useAccounts } from '../../hooks/useAccounts';



const AccountsPanel = ({ }) => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const { users, error, loading } = useAccounts()

    const handleInvite = async (email: string, role: UserRole = 'editor') => {
        try {
            const password = Math.random().toString(36).slice(-8) + 'A1';
            const user = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const uid = user.user.uid

            const data = {
                email: email,
                role: role,
                status: 'pending',
                createdAt: serverTimestamp()
            }

            const docRef = doc(db, 'users', uid);

            await setDoc(docRef, data)

            await sendPasswordResetEmail(secondaryAuth, email);
            await signOut(secondaryAuth);

        } catch (error) {
            console.error(error)
            throw new Error("Erro ao enviar convite");
        }
    }

    const handleDeleteUser = async (uuid: string) => {
        if (window.confirm("Tem a certeza que deseja eliminar o utilizador?")) {
            try {
                await deleteDoc(doc(db, 'users', uuid));
                window.alert("Utilizador eliminado com sucesso.")
            } catch(error) {
                window.alert("Erro ao eliminar cântico. Tente Novamente em breve.");
                console.log("Erro: ", error);
            }
        }
    }

    if (error) return <p className="text-red-400 p-4">Erro ao carregar contas: {error}</p>;

    return (
        <>
            <div className="flex justify-end items-center mb-4">
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className='bg-accent-gold text-black font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition hover:cursor-pointer'
                >+ Adicionar Conta
                </button>
            </div>
            <div className="w-full bg-card-surface border border-border-subtle rounded-2xl overflow-hidden shadow-sm">

                <table className='w-full text-left'>

                    <thead className='bg-accent-gold/20'>
                        <tr className='border-b border-border-subtle/60'>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Utilizador</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Papel</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Estado</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'></th>
                        </tr>
                    </thead>

                    <tbody>
                        {   loading 
                            ? <tr>
                                    <td colSpan={5} className='text-center text-text-main/50 p-3'>
                                        Carregando utilizadores...
                                    </td>
                                </tr>
                            : users.length === 0
                                ? <tr>
                                    <td colSpan={5} className='text-center text-text-main/50 p-3'>
                                        Sem contas
                                    </td>
                                </tr>

                                : users.map((user) => (
                                    <tr key={user.uuid} className="border-b border-border-subtle/50 last:border-b-0 hover:bg-white/5 transition">
                                        <td className='p-4'>
                                            <span className='font-semibold text-text-main'>
                                                {user.email}
                                            </span>

                                        </td>

                                        <td className='p-4'>
                                            <span className='
                                        text-text-main/60'>
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className={`p-4 ${user.status === 'active' ? 'text-emerald-400': 'text-amber-400'}`}>
                                            <span className='font-semibold text-text-main'>{user.status === 'active' ? 'Ativo' : 'Pendente'}</span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-5">
                                                <button className='p-1.5 rounded-lg transition hover:text-text-main cursor-pointer'
                                                    onClick={() => handleDeleteUser(user.uuid)}
                                                >

                                                    <Trash2 className='
                                                w-5 
                                                text-red-400/70 
                                                hover:text-red-500/80' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                        }

                    </tbody>
                </table>
            </div>
            <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} onInvite={handleInvite} />
        </>

    )
}

export default AccountsPanel