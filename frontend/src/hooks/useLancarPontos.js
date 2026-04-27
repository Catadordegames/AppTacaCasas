import { useState, useEffect, useMemo, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { isRequired, isValidPontos } from '../utils/validators'

// Constantes estáticas da view de lançamentos
export const TURNOS = [
  { value: '', label: 'Não especificado' },
  { value: 'Matutino', label: 'Matutino' },
  { value: 'Vespertino', label: 'Vespertino' },
  { value: 'Noturno', label: 'Noturno' },
]

export const JUSTIFICATIVA_OPTIONS = [
  { value: 'padrao', label: 'Padrão' },
  { value: 'custom', label: 'Personalizada' },
]

const INITIAL_FORM_STATE = {
  casa_id: '',
  turma_id: '',
  aluno_id: '',
  justificativa_id: '',
  is_custom: false,
  custom_justificativa: '',
  pontuacao: '',
  turno: '',
}

export default function useLancarPontos() {
  const [form, setForm] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const [casas, setCasas] = useState([])
  const [turmas, setTurmas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [justificativas, setJustificativas] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [casasRes, turmasRes, justRes] = await Promise.all([
          api.get('/casas'),
          api.get('/turmas'),
          api.get('/justificativas'),
        ])
        setCasas(casasRes.data)
        setTurmas(turmasRes.data)
        setJustificativas(justRes.data)
      } catch (err) {
        toast.error('Erro ao carregar dados. Tente recarregar a página.')
      } finally {
        setLoadingData(false)
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    const loadAlunos = async () => {
      if (!form.turma_id) {
        setAlunos([])
        setForm((f) => ({ ...f, aluno_id: '' }))
        return
      }

      try {
        const params = new URLSearchParams()
        params.append('turma_id', form.turma_id)
        if (form.casa_id) params.append('casa_id', form.casa_id)

        const { data } = await api.get(`/alunos?${params}`)
        setAlunos(data)
      } catch (err) {
        toast.error('Erro ao carregar alunos.')
      }
    }

    loadAlunos()
  }, [form.turma_id, form.casa_id])

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handleJustificativaTypeChange = useCallback((type) => {
    setForm((prev) => ({
      ...prev,
      is_custom: type === 'custom',
      justificativa_id: '',
      custom_justificativa: '',
      pontuacao: '',
    }))
  }, [])

  const pontosPreview = useMemo(() => {
    if (form.is_custom) {
      return form.pontuacao ? Number(form.pontuacao) : 0
    }
    const just = justificativas.find((j) => j.id === Number(form.justificativa_id))
    return just?.pontos ?? 0
  }, [form.is_custom, form.pontuacao, form.justificativa_id, justificativas])

  const validate = useCallback(() => {
    const newErrors = {}
    if (!isRequired(form.casa_id)) newErrors.casa_id = 'Selecione uma casa'

    if (form.is_custom) {
      if (!isRequired(form.custom_justificativa)) {
        newErrors.custom_justificativa = 'Informe a descrição'
      }
      if (!isValidPontos(form.pontuacao)) {
        newErrors.pontuacao = 'Informe uma pontuação válida'
      }
    } else {
      if (!isRequired(form.justificativa_id)) {
        newErrors.justificativa_id = 'Selecione uma justificativa'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = buildPayload(form)

    try {
      setLoading(true)
      await api.post('/lancamentos', payload)

      toast.success(`✅ ${formatPontosMessage(pontosPreview)} lançados!`)

      setForm((prev) => ({
        ...prev,
        turma_id: '',
        aluno_id: '',
        justificativa_id: '',
        is_custom: false,
        custom_justificativa: '',
        pontuacao: '',
        turno: '',
      }))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao lançar pontos.')
    } finally {
      setLoading(false)
    }
  }

  const casaOptions = useMemo(() =>
    casas.map((c) => ({
      value: c.id,
      label: `${c.brasao} ${c.nome}`,
    })),
    [casas]
  )

  const turmaOptions = useMemo(() =>
    turmas.map((t) => ({
      value: t.id,
      label: `${t.nome} — ${t.turno}`,
    })),
    [turmas]
  )

  const alunoOptions = useMemo(() =>
    alunos.map((a) => ({
      value: a.id,
      label: a.nome,
    })),
    [alunos]
  )

  const justificativaOptions = useMemo(() =>
    justificativas.map((j) => ({
      value: j.id,
      label: `${j.nome} (${formatPontos(j.pontos)} pts)`,
    })),
    [justificativas]
  )

  return {
    form,
    errors,
    loading,
    loadingData,
    casaOptions,
    turmaOptions,
    alunoOptions,
    justificativaOptions,
    updateField,
    handleJustificativaTypeChange,
    pontosPreview,
    handleSubmit
  }
}

// Helpers Extraidos
function buildPayload(form) {
  return {
    casa_id: Number(form.casa_id),
    turma_id: form.turma_id ? Number(form.turma_id) : undefined,
    aluno_id: form.aluno_id ? Number(form.aluno_id) : undefined,
    justificativa_id: form.justificativa_id ? Number(form.justificativa_id) : undefined,
    is_custom: form.is_custom,
    pontuacao: form.is_custom ? Number(form.pontuacao) : undefined,
    turno: form.turno || undefined,
    custom_justificativa: form.is_custom ? form.custom_justificativa : undefined,
  }
}

function formatPontos(pontos) {
  if (pontos === null || pontos === undefined) return '0'
  const num = Number(pontos)
  return num > 0 ? `+${num}` : `${num}`
}

function formatPontosMessage(pontos) {
  return `${formatPontos(pontos)} pontos`
}
