// ============================================================
// App.jsx
// Define toda a estrutura de rotas do sistema com proteção
// de acesso baseada no perfil do usuário autenticado.
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useEffect } from 'react'

// Layout
import Layout from './components/layout/Layout'

// Páginas Públicas
import Dashboard from './views/public/Dashboard'
import Login from './views/public/Login'

// Páginas Professor
import LancarPontos from './views/professor/LancarPontos'
import ListagemLancamentos from './views/professor/ListagemLancamentos'

// Páginas Admin
import CadastroRapido from './views/admin/CadastroRapido'
import AdminAlunos from './views/admin/AdminAlunos'
import AdminCasas from './views/admin/AdminCasas'
import AdminTurmas from './views/admin/AdminTurmas'
import AdminProfessores from './views/admin/AdminProfessores'
import AdminJustificativas from './views/admin/AdminJustificativas'

// ── Guards de rota ────────────────────────────────────────────

function RotaProtegida({ children }) {
  // Desativado temporariamente para desenvolvimento sem login
  // const { usuario, loading } = useAuth()
  // if (loading) return <LoadingScreen />
  // return usuario ? children : <Navigate to="/login" replace />
  return children
}

function RotaAdmin({ children }) {
  // Desativado temporariamente para desenvolvimento sem login
  // const { usuario, loading, isAdmin } = useAuth()
  // if (loading) return null
  // if (!usuario) return <Navigate to="/login" replace />
  // if (!isAdmin) return <Navigate to="/" replace />
  return children
}

function RotaPublica({ children }) {
  const { usuario } = useAuth()
  return usuario ? <Navigate to="/lancar" replace /> : children
}

// ── Componente principal ──────────────────────────────────────

export default function App() {
  useEffect(() => {
    if (localStorage.getItem('theme') !== 'dark') {
      document.body.classList.add('theme-light')
    }
  }, [])

  return (
    <AuthProvider>
      <Routes>
        {/* Rota de login — redireciona se já autenticado */}
        <Route path="/login" element={<RotaPublica><Login /></RotaPublica>} />

        {/* Rotas dentro do layout principal com navbar */}
        <Route path="/" element={<Layout />}>
          {/* Página inicial - Dashboard público */}
          <Route index element={<Dashboard />} />

          {/* Públicas */}
          <Route path="lancamentos" element={<RotaProtegida><ListagemLancamentos /></RotaProtegida>} />

          {/* Professor + Admin */}
          <Route path="lancar" element={<RotaProtegida><LancarPontos /></RotaProtegida>} />

          {/* Admin apenas */}
          <Route path="cadastro-rapido" element={<RotaAdmin><CadastroRapido /></RotaAdmin>} />
          <Route path="admin/alunos" element={<RotaAdmin><AdminAlunos /></RotaAdmin>} />
          <Route path="admin/casas" element={<RotaAdmin><AdminCasas /></RotaAdmin>} />
          <Route path="admin/turmas" element={<RotaAdmin><AdminTurmas /></RotaAdmin>} />
          <Route path="admin/professores" element={<RotaAdmin><AdminProfessores /></RotaAdmin>} />
          <Route path="admin/justificativas" element={<RotaAdmin><AdminJustificativas /></RotaAdmin>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
