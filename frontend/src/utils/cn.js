// ============================================================
// utils/cn.js
// Utilitário para merge de classes CSS condicionais.
// ============================================================

/**
 * Concatena classes CSS de forma condicional.
 * Remove valores falsy (null, undefined, false, '') e junta com espaço.
 * @param {...(string|boolean|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ')
}
