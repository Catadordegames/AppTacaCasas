// ============================================================
// utils/validators.js
// Funções utilitárias para validação de dados.
// ============================================================

/**
 * Verifica se um campo está preenchido.
 * @param {*} value
 * @returns {boolean}
 */
export function isRequired(value) {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return true
}

/**
 * Valida um número de pontos.
 * @param {*} value
 * @returns {boolean}
 */
export function isValidPontos(value) {
    if (value === '' || value === null || value === undefined) return false
    const num = Number(value)
    return !isNaN(num)
}

/**
 * Valida se o valor é um número positivo.
 * @param {*} value
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
    const num = Number(value)
    return !isNaN(num) && num > 0
}

/**
 * Valida tamanho mínimo de string.
 * @param {string} value
 * @param {number} minLength
 * @returns {boolean}
 */
export function minLength(value, minLength) {
    if (!value) return false
    return String(value).trim().length >= minLength
}

/**
 * Valida tamanho máximo de string.
 * @param {string} value
 * @param {number} maxLength
 * @returns {boolean}
 */
export function maxLength(value, maxLength) {
    if (!value) return true
    return String(value).trim().length <= maxLength
}

/**
 * Valida um formulário baseado em regras.
 * @param {Object} form - Dados do formulário
 * @param {Object} rules - Regras de validação { campo: validador }
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export function validateForm(form, rules) {
    const errors = {}
    let isValid = true

    for (const [field, validator] of Object.entries(rules)) {
        const value = form[field]
        const result = validator(value)

        if (result !== true) {
            errors[field] = typeof result === 'string' ? result : 'Campo inválido'
            isValid = false
        }
    }

    return { isValid, errors }
}
