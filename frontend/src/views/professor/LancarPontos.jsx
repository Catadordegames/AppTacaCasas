// ============================================================
// views/professor/LancarPontos.jsx
// Formulário de lançamento de pontos.
// Professor escolhe casa, justificativa (padrão ou custom),
// opcionalmente seleciona aluno e turma.
// ============================================================

import { useState, useEffect, useMemo, useCallback } from 'react'
import { PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  Input,
  ToggleButton,
  PontosPreview,
} from '../../components/ui'
import { isRequired, isValidPontos } from '../../utils/validators'

// Opções de turno disponíveis
const TURNOS = [
  { value: '', label: 'Não especificado' },
  { value: 'Matutino', label: 'Matutino' },
  { value: 'Vespertino', label: 'Vespertino' },
  { value: 'Noturno', label: 'Noturno' },
]

// Opções do toggle de justificativa
const JUSTIFICATIVA_OPTIONS = [
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

export default function LancarPontos() {
  const { usuario } = useAuth()

  // Dados do formulário
  const [form, setForm] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Dados das APIs
  const [casas, setCasas] = useState([])
  const [turmas, setTurmas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [justificativas, setJustificativas] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  // Carrega dados iniciais (casas, turmas, justificativas)
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

  // Carrega alunos quando turma é selecionada
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

  // Handler para atualizar campos do formulário
  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  // Handler para toggle de justificativa
  const handleJustificativaTypeChange = useCallback((type) => {
    setForm((prev) => ({
      ...prev,
      is_custom: type === 'custom',
      justificativa_id: '',
      custom_justificativa: '',
      pontuacao: '',
    }))
  }, [])

  // Calcula preview de pontos
  const pontosPreview = useMemo(() => {
    if (form.is_custom) {
      return form.pontuacao ? Number(form.pontuacao) : 0
    }
    const just = justificativas.find((j) => j.id === Number(form.justificativa_id))
    return just?.pontos ?? 0
  }, [form.is_custom, form.pontuacao, form.justificativa_id, justificativas])

  // Validação do formulário
  const validate = useCallback(() => {
    const newErrors = {}

    if (!isRequired(form.casa_id)) {
      newErrors.casa_id = 'Selecione uma casa'
    }

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

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    const payload = buildPayload(form)

    try {
      setLoading(true)
      await api.post('/lancamentos', payload)

      toast.success(`✅ ${formatPontosMessage(pontosPreview)} lançados!`)

      // Reset parcial — mantém casa selecionada
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

  // Opções para selects
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

  if (loadingData) {
    return <LoadingState />
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <PageHeader title="Lançar Pontos" icon={<PlusCircle size={24} />} />

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Casa */}
            <Select
              label="Casa / Equipe"
              value={form.casa_id}
              onChange={(e) => updateField('casa_id', e.target.value)}
              options={casaOptions}
              placeholder="Selecione a casa..."
              error={errors.casa_id}
              required
            />

            {/* Turma (opcional) */}
            <Select
              label="Turma"
              value={form.turma_id}
              onChange={(e) => updateField('turma_id', e.target.value)}
              options={turmaOptions}
              placeholder="Nenhuma turma específica"
            />

            {/* Aluno (opcional, depende de turma) */}
            {form.turma_id && (
              <Select
                label="Aluno"
                value={form.aluno_id}
                onChange={(e) => updateField('aluno_id', e.target.value)}
                options={alunoOptions}
                placeholder="Nenhum aluno específico"
              />
            )}

            {/* Turno (opcional) */}
            <Select
              label="Turno"
              value={form.turno}
              onChange={(e) => updateField('turno', e.target.value)}
              options={TURNOS}
            />

            {/* Toggle: justificativa padrão vs custom */}
            <div>
              <label className="label">Tipo de justificativa</label>
              <ToggleButton
                options={JUSTIFICATIVA_OPTIONS}
                value={form.is_custom ? 'custom' : 'padrao'}
                onChange={handleJustificativaTypeChange}
              />
            </div>

            {/* Justificativa padrão */}
            {!form.is_custom && (
              <Select
                label="Justificativa"
                value={form.justificativa_id}
                onChange={(e) => updateField('justificativa_id', e.target.value)}
                options={justificativaOptions}
                placeholder="Selecione..."
                error={errors.justificativa_id}
                required
              />
            )}

            {/* Justificativa custom */}
            {form.is_custom && (
              <>
                <Input
                  label="Descrição"
                  placeholder="Ex: Campeão da feira de ciências"
                  value={form.custom_justificativa}
                  onChange={(e) => updateField('custom_justificativa', e.target.value)}
                  error={errors.custom_justificativa}
                  required
                  maxLength={100}
                />
                <Input
                  label="Pontuação"
                  type="number"
                  placeholder="Ex: 50 (use negativo para penalidade)"
                  value={form.pontuacao}
                  onChange={(e) => updateField('pontuacao', e.target.value)}
                  error={errors.pontuacao}
                  required
                />
              </>
            )}

            {/* Preview da pontuação */}
            <PontosPreview pontos={pontosPreview} />

            <Button
              type="submit"
              loading={loading}
              disabled={loading || !form.casa_id}
              fullWidth
            >
              {loading ? 'Lançando...' : '🏆 Confirmar Lançamento'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

// ============================================================
// Helper functions
// ============================================================

/**
 * Constrói o payload para envio à API
 */
function buildPayload(form) {
  return {
    casa_id: Number(form.casa_id),
    turma_id: form.turma_id ? Number(form.turma_id) : undefined,
    aluno_id: form.aluno_id ? Number(form.aluno_id) : undefined,
    justificativa_id: form.justificativa_id ? Number(form.justificativa_id) : undefined,
    pontuacao: form.is_custom ? Number(form.pontuacao) : undefined,
    turno: form.turno || undefined,
    custom_justificativa: form.is_custom ? form.custom_justificativa : undefined,
  }
}

/**
 * Formata pontos para mensagem
 */
function formatPontos(pontos) {
  if (pontos === null || pontos === undefined) return '0'
  const num = Number(pontos)
  return num > 0 ? `+${num}` : `${num}`
}

/**
 * Formata mensagem de pontos
 */
function formatPontosMessage(pontos) {
  return `${formatPontos(pontos)} pontos`
}

// ============================================================
// Sub-components
// ============================================================

function PageHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gold-400">{icon}</span>
      <h1 className="text-2xl font-display font-bold text-white">{title}</h1>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <PlusCircle size={24} className="text-gold-400" />
        <h1 className="text-2xl font-display font-bold text-white">Lançar Pontos</h1>
      </div>
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Carregando...</p>
        </CardContent>
      </Card>
    </div>
  )
}
