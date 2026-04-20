// ============================================================
// components/ui/Card.jsx
// Componente de card reutilizável.
// ============================================================

import { cn } from '../../utils/cn'

/**
 * @typedef {Object} CardProps
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {boolean} [border=true]
 * @property {string} [borderClass] - Classe CSS customizada para a borda
 * @property {React.HTMLAttributes<HTMLDivElement>} [props]
 */

export default function Card({
    children,
    className,
    border = true,
    borderClass = 'border-background-500',
    ...props
}) {
    return (
        <div
            className={cn(
                'card',
                border && ['border', borderClass],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

/**
 * Header do Card
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export function CardHeader({ children, className }) {
    return (
        <div className={cn('mb-5', className)}>
            {children}
        </div>
    )
}

/**
 * Título do Card
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export function CardTitle({ children, className }) {
    return (
        <h2 className={cn('text-lg font-display font-semibold text-white', className)}>
            {children}
        </h2>
    )
}

/**
 * Conteúdo do Card
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export function CardContent({ children, className }) {
    return (
        <div className={cn('space-y-4', className)}>
            {children}
        </div>
    )
}
