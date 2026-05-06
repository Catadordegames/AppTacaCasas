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

/**
 * Valida um CPF brasileiro usando o algoritmo de dígitos verificadores.
 * 1. Remove caracteres não-numéricos.
 * 2. Verifica se tem exatamente 11 dígitos.
 * 3. Rejeita CPFs com todos os dígitos iguais.
 * 4. Calcula 1º dígito verificador (multiplicadores 10→2).
 * 5. Calcula 2º dígito verificador (multiplicadores 11→2).
 * 6. Compara dígitos calculados com os informados.
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {boolean} - true se válido
 */
export function isValidCPF(cpf) {
    if (!cpf) return false
    const digits = cpf.replace(/\D/g, '')

    // Deve ter exatamente 11 dígitos
    if (digits.length !== 11) return false

    // Rejeitar CPFs com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(digits)) return false

    // Cálculo do 1º dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
        soma += Number(digits[i]) * (10 - i)
    }
    let resto = soma % 11
    const digito1 = resto < 2 ? 0 : 11 - resto

    if (Number(digits[9]) !== digito1) return false

    // Cálculo do 2º dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
        soma += Number(digits[i]) * (11 - i)
    }
    resto = soma % 11
    const digito2 = resto < 2 ? 0 : 11 - resto

    if (Number(digits[10]) !== digito2) return false

    return true
}
