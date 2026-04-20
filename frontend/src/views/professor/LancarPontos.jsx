// ============================================================
// views/professor/LancarPontos.jsx
// View: Interface do Formulário de lançamento de pontos.
// ============================================================

import { PlusCircle } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  Select,
  Input,
  ToggleButton,
  PontosPreview,
} from '../../components/ui'
import useLancarPontos, { TURNOS, JUSTIFICATIVA_OPTIONS } from '../../hooks/useLancarPontos'

export default function LancarPontos() {
  const {
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
  } = useLancarPontos()

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
// Sub-components
// ============================================================

function PageHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary-400">{icon}</span>
      <h1 className="text-2xl font-display font-bold text-white">{title}</h1>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <PlusCircle size={24} className="text-primary-400" />
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
