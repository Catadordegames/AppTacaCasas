import { Plus, BookOpen, Download } from 'lucide-react'
import { useState } from 'react'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'
import useAdminTurmas from '../../hooks/useAdminTurmas'
import { downloadBlobFromApi } from '../../utils/downloadHelper'

const TURNOS = ['Matutino', 'Vespertino', 'Noturno', 'Integral']

export default function AdminTurmas() {
  const { turmas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar } = useAdminTurmas()

  const columns = [
    { key: 'nome',  label: 'Nome'  },
    { key: 'turno', label: 'Turno', render: (v) => (
      <span className="px-2 py-0.5 bg-background-600 rounded-full text-xs text-gray-300">{v}</span>
    )},
  ]

  const [isExporting, setIsExporting] = useState(false)
  const handleExportar = async () => {
    setIsExporting(true)
    try { await downloadBlobFromApi('/export/turmas', 'turmas.csv') } 
    catch (e) { alert('Erro ao exportar turmas.') } 
    finally { setIsExporting(false) }
  }

  return (
    <div className="space-y-5">
      <div className="card px-4 py-3 border border-background-600 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <BookOpen size={22} className="text-primary-400" />
          <h1 className="text-2xl font-display font-bold text-white">Turmas</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportar} disabled={isExporting} className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={16} /> {isExporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
          <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Nova Turma
          </button>
        </div>
      </div>

      <div className="card border border-background-600">
        <CrudTable columns={columns} data={turmas} loading={loading}
          onEdit={abrirEditar} onDelete={handleDeletar} deletando={deletando}
          searchPlaceholder="Buscar turma..." />
      </div>

      {modalAberto && (
        <Modal title={editando ? 'Editar Turma' : 'Nova Turma'} onClose={fecharModal}>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="label">Nome *</label>
              <input className="input" placeholder="Ex: 7º A" value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div>
              <label className="label">Turno *</label>
              <select className="input" value={form.turno} onChange={(e) => setForm({ ...form, turno: e.target.value })}>
                {TURNOS.map((t) => <option key={t}>{t}</option>)}
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