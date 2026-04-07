// ============================================================
// components/ui/Select.jsx
// Componente de select reutilizável.
// ============================================================

import { cn } from '../../utils/cn'

/**
 * @typedef {Object} SelectOption
 * @property {string|number} value
 * @property {string} label
 */

/**
 * @typedef {Object} SelectProps
 * @property {string} [label]
 * @property {SelectOption[]} [options]
 * @property {string} [placeholder]
 * @property {string} [error]
 * @property {boolean} [required=false]
 * @property {string} [className]
 * @property {React.SelectHTMLAttributes<HTMLSelectElement>} [props]
 */

export default function Select({
    label,
    options = [],
    placeholder,
    error,
    required = false,
    className,
    children,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="label">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                    {!required && <span className="text-gray-500 font-normal ml-1">(opcional)</span>}
                </label>
            )}
            <select
                className={cn(
                    'input w-full appearance-none',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
                    className
                )}
                {...props}
            >
                {placeholder && (
                    <option value="">{placeholder}</option>
                )}
                {children || options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    )
}
