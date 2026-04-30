// ============================================================
// services/api.js
// Instância centralizada do Axios.
// Interceptors injetam o token JWT automaticamente em toda
// requisição autenticada, e redirecionam para /login se o
// servidor retornar 401 (token expirado).
// ============================================================

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Injeta o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redireciona para login se token expirar
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ''
      // Nao redireciona na tela de login para evitar recarregamento da pagina
      if (!requestUrl.includes('/auth/login')) {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api