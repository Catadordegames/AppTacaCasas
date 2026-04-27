import { Plus, Tag } from 'lucide-react'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'
import useAdminJustificativas from '../../hooks/useAdminJustificativas'

export default function AdminJustificativas() {
  const { justificativas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar } = useAdminJustificativas()

  const columns = [
    { key: 'nome',   label: 'Descrição' },
    { key: 'pontos', label: 'Pontos', render: (v) => (
      <span className={`font-bold font-display ${v > 0 ? 'text-green-400' : 'text-red-400'}`}>
        {v > 0 ? '+' : ''}{v}
      </span>
    )},
  ]

  return (
    <div className="space-y-5">
      <div className="card px-4 py-3 border border-background-600 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Tag size={22} className="text-primary-400" />
          <h1 className="text-2xl font-display font-bold text-white">Justificativas</h1>
        </div>
        <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nova
        </button>
      </div>

      <div className="card border border-background-600">
        <CrudTable columns={columns} data={justificativas} loading={loading}
          onEdit={abrirEditar} onDelete={handleDeletar} deletando={deletando}
          searchPlaceholder="Buscar justificativa..." />
      </div>

      {modalAberto && (
        <Modal title={editando ? 'Editar Justificativa' : 'Nova Justificativa'} onClose={fecharModal}>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="label">Descrição *</label>
              <input className="input" placeholder="Ex: Participação em aula" value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })} required maxLength={100} />
            </div>
            <div>
              <label className="label">Pontos * <span className="text-gray-500 font-normal">(negativo = penalidade)</span></label>
              <input className="input" type="number" placeholder="Ex: 10 ou -5" value={form.pontos}
                onChange={(e) => setForm({ ...form, pontos: e.target.value })} required />
              {form.pontos !== '' && (
                <p className={`text-xs mt-1 font-semibold ${Number(form.pontos) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Number(form.pontos) >= 0 ? `+${form.pontos} pontos (bônus)` : `${form.pontos} pontos (penalidade)`}
                </p>
              )}
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