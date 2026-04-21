import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { isRequired } from '../utils/validators'

export default function useLogin() {
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

  return {
    form,
    errors,
    loading,
    showSenha,
    setShowSenha,
    handleChange,
    handleSubmit
  }
}
