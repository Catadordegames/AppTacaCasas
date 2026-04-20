// ============================================================
// components/layout/Navbar.jsx
// Barra de navegação responsiva com menu hambúrguer no mobile.
// Mostra itens diferentes dependendo do nível de permissão.
// ============================================================

import { useState, useMemo, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Trophy, Menu, X, LogOut, Shield } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { Button } from './ui'

// Links de navegação
const NAV_LINKS = {
  public: [
    { to: '/', label: 'Placar', icon: '🏆' },
  ],
  professor: [
    { to: '/lancar', label: 'Lançar Pontos' },
    { to: '/meus-lancamentos', label: 'Meus Lançamentos' },
  ],
}

// Links de administração
const ADMIN_LINKS = [
  { to: '/admin/lancamentos', label: 'Lançamentos' },
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
  const [menuAberto, setMenuAberto] = useState(false)

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
          onLogout={handleLogout}
          onClose={closeMenu}
        />
      )}
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

function DesktopNav({ usuario, isAdmin, isActive }) {
  return (
    <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
      <NavLink to="/" isActive={isActive('/')}>Placar</NavLink>

      {usuario && (
        <>
          {NAV_LINKS.professor.map((link) => (
            <NavLink key={link.to} to={link.to} isActive={isActive(link.to)}>
              {link.label}
            </NavLink>
          ))}
        </>
      )}

      {isAdmin && <AdminDropdown />}
    </div>
  )
}

function NavLink({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={`pb-0.5 transition-colors ${isActive
          ? 'text-primary-400 border-b-2 border-primary-400'
          : 'text-gray-400 hover:text-white'
        }`}
    >
      {children}
    </Link>
  )
}

function AdminDropdown() {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 pb-0.5">
        <Shield size={14} />
        Admin
      </button>
      <div
        className="absolute right-0 top-full mt-1 w-48 bg-background-700 border border-background-500 rounded-xl shadow-xl
                   opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
      >
        {ADMIN_LINKS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-background-600 
                       first:rounded-t-xl last:rounded-b-xl transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function DesktopUserActions({ usuario, isAdmin, onLogout }) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <UserBadge usuario={usuario} isAdmin={isAdmin} />
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

function MobileNav({ usuario, isAdmin, isActive, onLogout, onClose }) {
  return (
    <div className="md:hidden bg-background-800 border-t border-background-600 px-4 pb-4 space-y-1">
      <MobileLink to="/" label="🏆 Placar" onClick={onClose} />

      {usuario && (
        <>
          <MobileLink to="/lancar" label="➕ Lançar Pontos" onClick={onClose} />
          <MobileLink
            to="/meus-lancamentos"
            label="📋 Meus Lançamentos"
            onClick={onClose}
          />
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
              onClick={onClose}
            />
          ))}
        </>
      )}

      {usuario ? (
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 text-red-400 hover:bg-background-700 rounded-lg 
                     transition-colors text-sm font-semibold"
        >
          🚪 Sair ({usuario.nome})
        </button>
      ) : (
        <MobileLink to="/login" label="🔐 Entrar" onClick={onClose} />
      )}
    </div>
  )
}

function MobileLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-background-700 
                 rounded-lg transition-colors text-sm font-semibold"
    >
      {label}
    </Link>
  )
}
