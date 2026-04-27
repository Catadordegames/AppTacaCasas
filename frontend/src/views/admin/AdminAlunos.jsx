import { Plus, GraduationCap } from 'lucide-react'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'
import useAdminAlunos from '../../hooks/useAdminAlunos'

export default function AdminAlunos() {
  const { alunos, casas, turmas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar, filtroTurma, setFiltroTurma, filtroCasa, setFiltroCasa } = useAdminAlunos()

  const columns = [
    { key: 'nome',       label: 'Nome' },
    { key: 'turma_nome', label: 'Turma' },
    { key: 'casa_nome',  label: 'Casa', render: (v) => v || <span className="text-gray-600">—</span> },
  ]

  return (
    <div className="space-y-5">
      <div className="card px-4 py-3 border border-background-600 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <GraduationCap size={22} className="text-primary-400" />
          <h1 className="text-2xl font-display font-bold text-white">Alunos</h1>
        </div>
        <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Aluno
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <select className="input py-1.5 text-sm flex-1 min-w-32" value={filtroTurma} onChange={(e) => setFiltroTurma(e.target.value)}>
          <option value="">Todas as turmas</option>
          {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
        <select className="input py-1.5 text-sm flex-1 min-w-32" value={filtroCasa} onChange={(e) => setFiltroCasa(e.target.value)}>
          <option value="">Todas as casas</option>
          {casas.map((c) => <option key={c.id} value={c.id}>{c.brasao} {c.nome}</option>)}
        </select>
      </div>

      <div className="card border border-background-600">
        <CrudTable columns={columns} data={alunos} loading={loading}
          onEdit={abrirEditar} onDelete={handleDeletar} deletando={deletando}
          searchPlaceholder="Buscar aluno..." />
      </div>

      {modalAberto && (
        <Modal title={editando ? 'Editar Aluno' : 'Novo Aluno'} onClose={fecharModal}>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="label">Nome completo *</label>
              <input className="input" placeholder="Nome do aluno" value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div>
              <label className="label">Turma *</label>
              <select className="input" value={form.turma_id}
                onChange={(e) => setForm({ ...form, turma_id: e.target.value })} required>
                <option value="">Selecione...</option>
                {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome} — {t.turno}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Casa <span className="text-gray-500 font-normal">(opcional)</span></label>
              <select className="input" value={form.casa_id} onChange={(e) => setForm({ ...form, casa_id: e.target.value })}>
                <option value="">Sem casa atribuída</option>
                {casas.map((c) => <option key={c.id} value={c.id}>{c.brasao} {c.nome}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={fecharModal} className="btn-secondary flex-1">Cancelar</button>
              <button type="submit" disabled={salvando} className="btn-primary flex-1">
                {salvando ? 'Salvando...' : editando ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}