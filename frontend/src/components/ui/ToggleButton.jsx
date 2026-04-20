// ============================================================
// components/ui/ToggleButton.jsx
// Componente de toggle button (botão de alternância).
// ============================================================

import { cn } from '../../utils/cn'

/**
 * @typedef {Object} ToggleOption
 * @property {string} value
 * @property {string} label
 */

/**
 * @typedef {Object} ToggleButtonProps
 * @property {ToggleOption[]} options
 * @property {string} value - Valor selecionado
 * @property {(value: string) => void} onChange
 * @property {string} [className]
 */

export default function ToggleButton({
    options,
    value,
    onChange,
    className,
}) {
    return (
        <div className={cn('flex gap-2', className)}>
            {options.map((opt) => {
                const isSelected = value === opt.value
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            'flex-1 py-2 rounded-lg text-sm font-semibold border transition-all',
                            isSelected
                                ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                                : 'bg-background-700 border-background-500 text-gray-400 hover:border-background-400'
                        )}
                    >
                        {opt.label}
                    </button>
                )
            })}
        </div>
    )
}
