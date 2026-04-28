// ============================================================
// components/layout/Layout.jsx
// Layout raiz com Navbar + conteúdo da página.
// O <Outlet /> é onde o React Router renderiza a página atual.
// ============================================================

import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../Navbar'
import Modal from '../ui/Modal'
import { Button } from '../ui'
import { useAuth } from '../../context/AuthContext'
import { AlertCircle } from 'lucide-react'
import PWAInstallPrompt from '../ui/PWAInstallPrompt'

function SugestaoSenhaModal() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    // Se o usuário logou, não alterou a senha (senha_alterada == 0/false), 
    // não descartou o aviso nesta sessão, e não está já na página de perfil
    if (
      usuario &&
      !usuario.senha_alterada &&
      !sessionStorage.getItem('senhaSugestaoDispensada') &&
      location.pathname !== '/perfil'
    ) {
      setAberto(true)
    } else {
      setAberto(false)
    }
  }, [usuario, location.pathname])

  if (!aberto) return null

  const handleSim = () => {
    setAberto(false)
    navigate('/perfil')
  }

  const handleNao = () => {
    sessionStorage.setItem('senhaSugestaoDispensada', 'true')
    setAberto(false)
  }

  return (
    <Modal title="Sugestão de Segurança" onClose={handleNao}>
      <div className="text-center py-4 space-y-4">
        <div className="flex justify-center text-yellow-400 mb-2">
          <AlertCircle size={48} />
        </div>
        <p className="text-gray-300">
          Notamos que você ainda está usando a senha provisória. Para a segurança da sua conta, recomendamos fortemente que você altere sua senha agora.
        </p>
        <p className="font-semibold text-white">Deseja alterar sua senha agora?</p>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={handleNao} className="flex-1">
            Mais tarde
          </Button>
          <Button variant="primary" onClick={handleSim} className="flex-1">
            Sim, alterar
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl page-enter">
        <Outlet />
      </main>
      <footer className="bg-background-800 border-t border-background-600 py-4 mt-auto">
        <div className="container mx-auto px-4 flex flex-col items-center gap-1">
          <span className="font-display text-xs text-gray-500">
            Taça das Casas · CEF 102 Norte · {new Date().getFullYear()}
          </span>
          <span className="text-[10px] text-gray-600 mt-1">
            Desenvolvido pelos alunos do CEUB:{' '}
            <a href="https://github.com/Catadordegames" target="_blank" rel="noopener noreferrer" className="text-gray-300 underline hover:text-primary-400 transition-colors">Cauê</a> e{' '}
            <a href="https://github.com/oddcaio" target="_blank" rel="noopener noreferrer" className="text-gray-300 underline hover:text-primary-400 transition-colors">Caio</a>
          </span>
        </div>
      </footer>
      <SugestaoSenhaModal />
      <PWAInstallPrompt />
    </div>
  )
}