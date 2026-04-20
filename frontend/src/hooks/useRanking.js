import { useState, useCallback, useEffect } from 'react'
import api from '../services/api'

export function useRanking(pollingIntervalMs = 30000) {
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const carregarRanking = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/ranking')
      setRanking(data)
      setLastUpdate(new Date())
    } catch {
      // Silencioso, página pública não deve estourar erro
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarRanking()
    if (pollingIntervalMs) {
      const interval = setInterval(carregarRanking, pollingIntervalMs)
      return () => clearInterval(interval)
    }
  }, [carregarRanking, pollingIntervalMs])

  return { ranking, loading, lastUpdate, carregarRanking }
}
