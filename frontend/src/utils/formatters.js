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

/**
 * Formata um número de telefone com DDD, ex: (99) 99999-9999.
 * Limita a 11 dígitos numéricos no total (15 caracteres formatados).
 * @param {string} value - O valor atual do input
 * @returns {string} - O valor formatado
 */
export function formatPhone(value) {
    if (!value) return '';
    let numbers = value.replace(/\D/g, '');
    numbers = numbers.substring(0, 11);
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    if (numbers.length <= 10) return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
}

/**
 * Formata um CPF visualmente: XXX.XXX.XXX-XX.
 * Limita a 11 dígitos numéricos no total (14 caracteres formatados).
 * @param {string} value - O valor atual do input
 * @returns {string} - O valor formatado
 */
export function formatCPF(value) {
    if (!value) return '';
    let numbers = value.replace(/\D/g, '');
    numbers = numbers.substring(0, 11);
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.substring(0, 3)}.${numbers.substring(3)}`;
    if (numbers.length <= 9) return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6)}`;
    return `${numbers.substring(0, 3)}.${numbers.substring(3, 6)}.${numbers.substring(6, 9)}-${numbers.substring(9, 11)}`;
}
