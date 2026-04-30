// ============================================================
// context/AuthContext.jsx
// Contexto global de autenticação.
// Disponibiliza { usuario, login, logout, isAdmin, loading }
// para qualquer componente da árvore via useAuth().
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  // Recupera sessão salva no localStorage ao recarregar a página
  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioSalvo = localStorage.getItem('usuario')
    if (token && usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo))
      } catch {
        localStorage.clear()
      }
    }
    setLoading(false)
  }, [])

  const login = async (identificador, senha) => {
    const { data } = await api.post('/auth/login', { identificador, senha })
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    setUsuario(data.usuario)
    return data.usuario
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  const permissao = Number(usuario?.permissao)
  const isAdmin = permissao === 1
  const isProfessor = permissao === 2 || isAdmin

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAdmin, isProfessor, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}