import { SquarePen, Trash2 } from 'lucide-react';
import React, { useState } from 'react'

export interface AccountUser {
    uid: string;
    email: string;
    role: 'admin' | 'editor';
    status?: 'active' | 'pending';
}

const AccountsPanel = ( {}) => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const mockUsers: AccountUser[] = [
  { uid: '1', email: 'admin@harmonia.com', role: 'admin', status: 'active' },
  { uid: '2', email: 'editor@harmonia.com', role: 'editor', status: 'pending' },
];

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
                                                {
                                                    mockUsers.length === 0
                                                        ? <tr>
                                                            <td colSpan={5} className='text-center text-text-main/50 p-3'>
                                                                Sem contas
                                                            </td>
                                                        </tr>
    
                                                        : mockUsers.map((user) => (
                                                            <tr key={user.uid} className="border-b border-border-subtle/50 last:border-b-0 hover:bg-white/5 transition">
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
    
                                                                <td className='p-4'>
                                                                    <span className='font-semibold text-text-main'>{user.status}</span>
                                                                </td>
                                                               
                                                                <td className="p-4">
                                                                    <div className="flex items-center justify-end gap-5">
                                                                        <button className='p-1.5 rounded-lg transition hover:text-text-main cursor-pointer'>
                                                                            <SquarePen className='w-5 text-text-main/60 hover:text-text-main/10 transition' />
                                                                        </button>
    
                                                                        <button className='p-1.5 rounded-lg transition hover:text-text-main cursor-pointer'
                                                                            onClick={() => {}}
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
                                </>
  )
}

export default AccountsPanel