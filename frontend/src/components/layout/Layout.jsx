// ============================================================
// components/layout/Layout.jsx
// Layout raiz com Navbar + conteúdo da página.
// O <Outlet /> é onde o React Router renderiza a página atual.
// ============================================================

import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl page-enter">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-600 py-4 border-t border-dark-700">
        <span className="font-display">Taça das Casas</span> · CEF 102 Norte · {new Date().getFullYear()}
      </footer>
    </div>
  )
}