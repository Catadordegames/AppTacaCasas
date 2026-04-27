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
      <footer className="bg-background-800 border-t border-background-600 text-center text-xs text-gray-500 py-4 mt-auto">
        <span className="font-display">Taça das Casas</span> · CEF 102 Norte · {new Date().getFullYear()}
      </footer>
    </div>
  )
}