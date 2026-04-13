// ============================================================
// components/ui/LoadingSpinner.jsx
// Componente de loading reutilizável.
// ============================================================

import { cn } from '../../utils/cn'

/**
 * @typedef {Object} LoadingSpinnerProps
 * @property {string} [size='md'] - Tamanho: 'sm', 'md', 'lg'
 * @property {string} [color='gold'] - Cor: 'gold', 'white', 'dark'
 * @property {string} [className] - Classes adicionais
 */

const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
}

const colorMap = {
    gold: 'border-primary-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    dark: 'border-background-900 border-t-transparent',
}

export default function LoadingSpinner({
    size = 'md',
    color = 'gold',
    className
}) {
    return (
        <div
            className={cn(
                'rounded-full animate-spin',
                sizeMap[size],
                colorMap[color],
                className
            )}
        />
    )
}
