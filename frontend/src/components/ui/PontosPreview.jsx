// ============================================================
// components/ui/PontosPreview.jsx
// Componente para exibir preview de pontos (positivo/negativo).
// ============================================================

import { Zap } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatPontos } from '../../utils/formatters'

/**
 * @typedef {Object} PontosPreviewProps
 * @property {number} pontos
 * @property {string} [mensagem]
 * @property {string} [className]
 */

export default function PontosPreview({
    pontos,
    mensagem = 'pontos para a casa selecionada',
    className,
}) {
    const isZero = pontos === 0
    const isPositive = pontos > 0

    if (isZero) return null

    return (
        <div
            className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold',
                isPositive
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400',
                className
            )}
        >
            <Zap size={16} />
            {formatPontos(pontos)} {mensagem}
        </div>
    )
}
