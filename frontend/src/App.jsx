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
import Dashboard from './views/public/Dashboard'
import Login from './views/public/Login'

// Páginas Professor
import LancarPontos from './views/professor/LancarPontos'

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
  return (
    <AuthProvider>
      <Routes>
        {/* Rota de login — redireciona se já autenticado */}
        <Route path="/login" element={<RotaPublica><Login /></RotaPublica>} />

        {/* Rotas dentro do layout principal com navbar */}
        <Route path="/" element={<Layout />}>
          {/* Página inicial - Dashboard público */}
          <Route index element={<Dashboard />} />

          {/* Professor + Admin */}
          <Route path="lancar" element={<RotaProtegida><LancarPontos /></RotaProtegida>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
