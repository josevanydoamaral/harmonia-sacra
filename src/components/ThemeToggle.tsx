import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        // Tentar pegar o tema salvo
        const savedTheme = localStorage.getItem("theme");

        // Checar se há tema salvo e se houver comparo se é dark e vai retornar true ou false
        if (savedTheme) {
            return savedTheme === 'dark';
        }

        return window.matchMedia('(preferes-color-scheme: dark)').matches;
    })

    useEffect(() => {
        isDark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark])

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className='p-2 rounded-full transition-all duration-300 hover:bg-stone-200 dark:hover:bg-hover-button'
            aria-label='Alternar modo de cor'
        >{isDark ? (
            <Sun className='text-yellow-500' size={20} />
        ) : (
            <Moon className='text-stone-600' size={20} />
        )}
        </button>
    )
}

export default ThemeToggle