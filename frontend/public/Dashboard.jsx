// ============================================================
// pages/public/Dashboard.jsx
// Página pública do placar — o coração do sistema.
// Acessível sem login para alunos, pais e toda a comunidade.
// ============================================================

import { useEffect, useState } from 'react'
import { Trophy, TrendingUp, Star, RefreshCw } from 'lucide-react'
import api from '../../services/api'

const MEDAL_COLORS = [
  { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', medal: '🥇' },
  { bg: 'bg-gray-400/10',   border: 'border-gray-400/30',   text: 'text-gray-400',   medal: '🥈' },
  { bg: 'bg-amber-700/10',  border: 'border-amber-700/30',  text: 'text-amber-600',  medal: '🥉' },
]

export default function Dashboard() {
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const carregarRanking = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/ranking')
      setRanking(data)
      setLastUpdate(new Date())
    } catch {
      // silencioso — página pública não deve mostrar erros técnicos
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarRanking()
    // Atualiza a cada 30 segundos (tempo real)
    const interval = setInterval(carregarRanking, 30000)
    return () => clearInterval(interval)
  }, [])

  const maxPontos = ranking[0]?.total_pontos || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <div className="flex items-center justify-center gap-3">
          <Trophy size={32} className="text-gold-400" />
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gold-400">
            Taça das Casas
          </h1>
          <Trophy size={32} className="text-gold-400" />
        </div>
        <p className="text-gray-400 text-sm">CEF 102 Norte · Placar em tempo real</p>
        {lastUpdate && (
          <p className="text-gray-600 text-xs">
            Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        )}
      </div>

      {/* Botão de atualizar */}
      <div className="flex justify-end">
        <button
          onClick={carregarRanking}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold-400 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Loading */}
      {loading && ranking.length === 0 && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Ranking */}
      <div className="space-y-3">
        {ranking.map((casa, index) => {
          const style = MEDAL_COLORS[index] || { bg: 'bg-dark-700/50', border: 'border-dark-600', text: 'text-gray-500', medal: `${index + 1}º` }
          const barWidth = Math.max(4, (casa.total_pontos / maxPontos) * 100)

          return (
            <div
              key={casa.id}
              className={`card border ${style.border} ${style.bg} transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className="flex items-center gap-4">
                {/* Posição / medalha */}
                <div className={`text-2xl w-10 text-center flex-shrink-0`}>
                  {typeof style.medal === 'string' && style.medal.includes('º')
                    ? <span className={`font-display font-bold text-lg ${style.text}`}>{style.medal}</span>
                    : style.medal
                  }
                </div>

                {/* Brasão + Nome */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-3xl leading-none">{casa.brasao}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-bold text-white text-lg leading-tight truncate">
                      {casa.nome}
                    </h2>
                    <p className="text-xs text-gray-500">{casa.total_lancamentos} lançamento{casa.total_lancamentos !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Pontuação */}
                <div className="text-right flex-shrink-0">
                  <div className={`font-display font-bold text-2xl ${style.text}`}>
                    {casa.total_pontos.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-500">pontos</div>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="mt-3 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-dark-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {ranking.length === 0 && !loading && (
        <div className="card text-center py-12 text-gray-500">
          <Trophy size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhum dado de pontuação ainda.</p>
          <p className="text-sm mt-1">Os lançamentos aparecerão aqui em tempo real.</p>
        </div>
      )}
    </div>
  )
}