// ============================================================
// views/public/Login.jsx
// Página de login com formulário autenticação.
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Lock, User, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../../context/AuthContext'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { isRequired } from '../../utils/validators'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ nome: '', senha: '' })
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!isRequired(form.nome)) newErrors.nome = 'Campo obrigatório'
    if (!isRequired(form.senha)) newErrors.senha = 'Campo obrigatório'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)
      await login(form.nome.trim(), form.senha)
      toast.success('Bem-vindo(a)!')
      navigate('/lancar')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciais inválidas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <LoginLogo />

        {/* Card de login */}
        <Card>
          <CardHeader>
            <CardTitle>Entrar no Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome de usuário"
                placeholder="Seu nome"
                value={form.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                leftIcon={<User size={16} />}
                error={errors.nome}
                autoComplete="username"
                disabled={loading}
              />

              <Input
                label="Senha"
                type={showSenha ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.senha}
                onChange={(e) => handleChange('senha', e.target.value)}
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                    onClick={() => setShowSenha(!showSenha)}
                    tabIndex={-1}
                  >
                    {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={errors.senha}
                autoComplete="current-password"
                disabled={loading}
              />

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                fullWidth
                className="mt-2"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-600 mt-4">
          Apenas professores e coordenação têm acesso ao sistema.
        </p>
      </div>
    </div>
  )
}

/**
 * Componente do logo da tela de login
 */
function LoginLogo() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 border border-gold-500/30 rounded-2xl mb-4">
        <Trophy size={32} className="text-gold-400" />
      </div>
      <h1 className="text-2xl font-display font-bold text-gold-400">Taça das Casas</h1>
      <p className="text-gray-500 text-sm mt-1">CEF 102 Norte</p>
    </div>
  )
}
