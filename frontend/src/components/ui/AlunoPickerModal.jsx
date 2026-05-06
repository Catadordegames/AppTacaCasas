// ============================================================
// components/ui/AlunoPickerModal.jsx
// Modal de seleção de aluno com busca por nome.
// Mobile-first: popover sobreposto com lista filtrável.
// ============================================================

import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Search, User, XCircle } from 'lucide-react'

/**
 * @typedef {Object} Aluno
 * @property {number} id
 * @property {string} nome
 * @property {string} [turma_nome]
 * @property {string} [casa_nome]
 */

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onSelect - Callback ao selecionar um aluno
 * @param {Aluno[]} props.alunos - Lista completa de alunos
 */
export default function AlunoPickerModal({ isOpen, onClose, onSelect, alunos = [] }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)

  // Foca no input ao abrir
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      // Timeout para garantir que o modal renderize antes de focar
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

  // Filtra alunos pelo texto digitado
  const filtered = useMemo(() => {
    if (!search.trim()) return alunos
    const term = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return alunos.filter((a) => {
      const nome = a.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      return nome.includes(term)
    })
  }, [alunos, search])

  const handleSelect = (aluno) => {
    onSelect(aluno)
    onClose()
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
          <h3 className="font-display font-semibold text-white text-lg">Selecionar Aluno</h3>
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
              placeholder="Buscar por nome..."
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

        {/* Lista de Alunos */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-500">
              <User size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {search.trim()
                  ? 'Nenhum aluno encontrado.'
                  : 'Nenhum aluno cadastrado.'}
              </p>
            </div>
          ) : (
            <ul className="py-1">
              {filtered.map((aluno) => (
                <li key={aluno.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(aluno)}
                    className="w-full text-left px-5 py-3 hover:bg-background-700 active:bg-background-600 transition-colors flex items-center gap-3 group"
                  >
                    {/* Ícone */}
                    <span className="shrink-0 w-9 h-9 rounded-full bg-background-700 group-hover:bg-primary-500/20 flex items-center justify-center transition-colors">
                      <User size={16} className="text-gray-400 group-hover:text-primary-400 transition-colors" />
                    </span>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{aluno.nome}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        {aluno.turma_nome && <span>{aluno.turma_nome}</span>}
                        {aluno.turma_nome && aluno.casa_nome && <span>•</span>}
                        {aluno.casa_nome && (
                          <span className="text-primary-400/80">{aluno.casa_nome}</span>
                        )}
                      </div>
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
            {filtered.length} de {alunos.length} aluno{alunos.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
