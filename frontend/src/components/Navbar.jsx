// ============================================================
// components/layout/Navbar.jsx
// Barra de navegação responsiva com menu hambúrguer no mobile.
// Mostra itens diferentes dependendo do nível de permissão.
// ============================================================

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Trophy, Menu, X, LogOut, PlusCircle, List, Shield } from 'lucide-react'

export default function Navbar() {
  const { usuario, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuAberto(false)
  }

  const isActive = (path) =>
    location.pathname === path
      ? 'text-gold-400 border-b-2 border-gold-400'
      : 'text-gray-400 hover:text-white'

  return (
    <nav className="bg-dark-800 border-b border-dark-600 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-gold-400 text-lg">
            <Trophy size={22} />
            <span className="hidden sm:inline">Taça das Casas</span>
            <span className="sm:hidden">Taça</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link to="/" className={`pb-0.5 transition-colors ${isActive('/')}`}>Placar</Link>

            {usuario && (
              <>
                <Link to="/lancar" className={`pb-0.5 transition-colors ${isActive('/lancar')}`}>
                  Lançar Pontos
                </Link>
                <Link to="/meus-lancamentos" className={`pb-0.5 transition-colors ${isActive('/meus-lancamentos')}`}>
                  Meus Lançamentos
                </Link>
              </>
            )}

            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 pb-0.5">
                  <Shield size={14} />
                  Admin
                </button>
                {/* Dropdown admin */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-dark-700 border border-dark-500 rounded-xl shadow-xl
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {[
                    { to: '/admin/lancamentos', label: 'Lançamentos' },
                    { to: '/admin/casas', label: 'Casas' },
                    { to: '/admin/turmas', label: 'Turmas' },
                    { to: '/admin/professores', label: 'Professores' },
                    { to: '/admin/alunos', label: 'Alunos' },
                    { to: '/admin/justificativas', label: 'Justificativas' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-600 first:rounded-t-xl last:rounded-b-xl transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            {usuario ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {usuario.nome}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs font-bold ${isAdmin ? 'bg-purple-900 text-purple-300' : 'bg-dark-600 text-gray-400'}`}>
                    {isAdmin ? 'ADMIN' : 'PROF'}
                  </span>
                </span>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors" title="Sair">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block btn-primary text-sm py-1.5">
                Entrar
              </Link>
            )}

            {/* Botão menu mobile */}
            <button
              className="md:hidden text-gray-400 hover:text-white p-1"
              onClick={() => setMenuAberto(!menuAberto)}
            >
              {menuAberto ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div className="md:hidden bg-dark-800 border-t border-dark-600 px-4 pb-4 space-y-1">
          <MobileLink to="/" label="🏆 Placar" onClick={() => setMenuAberto(false)} />
          {usuario && (
            <>
              <MobileLink to="/lancar" label="➕ Lançar Pontos" onClick={() => setMenuAberto(false)} />
              <MobileLink to="/meus-lancamentos" label="📋 Meus Lançamentos" onClick={() => setMenuAberto(false)} />
            </>
          )}
          {isAdmin && (
            <>
              <div className="text-xs font-bold text-purple-400 uppercase pt-2 pb-1 px-3">Admin</div>
              <MobileLink to="/admin/lancamentos"    label="Lançamentos"    onClick={() => setMenuAberto(false)} />
              <MobileLink to="/admin/casas"          label="Casas"          onClick={() => setMenuAberto(false)} />
              <MobileLink to="/admin/turmas"         label="Turmas"         onClick={() => setMenuAberto(false)} />
              <MobileLink to="/admin/professores"    label="Professores"    onClick={() => setMenuAberto(false)} />
              <MobileLink to="/admin/alunos"         label="Alunos"         onClick={() => setMenuAberto(false)} />
              <MobileLink to="/admin/justificativas" label="Justificativas" onClick={() => setMenuAberto(false)} />
            </>
          )}
          {usuario ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-red-400 hover:bg-dark-700 rounded-lg transition-colors text-sm font-semibold"
            >
              🚪 Sair ({usuario.nome})
            </button>
          ) : (
            <MobileLink to="/login" label="🔐 Entrar" onClick={() => setMenuAberto(false)} />
          )}
        </div>
      )}
    </nav>
  )
}

function MobileLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors text-sm font-semibold"
    >
      {label}
    </Link>
  )
}