// ============================================================
// views/public/Login.jsx
// View: Interface de login.
// ============================================================

import { Trophy, Lock, User, Eye, EyeOff } from 'lucide-react'
import useLogin from '../../hooks/useLogin'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../../components/ui'

export default function Login() {
  const { form, errors, loading, showSenha, setShowSenha, handleChange, handleSubmit } = useLogin()

  return (
    <div className="fixed inset-0 bg-background-900 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <LoginLogo />
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
              <Button type="submit" loading={loading} disabled={loading} fullWidth className="mt-2">
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-gray-600 mt-4">
          Apenas professores e gestão da escola têm acesso ao sistema.
        </p>
      </div>
      </div>
    </div>
  )
}

function LoginLogo() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 border border-primary-500/30 rounded-2xl mb-4">
        <Trophy size={32} className="text-primary-400" />
      </div>
      <h1 className="text-2xl font-display font-bold text-primary-400">Taça das Casas</h1>
      <p className="text-gray-500 text-sm mt-1">CEF 102 Norte</p>
    </div>
  )
}
