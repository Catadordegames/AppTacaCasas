// ============================================================
// views/professor/LancarPontos.jsx
// View: Interface do Formulário de lançamento de pontos.
// ============================================================

import { useState } from 'react'
import { PlusCircle, User, X, ClipboardList } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  Select,
  Input,
  ToggleButton,
  PontosPreview,
  AlunoPickerModal,
  JustificativaPickerModal,
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
  } = useLancarPontos()

  const [alunoModalOpen, setAlunoModalOpen] = useState(false)
  const [justificativaModalOpen, setJustificativaModalOpen] = useState(false)

  if (loadingData) {
    return <LoadingState />
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <PageHeader title="Lançar Pontos" icon={<PlusCircle size={24} />} />

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Aluno (modal de seleção) */}
            <AlunoField
              selectedAluno={selectedAluno}
              onOpenModal={() => setAlunoModalOpen(true)}
              onClear={clearAluno}
            />

            {/* Turma (opcional) — preenchida automaticamente ao selecionar aluno */}
            <Select
              label="Turma"
              value={form.turma_id}
              onChange={(e) => updateField('turma_id', e.target.value)}
              options={turmaOptions}
              placeholder="Nenhuma turma específica"
            />

            {/* Casa — preenchida automaticamente ao selecionar aluno */}
            <Select
              label="Casa / Equipe"
              value={form.casa_id}
              onChange={(e) => updateField('casa_id', e.target.value)}
              options={casaOptions}
              placeholder="Selecione a casa..."
              error={errors.casa_id}
              required
            />

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

            {/* Justificativa padrão (modal de seleção) */}
            {!form.is_custom && (
              <JustificativaField
                selectedJustificativa={selectedJustificativa}
                onOpenModal={() => setJustificativaModalOpen(true)}
                onClear={clearJustificativa}
                error={errors.justificativa_id}
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

            {/* Complemento (opcional) */}
            <div>
              <label className="label">Complemento</label>
              <textarea
                className="input min-h-[60px] resize-y"
                placeholder="Observações adicionais (opcional)"
                value={form.complemento}
                onChange={(e) => updateField('complemento', e.target.value)}
                maxLength={500}
              />
            </div>

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

      {/* Modal de seleção de aluno */}
      <AlunoPickerModal
        isOpen={alunoModalOpen}
        onClose={() => setAlunoModalOpen(false)}
        onSelect={handleAlunoSelect}
        alunos={allAlunos}
      />

      {/* Modal de seleção de justificativa */}
      <JustificativaPickerModal
        isOpen={justificativaModalOpen}
        onClose={() => setJustificativaModalOpen(false)}
        onSelect={handleJustificativaSelect}
        justificativas={justificativas}
      />
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

/**
 * Campo visual de seleção de aluno.
 * Exibe um botão que abre o modal de busca, ou mostra o aluno selecionado.
 */
function AlunoField({ selectedAluno, onOpenModal, onClear }) {
  return (
    <div className="w-full">
      <label className="label">
        Aluno
        <span className="text-gray-500 font-normal ml-1">(opcional)</span>
      </label>

      {selectedAluno ? (
        /* Aluno selecionado — exibe chip com info */
        <div className="input flex items-center gap-3 cursor-default">
          <span className="shrink-0 w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
            <User size={14} className="text-primary-400" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{selectedAluno.nome}</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              {selectedAluno.turma_nome && <span>{selectedAluno.turma_nome}</span>}
              {selectedAluno.turma_nome && selectedAluno.casa_nome && <span>•</span>}
              {selectedAluno.casa_nome && (
                <span className="text-primary-400/80">{selectedAluno.casa_nome}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-gray-500 hover:text-red-400 transition-colors p-1"
            aria-label="Remover aluno"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        /* Sem aluno — botão para abrir modal */
        <button
          type="button"
          onClick={onOpenModal}
          className="input w-full text-left flex items-center gap-3 hover:border-primary-500/50 transition-colors cursor-pointer"
        >
          <User size={16} className="text-gray-500 shrink-0" />
          <span className="text-gray-500 text-sm">Toque para buscar aluno...</span>
        </button>
      )}
    </div>
  )
}

/**
 * Campo visual de seleção de justificativa.
 * Exibe um botão que abre o modal de busca, ou mostra a justificativa selecionada.
 */
function JustificativaField({ selectedJustificativa, onOpenModal, onClear, error }) {
  const formatPontos = (pontos) => {
    const num = Number(pontos)
    return num > 0 ? `+${num}` : `${num}`
  }

  return (
    <div className="w-full">
      <label className="label">
        Justificativa <span className="text-red-400">*</span>
      </label>

      {selectedJustificativa ? (
        /* Justificativa selecionada — exibe chip com info */
        <div className="input flex items-center gap-3 cursor-default">
          <span
            className={`shrink-0 min-w-[40px] h-8 rounded-lg flex items-center justify-center text-sm font-bold ${selectedJustificativa.pontos >= 0
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
              }`}
          >
            {formatPontos(selectedJustificativa.pontos)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{selectedJustificativa.nome}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedJustificativa.pontos >= 0 ? 'Bonificação' : 'Penalidade'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-gray-500 hover:text-red-400 transition-colors p-1"
            aria-label="Remover justificativa"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        /* Sem justificativa — botão para abrir modal */
        <button
          type="button"
          onClick={onOpenModal}
          className={`input w-full text-left flex items-center gap-3 hover:border-primary-500/50 transition-colors cursor-pointer ${error ? 'border-red-500' : ''
            }`}
        >
          <ClipboardList size={16} className="text-gray-500 shrink-0" />
          <span className="text-gray-500 text-sm">Toque para selecionar justificativa...</span>
        </button>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

function PageHeader({ title, icon }) {
  return (
    <Card className="px-4 py-3 flex items-center gap-3 border-background-600">
      <span className="text-primary-400">{icon}</span>
      <h1 className="text-2xl font-display font-bold text-white">{title}</h1>
    </Card>
  )
}

function LoadingState() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card className="px-4 py-3 flex items-center gap-3 border-background-600">
        <PlusCircle size={24} className="text-primary-400" />
        <h1 className="text-2xl font-display font-bold text-white">Lançar Pontos</h1>
      </Card>
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Carregando...</p>
        </CardContent>
      </Card>
    </div>
  )
}
