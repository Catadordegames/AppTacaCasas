import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Impede o Chrome de mostrar o mini-infobar padrão automaticamente
      e.preventDefault()
      // Guarda o evento para usarmos no nosso botão
      setDeferredPrompt(e)
      // Mostra nossa interface personalizada
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Se o app já foi instalado, não precisa mostrar
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostra o prompt nativo do navegador
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    // Independentemente da escolha, limpa o prompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-primary-600 text-white p-4 rounded-2xl shadow-2xl z-[100] flex items-center justify-between border border-primary-500 animate-in slide-in-from-bottom-5">
      <div className="flex flex-col pr-2">
        <span className="font-bold text-sm">Instalar Aplicativo</span>
        <span className="text-xs text-primary-100">Adicione à tela inicial para acesso rápido!</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 bg-white text-primary-600 px-3 py-1.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm"
        >
          <Download size={16} /> Instalar
        </button>
        <button 
          onClick={() => setShowPrompt(false)}
          className="text-primary-200 hover:text-white p-1 transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
