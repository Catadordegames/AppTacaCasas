// ============================================================
// components/ui/Button.jsx
// Componente de botão reutilizável.
// ============================================================

import { forwardRef } from 'react'
import { cn } from '../../utils/cn'
import LoadingSpinner from './LoadingSpinner'

/**
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children
 * @property {'primary'|'secondary'|'danger'|'ghost'} [variant='primary']
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {boolean} [loading=false]
 * @property {boolean} [disabled=false]
 * @property {boolean} [fullWidth=false]
 * @property {React.ElementType} [as] - Componente para renderizar (ex: Link)
 * @property {string} [className]
 * @property {React.ButtonHTMLAttributes<HTMLButtonElement>} [props]
 */

const variantMap = {
    primary: 'bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold',
    secondary: 'bg-dark-600 hover:bg-dark-500 text-white border border-dark-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white font-semibold',
    ghost: 'bg-transparent hover:bg-dark-700 text-gray-400 hover:text-white',
}

const sizeMap = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
}

const Button = forwardRef(function Button(
    {
        children,
        variant = 'primary',
        size = 'md',
        loading = false,
        disabled = false,
        fullWidth = false,
        as: Component = 'button',
        className,
        ...props
    },
    ref
) {
    const isDisabled = disabled || loading

    return (
        <Component
            ref={ref}
            disabled={isDisabled}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-gold-500/50',
                variantMap[variant],
                sizeMap[size],
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {loading ? (
                <>
                    <LoadingSpinner
                        size="sm"
                        color={variant === 'primary' ? 'dark' : 'white'}
                    />
                    {children}
                </>
            ) : (
                children
            )}
        </Component>
    )
})

export default Button
