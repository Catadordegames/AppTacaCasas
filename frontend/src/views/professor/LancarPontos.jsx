// ============================================================
// views/professor/LancarPontos.jsx
// Formulário de lançamento de pontos.
// Professor escolhe casa, justificativa (padrão ou custom),
// opcionalmente seleciona aluno e turma.
// ============================================================

import { useState, useEffect } from 'react'
import { PlusCircle, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function LancarPontos() {
  const { usuario } = useAuth()
  const [casas, setCasas] = useState([])
  const [turmas, setTurmas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [justificativas, setJustificativas] = useState([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    casa_id: '',
    turma_id: '',
    aluno_id: '',
    justificativa_id: '',
    is_custom: false,
    custom_justificativa: '',
    pontuacao: '',
    turno: '',
  })

  useEffect(() => {
    Promise.all([
      api.get('/casas'),
      api.get('/turmas'),
      api.get('/justificativas'),
    ]).then(([c, t, j]) => {
      setCasas(c.data)
      setTurmas(t.data)
      setJustificativas(j.data)
    })
  }, [])

  // Carrega alunos quando turma é selecionada
  useEffect(() => {
    if (form.turma_id) {
      api.get(`/alunos?turma_id=${form.turma_id}&casa_id=${form.casa_id || ''}`)
        .then((r) => setAlunos(r.data))
    } else {
      setAlunos([])
      setForm((f) => ({ ...f, aluno_id: '' }))
    }
  }, [form.turma_id, form.casa_id])

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const pontosPreview = form.is_custom
    ? (form.pontuacao ? Number(form.pontuacao) : 0)
    : (justificativas.find((j) => j.id === Number(form.justificativa_id))?.pontos ?? 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.post('/lancamentos', {
        ...form,
        casa_id: Number(form.casa_id),
        turma_id: form.turma_id ? Number(form.turma_id) : undefined,
        aluno_id: form.aluno_id ? Number(form.aluno_id) : undefined,
        justificativa_id: form.justificativa_id ? Number(form.justificativa_id) : undefined,
        pontuacao: form.is_custom ? Number(form.pontuacao) : undefined,
      })
      toast.success(`✅ ${pontosPreview > 0 ? '+' : ''}${pontosPreview} pontos lançados!`)
      // Reset parcial — mantém casa selecionada
      setForm((f) => ({
        ...f,
        turma_id: '', aluno_id: '', justificativa_id: '',
        is_custom: false, custom_justificativa: '', pontuacao: '', turno: '',
      }))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao lançar pontos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <PlusCircle size={24} className="text-gold-400" />
        <h1 className="text-2xl font-display font-bold text-white">Lançar Pontos</h1>
      </div>

      <div className="card border border-dark-500">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Casa */}
          <div>
            <label className="label">Casa / Equipe *</label>
            <select className="input" value={form.casa_id} onChange={(e) => set('casa_id', e.target.value)} required>
              <option value="">Selecione a casa...</option>
              {casas.map((c) => (
                <option key={c.id} value={c.id}>{c.brasao} {c.nome}</option>
              ))}
            </select>
          </div>

          {/* Turma (opcional) */}
          <div>
            <label className="label">Turma <span className="text-gray-500 font-normal">(opcional)</span></label>
            <select className="input" value={form.turma_id} onChange={(e) => set('turma_id', e.target.value)}>
              <option value="">Nenhuma turma específica</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>{t.nome} — {t.turno}</option>
              ))}
            </select>
          </div>

          {/* Aluno (opcional, depende de turma) */}
          {form.turma_id && (
            <div>
              <label className="label">Aluno <span className="text-gray-500 font-normal">(opcional)</span></label>
              <select className="input" value={form.aluno_id} onChange={(e) => set('aluno_id', e.target.value)}>
                <option value="">Nenhum aluno específico</option>
                {alunos.map((a) => (
                  <option key={a.id} value={a.id}>{a.nome}</option>
                ))}
              </select>
            </div>
          )}

          {/* Turno (opcional) */}
          <div>
            <label className="label">Turno <span className="text-gray-500 font-normal">(opcional)</span></label>
            <select className="input" value={form.turno} onChange={(e) => set('turno', e.target.value)}>
              <option value="">Não especificado</option>
              <option>Matutino</option>
              <option>Vespertino</option>
              <option>Noturno</option>
            </select>
          </div>

          {/* Toggle: justificativa padrão vs custom */}
          <div>
            <label className="label">Tipo de justificativa</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => set('is_custom', false)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  !form.is_custom
                    ? 'bg-gold-500/20 border-gold-500/50 text-gold-400'
                    : 'bg-dark-700 border-dark-500 text-gray-400 hover:border-dark-400'
                }`}
              >
                Padrão
              </button>
              <button
                type="button"
                onClick={() => set('is_custom', true)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  form.is_custom
                    ? 'bg-gold-500/20 border-gold-500/50 text-gold-400'
                    : 'bg-dark-700 border-dark-500 text-gray-400 hover:border-dark-400'
                }`}
              >
                Personalizada
              </button>
            </div>
          </div>

          {/* Justificativa padrão */}
          {!form.is_custom && (
            <div>
              <label className="label">Justificativa *</label>
              <select className="input" value={form.justificativa_id} onChange={(e) => set('justificativa_id', e.target.value)} required>
                <option value="">Selecione...</option>
                {justificativas.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nome} ({j.pontos > 0 ? '+' : ''}{j.pontos} pts)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Justificativa custom */}
          {form.is_custom && (
            <>
              <div>
                <label className="label">Descrição *</label>
                <input
                  className="input"
                  placeholder="Ex: Campeão da feira de ciências"
                  value={form.custom_justificativa}
                  onChange={(e) => set('custom_justificativa', e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="label">Pontuação *</label>
                <input
                  className="input"
                  type="number"
                  placeholder="Ex: 50 (use negativo para penalidade)"
                  value={form.pontuacao}
                  onChange={(e) => set('pontuacao', e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Preview da pontuação */}
          {pontosPreview !== 0 && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold
              ${pontosPreview > 0 ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              <Zap size={16} />
              {pontosPreview > 0 ? '+' : ''}{pontosPreview} pontos para a casa selecionada
            </div>
          )}

          <button type="submit" disabled={loading || !form.casa_id} className="btn-primary w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                Lançando...
              </span>
            ) : '🏆 Confirmar Lançamento'}
          </button>
        </form>
      </div>
    </div>
  )
}