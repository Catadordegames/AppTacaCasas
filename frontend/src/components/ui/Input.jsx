// ============================================================
// components/ui/Input.jsx
// Componente de input reutilizável com suporte a ícones.
// ============================================================

import { cn } from '../../utils/cn'

/**
 * @typedef {Object} InputProps
 * @property {string} [label]
 * @property {React.ReactNode} [leftIcon]
 * @property {React.ReactNode} [rightIcon]
 * @property {string} [error]
 * @property {boolean} [required=false]
 * @property {string} [className]
 * @property {string} [labelClassName]
 * @property {React.InputHTMLAttributes<HTMLInputElement>} [props]
 */

export default function Input({
    label,
    leftIcon,
    rightIcon,
    error,
    required = false,
    className,
    labelClassName,
    preventSuggest = false,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className={cn('label', labelClassName)}>
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={cn(
                        'input w-full',
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
                        className
                    )}
                    readOnly={preventSuggest ? true : props.readOnly}
                    onFocus={(e) => {
                        if (preventSuggest) {
                            e.target.removeAttribute('readonly');
                        }
                        if (props.onFocus) props.onFocus(e);
                    }}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    )
}
