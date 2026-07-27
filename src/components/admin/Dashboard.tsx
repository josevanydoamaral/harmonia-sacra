import { SquarePen, Trash2 } from 'lucide-react'
import React from 'react'

const Dashboard = () => {
    return (
        <main className='container-principal py-8 px-4 max-w-6xl mx-auto w-full min-h-screen'>
            <header className='flex justify-between items-center mb-8'>
                <div>
                    <h1 className='text-2xl md:text-3xl font-bold tracking-bold font-title text-accent-gold'>Harmonia Sacra</h1>
                    <p className='text-text-main/60 text-sm mt-0.5'>Painel Administrativo</p>
                </div>
                <div className='flex items-center gap-3'>
                    <span className='text-text-main/60'>Josevany Amaral</span>
                    <div className='w-10 h-10 rounded-full bg-card-surface border border-border-subtle flex items-center justify-center font-semibold text-sm text-text-main'>JS</div>
                </div>
            </header>
            <section className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                <article className="bg-card-surface border border-border-subtle p-5 rounded-2xl">
                    <span className='text-sm text-text-main/60 block mb-2'>Total de Cânticos</span>
                    <p className='text-3xl font-bold text-text-main'>42</p>
                </article>

                <article className="bg-card-surface border border-border-subtle p-5 rounded-2xl">
                    <span className='text-sm text-text-main/60 block mb-2'>Cânticos</span>
                    <p className='text-3xl font-bold text-text-main'>7</p>
                </article>

                <article className="bg-card-surface border border-border-subtle p-5 rounded-2xl">
                    <span className='text-sm text-text-main/60 block mb-2'>Sem áudio completo</span>
                    <p className='text-3xl font-bold text-text-main'>3</p>
                </article>
            </section>
            <div className="flex justify-between items-center mb-4">
                <h2 className='text-xl font-bold text-text-main'>Cânticos</h2>
                <button className='bg-accent-gold text-black font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition hover:cursor-pointer'>+ Adicionar Cântico</button>
            </div>
            <div className="w-full bg-card-surface border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
                <table className='w-full text-left'>
                    <thead className='bg-accent-gold/20'>
                        <tr className='border-b border-border-subtle/60'>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Título</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Categoria</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Vozes</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'>Áudio</th>
                            <th className='p-4 text-xs text-text-main/50 tracking-wider font-medium'></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-border-subtle/50 last:border-b-0 hover:bg-white/5 transition">
                            <td className='p-4'>
                                <span className='font-semibold text-text-main'>
                                    Ave Maria - Schubert
                                </span>
                      
                            </td>
                            <td className='p-4'>
                                <span className='text-text-main/60'>Pentecostes</span>
                            </td>
                            <td className='p-4'>
                                <span className='font-semibold text-text-main'>2</span>
                            </td>
                            <td className='p-4'>
                                <span className='text-sm font-medium text-emerald-400'>Completo</span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-end gap-5">
                                    <button className='p-1.5 rounded-lg transition hover:text-text-main cursor-pointer'>
                                        <SquarePen className='w-5 text-text-main/60 hover:text-text-main/10 transition' />
                                    </button>

                                    <button className='p-1.5 rounded-lg transition hover:text-text-main cursor-pointer'>
                                        <Trash2 className='w-5 text-red-400/70 hover:text-red-500/80' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr className="border-b border-border-subtle/50 last:border-b-0 hover:bg-white/5 transition">
                            <td className='p-4'>
                                <span className='font-semibold text-text-main'>
                                    Ave Maria - 
                                </span>
                                <span className='text-text-main/50 font-normal'>
                                     Schubert
                                </span>
                            </td>
                            <td className='p-4'>
                                <span className='text-text-main/60'>Pentecostes</span>
                            </td>
                            <td className='p-4'>
                                <span className='font-semibold'>2</span>
                            </td>
                            <td className='p-4'>
                                <span className='text-sm font-medium text-emerald-400'>Completo</span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-end gap-2">
                                    <i>oi</i>
                                    <i>oi</i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default Dashboard