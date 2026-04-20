import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function useMeusLancamentos() {
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

  return {
    lancamentos,
    casas,
    loading,
    deletando,
    filtroCasa,
    setFiltroCasa,
    total,
    deletar
  }
}
