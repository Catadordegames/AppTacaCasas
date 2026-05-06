// ============================================================
// components/ui/JustificativaPickerModal.jsx
// Modal de seleção de justificativa com busca por nome.
// Mobile-first: popover sobreposto com lista filtrável.
// ============================================================

import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Search, ClipboardList, XCircle } from 'lucide-react'

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onSelect - Callback ao selecionar uma justificativa
 * @param {Array} props.justificativas - Lista completa de justificativas
 */
export default function JustificativaPickerModal({ isOpen, onClose, onSelect, justificativas = [] }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)

  // Foca no input ao abrir
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Filtra justificativas pelo texto digitado
  const filtered = useMemo(() => {
    if (!search.trim()) return justificativas
    const term = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return justificativas.filter((j) => {
      const nome = j.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      return nome.includes(term)
    })
  }, [justificativas, search])

  const handleSelect = (justificativa) => {
    onSelect(justificativa)
    onClose()
  }

  const formatPontos = (pontos) => {
    const num = Number(pontos)
    return num > 0 ? `+${num}` : `${num}`
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-background-800 border border-background-500 rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl animate-slide-up flex flex-col max-h-[85vh] sm:max-h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-background-600 shrink-0">
          <h3 className="font-display font-semibold text-white text-lg">Selecionar Justificativa</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="px-4 py-3 border-b border-background-600 shrink-0">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              className="input w-full pl-10 pr-10"
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); inputRef.current?.focus() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                aria-label="Limpar busca"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Lista de Justificativas */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-500">
              <ClipboardList size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {search.trim()
                  ? 'Nenhuma justificativa encontrada.'
                  : 'Nenhuma justificativa cadastrada.'}
              </p>
            </div>
          ) : (
            <ul className="py-1">
              {filtered.map((justificativa) => (
                <li key={justificativa.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(justificativa)}
                    className="w-full text-left px-5 py-3 hover:bg-background-700 active:bg-background-600 transition-colors flex items-center gap-3 group"
                  >
                    {/* Badge de pontuação */}
                    <span
                      className={`shrink-0 min-w-[44px] h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                        justificativa.pontos >= 0
                          ? 'bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25'
                          : 'bg-red-500/15 text-red-400 group-hover:bg-red-500/25'
                      }`}
                    >
                      {formatPontos(justificativa.pontos)}
                    </span>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">
                        {justificativa.nome}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {justificativa.pontos >= 0 ? 'Bonificação' : 'Penalidade'}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer com contagem */}
        <div className="px-5 py-2.5 border-t border-background-600 shrink-0">
          <p className="text-xs text-gray-500 text-center">
            {filtered.length} de {justificativas.length} justificativa{justificativas.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
