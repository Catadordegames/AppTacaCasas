// ============================================================
// context/NavigationGuardContext.jsx
// Contexto para bloquear navegação quando há dados não salvos.
// Funciona com BrowserRouter (sem precisar de Data Router API).
// ============================================================

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import { AlertTriangle } from 'lucide-react'

const NavigationGuardContext = createContext(null)

export function NavigationGuardProvider({ children }) {
  // guard: { message, count } ou null quando não há dados a proteger
  const guardRef = useRef(null)
  const [pending, setPending] = useState(null) // { path }

  const registerGuard = useCallback((guardData) => {
    guardRef.current = guardData
  }, [])

  const clearGuard = useCallback(() => {
    guardRef.current = null
  }, [])

  /**
   * Tenta navegar para um path. Se há guard ativo, abre modal de confirmação.
   * Retorna true se navegou diretamente, false se bloqueou.
   */
  const tryNavigate = useCallback((path) => {
    if (guardRef.current) {
      setPending({ path })
      return false
    }
    return true
  }, [])

  const cancelNavigation = useCallback(() => {
    setPending(null)
  }, [])

  const confirmNavigation = useCallback(() => {
    const path = pending?.path
    guardRef.current = null
    setPending(null)
    return path
  }, [pending])

  return (
    <NavigationGuardContext.Provider value={{ registerGuard, clearGuard, tryNavigate, pending, cancelNavigation, confirmNavigation }}>
      {children}
    </NavigationGuardContext.Provider>
  )
}

/**
 * Hook para registrar um guard de navegação (ex: rascunho não salvo).
 * Uso: useNavigationGuard(rascunho.length > 0, rascunho.length)
 */
export function useNavigationGuard(active, count = 0) {
  const ctx = useContext(NavigationGuardContext)
  if (!ctx) return {} // Se não está dentro do provider, não faz nada

  // Registra/limpa o guard baseado no estado
  if (active) {
    ctx.registerGuard({ count })
  } else {
    ctx.clearGuard()
  }

  return ctx
}

/**
 * Hook para a Navbar usar ao navegar.
 * Retorna tryNavigate e o estado do modal de confirmação.
 */
export function useGuardedNavigation() {
  const ctx = useContext(NavigationGuardContext)
  const navigate = useNavigate()

  const guardedNavigate = useCallback((path) => {
    if (!ctx) {
      navigate(path)
      return
    }
    const allowed = ctx.tryNavigate(path)
    if (allowed) {
      navigate(path)
    }
  }, [ctx, navigate])

  const confirmAndNavigate = useCallback(() => {
    if (!ctx) return
    const path = ctx.confirmNavigation()
    if (path) navigate(path)
  }, [ctx, navigate])

  const cancelNavigation = useCallback(() => {
    if (!ctx) return
    ctx.cancelNavigation()
  }, [ctx])

  return {
    guardedNavigate,
    isPending: !!ctx?.pending,
    pendingCount: ctx?.pending ? undefined : 0,
    confirmAndNavigate,
    cancelNavigation,
  }
}

/**
 * Modal de confirmação de navegação — renderizar no Layout.
 */
export function NavigationGuardModal() {
  const ctx = useContext(NavigationGuardContext)
  const navigate = useNavigate()

  if (!ctx?.pending) return null

  const handleConfirm = () => {
    const path = ctx.confirmNavigation()
    if (path) navigate(path)
  }

  return (
    <Modal title="Dados não salvos" onClose={ctx.cancelNavigation}>
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-gray-300">
            Você tem dados na lista de rascunho que ainda não foram salvos.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Se sair desta página agora, esses dados serão perdidos e não poderão ser recuperados.
          </p>
        </div>
      </div>
      <div className="flex gap-2 pt-4 border-t border-background-600">
        <button onClick={ctx.cancelNavigation} className="btn-secondary flex-1">
          Ficar na Página
        </button>
        <button
          onClick={handleConfirm}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg font-bold transition-colors flex-1 shadow-md shadow-amber-500/20"
        >
          Sair e Perder Dados
        </button>
      </div>
    </Modal>
  )
}
