// ============================================================
// views/public/Dashboard.jsx
// Pagina publica do placar — o coracao do sistema.
// Acessivel sem login para alunos, pais e toda a comunidade.
// Pontuacao oculta por padrao; usuario logado pode revelar via botao olho.
// ============================================================

import { useState, useMemo } from 'react'
import { Trophy, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useRanking } from '../../hooks/useRanking'
import { useAuth } from '../../context/AuthContext'

import { Card, LoadingSpinner, Button } from '../../components/ui'
import { formatNumber } from '../../utils/formatters'
import { cn } from '../../utils/cn'

// Cores das medalhas para os 3 primeiros lugares
const MEDAL_COLORS = [
  { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', medal: '🥇', bar: 'bg-yellow-400' },
  { bg: 'bg-gray-400/10', border: 'border-gray-400/30', text: 'text-gray-400', medal: '🥈', bar: 'bg-gray-400' },
  { bg: 'bg-amber-700/10', border: 'border-amber-700/30', text: 'text-amber-600', medal: '🥉', bar: 'bg-amber-600' },
]

export default function Dashboard() {
  const { ranking, loading, lastUpdate, carregarRanking } = useRanking(30000)
  const { usuario } = useAuth()
  const [mostrarPontos, setMostrarPontos] = useState(false)

  const maxPontos = useMemo(() => ranking[0]?.total_pontos || 1, [ranking])

  const togglePontos = () => setMostrarPontos((v) => !v)

  return (
    <div className="space-y-6">
      <Card className="space-y-2 pb-4">
        <DashboardHeader lastUpdate={lastUpdate} />

        <div className="flex justify-between items-center pt-3 border-t border-background-600/30">
          {usuario && (
            <button
              onClick={togglePontos}
              className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-500 transition-colors"
              title={mostrarPontos ? 'Ocultar pontuacao' : 'Mostrar pontuacao'}
            >
              {mostrarPontos ? <EyeOff size={18} /> : <Eye size={18} />}
              {mostrarPontos ? 'Ocultar pontos' : 'Ver pontos'}
            </button>
          )}
          <RefreshButton onClick={carregarRanking} loading={loading} />
        </div>
      </Card>

      {loading && ranking.length === 0 && <LoadingState />}

      <RankingList ranking={ranking} maxPontos={maxPontos} usuario={usuario} mostrarPontos={mostrarPontos} />

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
        <Trophy size={32} className="text-primary-400" />
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-400">
          Taça das Casas
        </h1>
        <Trophy size={32} className="text-primary-400" />
      </div>
      <p className="text-gray-400 text-sm">CEF 102 Norte · Placar em tempo real</p>
      {lastUpdate && (
        <p className="text-gray-600 text-xs">
          Atualizado as {lastUpdate.toLocaleTimeString('pt-BR')}
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
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-400 transition-colors ml-auto"
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

function RankingList({ ranking, maxPontos, usuario, mostrarPontos }) {
  return (
    <div className="space-y-3">
      {ranking.map((casa, index) => (
        <RankingItem
          key={casa.id}
          casa={casa}
          index={index}
          maxPontos={maxPontos}
          usuario={usuario}
          mostrarPontos={mostrarPontos}
        />
      ))}
    </div>
  )
}

function RankingItem({ casa, index, maxPontos, usuario, mostrarPontos }) {
  const style = MEDAL_COLORS[index] || {
    bg: 'bg-background-700/50',
    border: 'border-background-600',
    text: 'text-gray-500',
    medal: `${index + 1}\u00BA`,
    bar: 'bg-background-500',
  }

  const barWidth = Math.max(4, (casa.total_pontos / maxPontos) * 100)

  return (
    <Card
      className={cn(
        style.bg,
        'transition-all duration-300 hover:scale-[1.01] group py-4'
      )}
      border
      borderClass={style.border}
    >
      <div className="flex items-center gap-4 md:gap-6">
        {/* Posicao / medalha */}
        <MedalBadge index={index} style={style} />

        {/* Brasao + Nome */}
        <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
          {casa.brasao?.startsWith('/api/uploads') ? (
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src={casa.brasao} 
                alt={casa.nome} 
                className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]" 
              />
            </div>
          ) : (
            <span className="text-6xl md:text-7xl leading-none drop-shadow-lg flex-shrink-0 text-center w-24 md:w-32 transition-transform duration-500 group-hover:scale-110">
              {casa.brasao}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-white text-2xl md:text-4xl leading-tight truncate">
              {casa.nome}
            </h2>
          </div>
        </div>

        {/* Pontuacao */}
        {usuario && (
          <div className="text-right flex-shrink-0">
            <div className={cn('font-display font-bold text-2xl', style.text)}>
              {mostrarPontos ? formatNumber(casa.total_pontos) : '***'}
            </div>
            <div className="text-xs text-gray-500">pontos</div>
          </div>
        )}
      </div>

      {/* Barra de progresso — removida para nao revelar distancia entre casas */}
    </Card>
  )
}

function MedalBadge({ index, style }) {
  const isNumeric = typeof style.medal === 'string' && style.medal.includes('o')

  return (
    <div className="text-3xl md:text-5xl w-12 md:w-16 text-center flex-shrink-0">
      {isNumeric ? (
        <span className={cn('font-display font-bold text-2xl md:text-3xl', style.text)}>
          {style.medal}
        </span>
      ) : (
        <span className="drop-shadow-lg">{style.medal}</span>
      )}
    </div>
  )
}

function ProgressBar({ width, color }) {
  return (
    <div className="mt-3 h-1.5 bg-background-700 rounded-full overflow-hidden">
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
      <p>Nenhum dado de pontuacao ainda.</p>
      <p className="text-sm mt-1">Os lancamentos aparecerao aqui em tempo real.</p>
    </Card>
  )
}
