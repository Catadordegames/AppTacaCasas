// ============================================================
// pages/professor/MeusLancamentos.jsx
// Professor vê e deleta apenas seus próprios lançamentos.
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { Trash2, List, Filter } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

function formatDate(dt) {
  return new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function MeusLancamentos() {
  const [lancamentos, setLancamentos] = useState([])
  const [casas, setCasas] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletando, setDeletando] = useState(null)
  const [filtroCasa, setFiltroCasa] = useState('')

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const params = filtroCasa ? `?casa_id=${filtroCasa}` : ''
      const [l, c] = await Promise.all([
        api.get(`/lancamentos${params}`),
        api.get('/casas'),
      ])
      setLancamentos(l.data)
      setCasas(c.data)
    } catch {
      toast.error('Erro ao carregar lançamentos.')
    } finally {
      setLoading(false)
    }
  }, [filtroCasa])

  useEffect(() => { carregar() }, [carregar])

  const deletar = async (id) => {
    if (!confirm('Remover este lançamento?')) return
    try {
      setDeletando(id)
      await api.delete(`/lancamentos/${id}`)
      toast.success('Lançamento removido.')
      setLancamentos((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao remover.')
    } finally {
      setDeletando(null)
    }
  }

  const total = lancamentos.reduce((s, l) => s + l.pontuacao, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <List size={24} className="text-gold-400" />
          <h1 className="text-2xl font-display font-bold text-white">Meus Lançamentos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          <select
            className="input py-1.5 text-sm w-44"
            value={filtroCasa}
            onChange={(e) => setFiltroCasa(e.target.value)}
          >
            <option value="">Todas as casas</option>
            {casas.map((c) => <option key={c.id} value={c.id}>{c.brasao} {c.nome}</option>)}
          </select>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card border border-dark-500 text-center">
          <div className="text-2xl font-display font-bold text-gold-400">{lancamentos.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Lançamentos</div>
        </div>
        <div className={`card border text-center ${total >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <div className={`text-2xl font-display font-bold ${total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {total > 0 ? '+' : ''}{total}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Pontos totais</div>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : lancamentos.length === 0 ? (
        <div className="card text-center py-12 text-gray-500 border border-dark-600">
          <List size={36} className="mx-auto mb-3 opacity-30" />
          <p>Nenhum lançamento encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lancamentos.map((l) => (
            <div key={l.id} className="card border border-dark-600 flex items-start gap-3">
              {/* Pontuação */}
              <div className={`flex-shrink-0 w-14 text-center font-display font-bold text-lg rounded-lg py-1
                ${l.pontuacao > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {l.pontuacao > 0 ? '+' : ''}{l.pontuacao}
              </div>

              {/* Detalhes */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{l.justificativa_snapshot}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500">
                  <span>🏠 {l.casa_nome}</span>
                  {l.turma_nome && <span>📚 {l.turma_nome}</span>}
                  {l.aluno_nome && <span>👤 {l.aluno_nome}</span>}
                  <span>🕐 {formatDate(l.data_lancamento)}</span>
                </div>
              </div>

              {/* Botão deletar */}
              <button
                onClick={() => deletar(l.id)}
                disabled={deletando === l.id}
                className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors p-1 disabled:opacity-40"
                title="Remover lançamento"
              >
                {deletando === l.id
                  ? <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin" />
                  : <Trash2 size={16} />
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}