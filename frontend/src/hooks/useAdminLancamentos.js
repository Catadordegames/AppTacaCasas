import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function useAdminLancamentos() {
  const [lancamentos, setLancamentos] = useState([])
  const [casas, setCasas] = useState([])
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletando, setDeletando] = useState(null)
  const [resetando, setResetando] = useState(false)
  const [confirmarReset, setConfirmarReset] = useState(false)

  const [filtros, setFiltros] = useState({ casa_id: '', turma_id: '', data_inicio: '', data_fim: '' })
  const setFiltro = (k, v) => setFiltros((f) => ({ ...f, [k]: v }))

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(filtros).forEach(([k, v]) => { if (v) params.append(k, v) })
      // Admin busca todos: força sem filtro de professor_id
      const [l, c, t] = await Promise.all([
        api.get(`/lancamentos?${params}`),
        api.get('/casas'),
        api.get('/turmas'),
      ])
      setLancamentos(l.data); setCasas(c.data); setTurmas(t.data)
    } catch { toast.error('Erro ao carregar lançamentos.') }
    finally { setLoading(false) }
  }, [filtros])

  useEffect(() => { carregar() }, [carregar])

  const deletar = async (id) => {
    if (!confirm('Remover este lançamento permanentemente?')) return
    try {
      setDeletando(id)
      await api.delete(`/lancamentos/${id}`)
      toast.success('Lançamento removido.')
      setLancamentos((prev) => prev.filter((l) => l.id !== id))
    } catch (err) { toast.error(err.response?.data?.error || 'Erro.') }
    finally { setDeletando(null) }
  }

  const exportarCSV = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filtros).forEach(([k, v]) => { if (v) params.append(k, v) })
      const response = await api.get(`/export/lancamentos?${params}`, { responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `lancamentos_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV exportado!')
    } catch { toast.error('Erro ao exportar.') }
  }

  const exportarRanking = async () => {
    try {
      const response = await api.get('/export/ranking', { responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url; a.download = 'ranking.csv'; a.click()
      URL.revokeObjectURL(url)
      toast.success('Ranking exportado!')
    } catch { toast.error('Erro ao exportar ranking.') }
  }

  const resetAnual = async () => {
    try {
      setResetando(true)
      const response = await api.post('/export/reset', { confirmar: true }, { responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup_reset_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ Reset realizado! Backup baixado automaticamente.')
      setConfirmarReset(false)
      carregar()
    } catch { toast.error('Erro ao realizar reset.') }
    finally { setResetando(false) }
  }

  const total = lancamentos.reduce((s, l) => s + l.pontuacao, 0)

  return {
    lancamentos, casas, turmas, loading, deletando, resetando,
    confirmarReset, setConfirmarReset, filtros, setFiltro,
    carregar, deletar, exportarCSV, exportarRanking, resetAnual, total
  }
}
