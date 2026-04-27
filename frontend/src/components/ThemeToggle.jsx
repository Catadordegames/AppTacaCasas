import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('theme') !== 'dark'
  })

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('theme-light')
      localStorage.setItem('theme', 'light')
    } else {
      document.body.classList.remove('theme-light')
      localStorage.setItem('theme', 'dark')
    }
  }, [isLight])

  return (
    <button
      onClick={() => setIsLight(!isLight)}
      className="p-1.5 rounded-full hover:bg-background-700 transition-colors text-gray-400 hover:text-primary-500 flex items-center justify-center"
      title={isLight ? "Mudar para Tema Escuro" : "Mudar para Tema Claro"}
    >
      {isLight ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}
