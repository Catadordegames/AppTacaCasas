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
  complemento: '',
}

export default function useLancarPontos() {
  const [form, setForm] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const [casas, setCasas] = useState([])
  const [turmas, setTurmas] = useState([])
  const [allAlunos, setAllAlunos] = useState([])
  const [justificativas, setJustificativas] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [casasRes, turmasRes, justRes, alunosRes] = await Promise.all([
          api.get('/casas'),
          api.get('/turmas'),
          api.get('/justificativas'),
          api.get('/alunos'),
        ])
        setCasas(casasRes.data)
        setTurmas(turmasRes.data)
        setJustificativas(justRes.data)
        setAllAlunos(alunosRes.data)
      } catch (err) {
        toast.error('Erro ao carregar dados. Tente recarregar a página.')
      } finally {
        setLoadingData(false)
      }
    }

    loadInitialData()
  }, [])

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  // Ao selecionar um aluno no modal, preenche casa e turma automaticamente
  const handleAlunoSelect = useCallback((aluno) => {
    setForm((prev) => ({
      ...prev,
      aluno_id: aluno ? String(aluno.id) : '',
      casa_id: aluno?.casa_id ? String(aluno.casa_id) : prev.casa_id,
      turma_id: aluno?.turma_id ? String(aluno.turma_id) : prev.turma_id,
    }))
    // Limpa erros relacionados
    setErrors((prev) => ({
      ...prev,
      casa_id: undefined,
      aluno_id: undefined,
    }))
  }, [])

  // Limpa o aluno selecionado
  const clearAluno = useCallback(() => {
    setForm((prev) => ({ ...prev, aluno_id: '' }))
  }, [])

  const handleJustificativaTypeChange = useCallback((type) => {
    setForm((prev) => ({
      ...prev,
      is_custom: type === 'custom',
      justificativa_id: '',
      custom_justificativa: '',
      pontuacao: '',
    }))
  }, [])

  // Ao selecionar uma justificativa no modal
  const handleJustificativaSelect = useCallback((justificativa) => {
    setForm((prev) => ({
      ...prev,
      justificativa_id: String(justificativa.id),
    }))
    setErrors((prev) => ({ ...prev, justificativa_id: undefined }))
  }, [])

  // Limpa a justificativa selecionada
  const clearJustificativa = useCallback(() => {
    setForm((prev) => ({ ...prev, justificativa_id: '' }))
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
        complemento: '',
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
      label: c.nome,
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

  // Dados do aluno selecionado (para exibir no campo do formulário)
  const selectedAluno = useMemo(() => {
    if (!form.aluno_id) return null
    return allAlunos.find((a) => a.id === Number(form.aluno_id)) || null
  }, [form.aluno_id, allAlunos])

  const justificativaOptions = useMemo(() =>
    justificativas.map((j) => ({
      value: j.id,
      label: `${j.nome} (${formatPontos(j.pontos)} pts)`,
    })),
    [justificativas]
  )

  // Dados da justificativa selecionada (para exibir no campo do formulário)
  const selectedJustificativa = useMemo(() => {
    if (!form.justificativa_id) return null
    return justificativas.find((j) => j.id === Number(form.justificativa_id)) || null
  }, [form.justificativa_id, justificativas])

  return {
    form,
    errors,
    loading,
    loadingData,
    casaOptions,
    turmaOptions,
    allAlunos,
    selectedAluno,
    justificativas,
    justificativaOptions,
    selectedJustificativa,
    updateField,
    handleAlunoSelect,
    clearAluno,
    handleJustificativaTypeChange,
    handleJustificativaSelect,
    clearJustificativa,
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
    complemento: form.complemento || undefined,
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
