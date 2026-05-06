// ============================================================
// components/layout/Navbar.jsx
// Barra de navegação responsiva com menu hambúrguer no mobile.
// Mostra itens diferentes dependendo do nível de permissão.
// Adicionado Modal de Reset Anual para Admins.
// ============================================================

import { useState, useMemo, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Trophy, Menu, X, LogOut, Shield, User, AlertTriangle } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useGuardedNavigation } from '../context/NavigationGuardContext'
import { Button, Input } from './ui'
import Modal from './ui/Modal'
import ThemeToggle from './ThemeToggle'
import { downloadBlobFromApi } from '../utils/downloadHelper'

// Links de navegação
const NAV_LINKS = {
  public: [
    { to: '/', label: 'Placar', icon: '🏆' },
  ],
  professor: [
    { to: '/lancar', label: 'Lançar Pontos' },
    { to: '/lancamentos', label: 'Lançamentos' },
  ],
}

// Links de administração
const ADMIN_LINKS = [
  { to: '/cadastro-rapido', label: 'Cadastro Rápido' },
  { to: '/admin/casas', label: 'Casas' },
  { to: '/admin/turmas', label: 'Turmas' },
  { to: '/admin/professores', label: 'Professores' },
  { to: '/admin/alunos', label: 'Alunos' },
  { to: '/admin/justificativas', label: 'Justificativas' },
]

export default function Navbar() {
  const { usuario, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { guardedNavigate } = useGuardedNavigation()
  const [menuAberto, setMenuAberto] = useState(false)
  const [resetModalAberto, setResetModalAberto] = useState(false)

  const handleLogout = useCallback(() => {
    logout()
    navigate('/')
    setMenuAberto(false)
  }, [logout, navigate])

  const isActive = useCallback((path) => location.pathname === path, [location.pathname])

  const toggleMenu = useCallback(() => {
    setMenuAberto((prev) => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuAberto(false)
  }, [])

  return (
    <nav className="bg-background-800 border-b border-background-600 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Logo />

          {/* Links desktop */}
          <DesktopNav
            usuario={usuario}
            isAdmin={isAdmin}
            isActive={isActive}
            guardedNavigate={guardedNavigate}
            onOpenReset={() => setResetModalAberto(true)}
          />

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            {usuario ? (
              <DesktopUserActions
                usuario={usuario}
                isAdmin={isAdmin}
                onLogout={handleLogout}
              />
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="primary"
                size="sm"
                className="hidden md:flex"
              >
                Entrar
              </Button>
            )}

            {/* Alternador de Tema */}
            <ThemeToggle />

            {/* Botão menu mobile */}
            <MobileMenuButton isOpen={menuAberto} onClick={toggleMenu} />
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <MobileNav
          usuario={usuario}
          isAdmin={isAdmin}
          isActive={isActive}
          guardedNavigate={guardedNavigate}
          onLogout={handleLogout}
          onClose={closeMenu}
          onOpenReset={() => {
            setResetModalAberto(true)
            closeMenu()
          }}
        />
      )}

      {/* Modal de Reset de Ano Letivo */}
      <ResetAnualModal 
        isOpen={resetModalAberto} 
        onClose={() => setResetModalAberto(false)} 
      />
    </nav>
  )
}

// ============================================================
// Sub-components
// ============================================================

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-display font-bold text-primary-400 text-lg"
    >
      <Trophy size={22} />
      <span className="hidden sm:inline">Taça das Casas</span>
      <span className="sm:hidden">Taça</span>
    </Link>
  )
}

function DesktopNav({ usuario, isAdmin, isActive, guardedNavigate, onOpenReset }) {
  return (
    <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
      <NavLink to="/" isActive={isActive('/')} guardedNavigate={guardedNavigate}>Placar</NavLink>

      {usuario && (
        <>
          {NAV_LINKS.professor.map((link) => (
            <NavLink key={link.to} to={link.to} isActive={isActive(link.to)} guardedNavigate={guardedNavigate}>
              {link.label}
            </NavLink>
          ))}
        </>
      )}

      {isAdmin && <AdminDropdown guardedNavigate={guardedNavigate} onOpenReset={onOpenReset} />}
    </div>
  )
}

function NavLink({ to, children, isActive, guardedNavigate }) {
  return (
    <a
      href={to}
      onClick={(e) => { e.preventDefault(); guardedNavigate(to) }}
      className={`pb-0.5 transition-colors cursor-pointer ${isActive
        ? 'text-primary-400 border-b-2 border-primary-400'
        : 'text-gray-400 hover:text-white'
        }`}
    >
      {children}
    </a>
  )
}

function AdminDropdown({ guardedNavigate, onOpenReset }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 pb-0.5">
        <Shield size={14} />
        Admin
      </button>
      <div
        className="absolute right-0 top-full mt-1 w-56 bg-background-700 border border-background-500 rounded-xl shadow-xl
                   opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden"
      >
        {ADMIN_LINKS.map((item) => (
          <a
            key={item.to}
            href={item.to}
            onClick={(e) => { e.preventDefault(); guardedNavigate(item.to) }}
            className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-background-600 transition-colors cursor-pointer"
          >
            {item.label}
          </a>
        ))}
        <div className="border-t border-background-600 mt-1">
          <button 
            onClick={onOpenReset}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 font-bold hover:bg-red-500/10 transition-colors"
          >
            ⚠️ Reiniciar Ano Letivo
          </button>
        </div>
      </div>
    </div>
  )
}

