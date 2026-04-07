// ============================================================
// App.jsx
// Define toda a estrutura de rotas do sistema com proteção
// de acesso baseada no perfil do usuário autenticado.
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Layout
import Layout from './components/layout/Layout'

// Páginas Públicas
// import Dashboard from './views/public/Dashboard'

// Páginas Professor
import Login from './views/public/Login'
import LancarPontos from './views/professor/LancarPontos'
// import MeusLancamentos from './views/professor/MeusLancamentos'

// Páginas Admin
// import AdminCasas from './views/admin/AdminCasas'
// import AdminTurmas from './views/admin/AdminTurmas'
// import AdminProfessores from './views/admin/AdminProfessores'
// import AdminAlunos from './views/admin/AdminAlunos'
// import AdminJustificativas from './views/admin/AdminJustificativas'
// import AdminLancamentos from './views/admin/AdminLancamentos'

// ── Guards de rota ────────────────────────────────────────────

function RotaProtegida({ children }) {
  // Desativado temporariamente para desenvolvimento sem login
  // const { usuario, loading } = useAuth()
  // if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
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
  return (
    <AuthProvider>
      <Routes>
        {/* Rota de login — redireciona se já autenticado */}
        <Route path="/login" element={<RotaPublica><Login /></RotaPublica>} />

        {/* Rotas dentro do layout principal com navbar */}
        <Route path="/" element={<Layout />}>

          {/* Pública */}
          <Route index element={<Navigate to="/login" replace />} />

          {/* Professor + Admin */}
          <Route path="lancar" element={<RotaProtegida><LancarPontos /></RotaProtegida>} />
          {/* <Route path="meus-lancamentos" element={<RotaProtegida><MeusLancamentos /></RotaProtegida>} /> */}

          {/* Apenas Admin */}
          {/* <Route path="admin/lancamentos"   element={<RotaAdmin><AdminLancamentos /></RotaAdmin>} /> */}
          {/* <Route path="admin/casas"         element={<RotaAdmin><AdminCasas /></RotaAdmin>} /> */}
          {/* <Route path="admin/turmas"        element={<RotaAdmin><AdminTurmas /></RotaAdmin>} /> */}
          {/* <Route path="admin/professores"   element={<RotaAdmin><AdminProfessores /></RotaAdmin>} /> */}
          {/* <Route path="admin/alunos"        element={<RotaAdmin><AdminAlunos /></RotaAdmin>} /> */}
          {/* <Route path="admin/justificativas" element={<RotaAdmin><AdminJustificativas /></RotaAdmin>} /> */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}