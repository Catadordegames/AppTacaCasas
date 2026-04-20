import { useState, useCallback, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

/**
 * Hook utilitário para chamadas de leitura (GET) assíncronas e limpas.
 * Ideal para listas auxiliares (ex: turmas, casas para select).
 */
export function useFetch(endpoint, autoLoad = true) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(autoLoad)

  const load = useCallback(async (queryParams = '') => {
    try {
      setLoading(true)
      const res = await api.get(`${endpoint}${queryParams ? `?${queryParams}` : ''}`)
      setData(res.data)
      return res.data
    } catch (err) {
      toast.error('Erro de conexão ao buscar dados.')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    if (autoLoad) {
      load()
    }
  }, [load, autoLoad])

  return { data, loading, load, setData }
}