function DesktopUserActions({ usuario, isAdmin, onLogout }) {
  const { guardedNavigate } = useGuardedNavigation()
  return (
    <div className="hidden md:flex items-center gap-3">
      <UserBadge usuario={usuario} isAdmin={isAdmin} />
      <a
        href="/perfil"
        onClick={(e) => { e.preventDefault(); guardedNavigate('/perfil') }}
        className="text-gray-500 hover:text-primary-400 transition-colors cursor-pointer"
        title="Meu Perfil"
      >
        <User size={18} />
      </a>
      <button
        onClick={onLogout}
        className="text-gray-500 hover:text-red-400 transition-colors"
        title="Sair"
      >
        <LogOut size={18} />
      </button>
    </div>
  )
}

function UserBadge({ usuario, isAdmin }) {
  return (
    <span className="text-xs text-gray-500">
      {usuario.nome}
      <span
        className={`ml-1.5 px-1.5 py-0.5 rounded text-xs font-bold ${isAdmin
          ? 'bg-purple-900 text-purple-300'
          : 'bg-background-600 text-gray-400'
          }`}
      >
        {isAdmin ? 'ADMIN' : 'PROF'}
      </span>
    </span>
  )
}

function MobileMenuButton({ isOpen, onClick }) {
  return (
    <button
      className="md:hidden text-gray-400 hover:text-white p-1"
      onClick={onClick}
      aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
    >
      {isOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  )
}

function MobileNav({ usuario, isAdmin, isActive, guardedNavigate, onLogout, onClose, onOpenReset }) {
  return (
    <div className="md:hidden bg-background-800 border-t border-background-600 px-4 pb-4 space-y-1">
      <MobileLink to="/" label="🏆 Placar" guardedNavigate={guardedNavigate} onClick={onClose} />

      {usuario && (
        <>
          <MobileLink to="/lancar" label="➕ Lançar Pontos" guardedNavigate={guardedNavigate} onClick={onClose} />
          <MobileLink to="/lancamentos" label="📋 Lançamentos" guardedNavigate={guardedNavigate} onClick={onClose} />
        </>
      )}

      {isAdmin && (
        <>
          <div className="text-xs font-bold text-purple-400 uppercase pt-2 pb-1 px-3">
            Admin
          </div>
          {ADMIN_LINKS.map((link) => (
            <MobileLink
              key={link.to}
              to={link.to}
              label={link.label}
              guardedNavigate={guardedNavigate}
              onClick={onClose}
            />
          ))}
          <button
            onClick={onOpenReset}
            className="w-full text-left px-3 py-2 text-red-400 hover:bg-background-700 rounded-lg 
                       transition-colors text-sm font-bold"
          >
            ⚠️ Reiniciar Ano Letivo
          </button>
        </>
      )}

      {usuario ? (
        <>
          <MobileLink to="/perfil" label="👤 Meu Perfil" guardedNavigate={guardedNavigate} onClick={onClose} />
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 text-red-400 hover:bg-background-700 rounded-lg 
                       transition-colors text-sm font-semibold"
          >
            🚪 Sair ({usuario.nome})
          </button>
        </>
      ) : (
        <MobileLink to="/login" label="🔐 Entrar" guardedNavigate={guardedNavigate} onClick={onClose} />
      )}
    </div>
  )
}

function MobileLink({ to, label, guardedNavigate, onClick }) {
  return (
    <a
      href={to}
      onClick={(e) => { e.preventDefault(); guardedNavigate(to); onClick() }}
      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-background-700 
                 rounded-lg transition-colors text-sm font-semibold cursor-pointer"
    >
      {label}
    </a>
  )
}

// ============================================================
// Modal de Reset Anual
// ============================================================

function ResetAnualModal({ isOpen, onClose }) {
  const [senha, setSenha] = useState('')
  const [frase, setFrase] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (frase !== 'REINICIAR_PONTUACAO') return
    setLoading(true)
    try {
      await downloadBlobFromApi('/export/reset', 'backup_reset.csv', {
        method: 'POST',
        body: { confirmar: true, senha }
      })
      alert('Ano letivo reiniciado com sucesso! Os lançamentos foram apagados e o backup salvo e baixado.')
      window.location.reload()
    } catch (e) {
      alert(e.response?.data?.error || 'Falha ao reiniciar. Verifique a senha e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Reseta os campos ao fechar
  const handleClose = () => {
    setSenha('')
    setFrase('')
    onClose()
  }

  return (
    <Modal title="Zona de Perigo" onClose={handleClose}>
      <div className="space-y-6 text-center">
        <div className="flex justify-center text-red-500">
          <AlertTriangle size={64} />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-red-400 mb-2 uppercase">TEM CERTEZA?</h2>
          <p className="text-sm text-gray-300 text-left bg-red-900/20 p-4 rounded-xl border border-red-900/50">
            Esta operação irá <strong>APAGAR PERMANENTEMENTE todos os lançamentos de pontos</strong> do banco de dados para iniciar uma nova temporada de gincana. 
            Antes de deletar, o sistema gerará automaticamente uma planilha CSV com os dados atuais.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <Input 
            label="Para continuar, digite exatamente: REINICIAR_PONTUACAO" 
            value={frase}
            onChange={(e) => setFrase(e.target.value)}
            placeholder="REINICIAR_PONTUACAO"
            disabled={loading}
          />
          <Input 
            label="Sua senha de Administrador" 
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha..."
            disabled={loading}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirm} 
            disabled={frase !== 'REINICIAR_PONTUACAO' || !senha || loading}
            className="flex-1 bg-red-600 hover:bg-red-500 border-none text-white"
            loading={loading}
          >
            Apagar Tudo
          </Button>
        </div>
      </div>
    </Modal>
  )
}
