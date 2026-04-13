// ============================================================
// utils/formatters.js
// Funções utilitárias para formatação de dados.
// ============================================================

/**
 * Formata um número de pontos com sinal (+ ou -).
 * @param {number} pontos
 * @returns {string}
 */
export function formatPontos(pontos) {
    if (pontos === null || pontos === undefined) return '0'
    const num = Number(pontos)
    return num > 0 ? `+${num}` : `${num}`
}

/**
 * Formata um número com separador de milhares.
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
    if (value === null || value === undefined) return '0'
    return Number(value).toLocaleString('pt-BR')
}

/**
 * Retorna a classe CSS para cor baseada no valor (positivo/negativo).
 * @param {number} value
 * @returns {string}
 */
export function getPontosColorClass(value) {
    const num = Number(value)
    if (num > 0) return 'text-green-400'
    if (num < 0) return 'text-red-400'
    return 'text-gray-400'
}

/**
 * Trunca texto com ellipsis se exceder o limite.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

/**
 * Formata data para exibição em português.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
    if (!date) return '-'
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

/**
 * Formata data e hora para exibição em português.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
    if (!date) return '-'
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}
