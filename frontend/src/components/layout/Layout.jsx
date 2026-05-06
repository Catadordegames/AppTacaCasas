// ============================================================
// components/layout/Layout.jsx
// Layout raiz com Navbar + conteúdo da página.
// O <Outlet /> é onde o React Router renderiza a página atual.
// ============================================================

import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../Navbar'
import Modal from '../ui/Modal'
import { Button, Input } from '../ui'
import { useAuth } from '../../context/AuthContext'
import { NavigationGuardProvider, NavigationGuardModal } from '../../context/NavigationGuardContext'
import { AlertCircle, ShieldCheck } from 'lucide-react'
import PWAInstallPrompt from '../ui/PWAInstallPrompt'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { formatCPF } from '../../utils/formatters'
import { isValidCPF } from '../../utils/validators'

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

/**
 * Modal obrigatório de cadastro de CPF.
 * Aparece quando o usuário logado não tem CPF cadastrado (cpf === null).
 * Não pode ser fechado — o professor é obrigado a preencher.
 */
function CadastroCPFModal() {
  const { usuario, refreshUsuario } = useAuth()
  const [cpf, setCpf] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  // Não exibir se o usuário já tem CPF
  if (!usuario || usuario.cpf) return null

  const handleChange = (e) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
    if (erro) setErro('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const cpfLimpo = cpf.replace(/\D/g, '')

    if (!isValidCPF(cpfLimpo)) {
      setErro('CPF inválido. Verifique os dígitos.')
      return
    }

    try {
      setSalvando(true)
      const { data } = await api.put('/perfil/cpf', { cpf: cpfLimpo })
      toast.success('CPF cadastrado com sucesso!')
      // Atualiza o contexto sem re-login
      refreshUsuario({ cpf: data.cpf })
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao cadastrar CPF.'
      setErro(msg)
      toast.error(msg)
    } finally {
      setSalvando(false)
    }
  }

  // Usando um overlay manual em vez do Modal genérico, pois este não pode ser fechado
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-background-800 border border-background-500 rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="px-5 py-4 border-b border-background-600">
          <h3 className="font-display font-semibold text-white text-lg text-center">
            Cadastro de CPF Obrigatório
          </h3>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="flex justify-center text-primary-400">
            <ShieldCheck size={48} />
          </div>

          <p className="text-gray-300 text-sm text-center">
            Olá, <span className="text-white font-medium">{usuario.nome}</span>! Para continuar usando o sistema, é necessário cadastrar seu CPF. Essa informação é utilizada para identificação segura.
          </p>

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleChange}
            error={erro}
            required
            maxLength={14}
            autoFocus
          />

          <Button
            type="submit"
            loading={salvando}
            disabled={salvando || cpf.replace(/\D/g, '').length < 11}
            fullWidth
          >
            {salvando ? 'Cadastrando...' : 'Cadastrar CPF'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function Layout() {
  return (
    <NavigationGuardProvider>
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
        <CadastroCPFModal />
        <NavigationGuardModal />
        <PWAInstallPrompt />
      </div>
    </NavigationGuardProvider>
  )
}