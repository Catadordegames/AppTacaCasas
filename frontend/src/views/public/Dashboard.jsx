// ============================================================
// views/public/Dashboard.jsx
// Página pública do placar — o coração do sistema.
// Acessível sem login para alunos, pais e toda a comunidade.
// ============================================================

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Trophy, RefreshCw } from 'lucide-react'

import api from '../../services/api'
import { Card, LoadingSpinner, Button } from '../../components/ui'
import { formatNumber } from '../../utils/formatters'
import { cn } from '../../utils/cn'

// Cores das medalhas para os 3 primeiros lugares
const MEDAL_COLORS = [
  { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', medal: '🥇', bar: 'bg-yellow-400' },
  { bg: 'bg-gray-400/10', border: 'border-gray-400/30', text: 'text-gray-400', medal: '🥈', bar: 'bg-gray-400' },
  { bg: 'bg-amber-700/10', border: 'border-amber-700/30', text: 'text-amber-600', medal: '🥉', bar: 'bg-amber-600' },
]

const POLLING_INTERVAL = 30000 // 30 segundos

export default function Dashboard() {
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
      // silencioso — página pública não deve mostrar erros técnicos
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarRanking()
    const interval = setInterval(carregarRanking, POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [carregarRanking])

  const maxPontos = useMemo(() => ranking[0]?.total_pontos || 1, [ranking])

  return (
    <div className="space-y-6">
      <DashboardHeader lastUpdate={lastUpdate} />

      <div className="flex justify-end">
        <RefreshButton onClick={carregarRanking} loading={loading} />
      </div>

      {loading && ranking.length === 0 && <LoadingState />}

      <RankingList ranking={ranking} maxPontos={maxPontos} />

      {!loading && ranking.length === 0 && <EmptyState />}
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

function DashboardHeader({ lastUpdate }) {
  return (
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
  )
}

function RefreshButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold-400 transition-colors"
    >
      <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
      Atualizar
    </button>
  )
}

function LoadingState() {
  return (
    <div className="flex justify-center py-16">
      <LoadingSpinner size="lg" />
    </div>
  )
}

function RankingList({ ranking, maxPontos }) {
  return (
    <div className="space-y-3">
      {ranking.map((casa, index) => (
        <RankingItem
          key={casa.id}
          casa={casa}
          index={index}
          maxPontos={maxPontos}
        />
      ))}
    </div>
  )
}

function RankingItem({ casa, index, maxPontos }) {
  const style = MEDAL_COLORS[index] || {
    bg: 'bg-dark-700/50',
    border: 'border-dark-600',
    text: 'text-gray-500',
    medal: `${index + 1}º`,
    bar: 'bg-dark-500',
  }

  const barWidth = Math.max(4, (casa.total_pontos / maxPontos) * 100)

  return (
    <Card
      className={cn(
        style.bg,
        'transition-all duration-300 hover:scale-[1.01]'
      )}
      border
      borderClass={style.border}
    >
      <div className="flex items-center gap-4">
        {/* Posição / medalha */}
        <MedalBadge index={index} style={style} />

        {/* Brasão + Nome */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-3xl leading-none">{casa.brasao}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-white text-lg leading-tight truncate">
              {casa.nome}
            </h2>
            <p className="text-xs text-gray-500">
              {casa.total_lancamentos} lançamento{casa.total_lancamentos !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Pontuação */}
        <div className="text-right flex-shrink-0">
          <div className={cn('font-display font-bold text-2xl', style.text)}>
            {formatNumber(casa.total_pontos)}
          </div>
          <div className="text-xs text-gray-500">pontos</div>
        </div>
      </div>

      {/* Barra de progresso */}
      <ProgressBar width={barWidth} color={style.bar} />
    </Card>
  )
}

function MedalBadge({ index, style }) {
  const isNumeric = typeof style.medal === 'string' && style.medal.includes('º')

  return (
    <div className="text-2xl w-10 text-center flex-shrink-0">
      {isNumeric ? (
        <span className={cn('font-display font-bold text-lg', style.text)}>
          {style.medal}
        </span>
      ) : (
        style.medal
      )}
    </div>
  )
}

function ProgressBar({ width, color }) {
  return (
    <div className="mt-3 h-1.5 bg-dark-700 rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-1000', color)}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="text-center py-12 text-gray-500">
      <Trophy size={40} className="mx-auto mb-3 opacity-30" />
      <p>Nenhum dado de pontuação ainda.</p>
      <p className="text-sm mt-1">Os lançamentos aparecerão aqui em tempo real.</p>
    </Card>
  )
}
