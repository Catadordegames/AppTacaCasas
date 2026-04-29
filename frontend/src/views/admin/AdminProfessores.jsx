import { Plus, Users, Download } from 'lucide-react'
import { useState } from 'react'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'
import PasswordRequirements from '../../components/ui/PasswordRequirements'
import useAdminProfessores from '../../hooks/useAdminProfessores'
import { downloadBlobFromApi } from '../../utils/downloadHelper'
import { useAuth } from '../../context/AuthContext'

export default function AdminProfessores() {
  const { usuario } = useAuth()
  const { professores, casas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar } = useAdminProfessores()

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'casa_nome', label: 'Casa', render: (v) => v || <span className="text-gray-500 italic">Sem Casa</span> },
    {
      key: 'permissao', label: 'Perfil', render: (v) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${v === 1 ? 'bg-purple-900/60 text-purple-300' : 'bg-background-600 text-gray-400'}`}>
          {v === 1 ? 'ADMIN' : 'Professor'}
        </span>
      )
    },
  ]

  const [isExporting, setIsExporting] = useState(false)
  const handleExportar = async () => {
    setIsExporting(true)
    try { await downloadBlobFromApi('/export/professores', 'professores.csv') }
    catch (e) { alert('Erro ao exportar professores.') }
    finally { setIsExporting(false) }
  }

  return (
    <div className="space-y-5">
      <div className="card px-4 py-3 border border-background-600 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-primary-400" />
          <h1 className="text-2xl font-display font-bold text-white">Professores</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportar} disabled={isExporting} className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={16} /> {isExporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
          <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Novo Professor
          </button>
        </div>
      </div>

      <div className="card border border-background-600">
        <CrudTable columns={columns} data={professores} loading={loading}
          onEdit={abrirEditar} onDelete={handleDeletar} deletando={deletando}
          canDelete={(p) => p.id !== usuario?.id}
          searchPlaceholder="Buscar professor..." />
      </div>

      {modalAberto && (
        <Modal title={editando ? 'Editar Professor' : 'Novo Professor'} onClose={fecharModal}>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="label">Nome *</label>
              <input className="input" placeholder="Nome completo" value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div>
              <label className="label">
                Senha {editando && <span className="text-gray-500 font-normal">(deixe em branco para manter)</span>}
              </label>
              <input className="input" type="password" placeholder="••••••••" value={form.senha}
                maxLength={20}
                autoComplete="off"
                data-lpignore="true"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                required={!editando} />
              <PasswordRequirements password={form.senha} />
            </div>
            <div>
              <label className="label">Perfil *</label>
              <select className="input" value={form.permissao}
                onChange={(e) => setForm({ ...form, permissao: e.target.value })}>
                <option value="1">Coordenação / Admin</option>
                <option value="2">Professor</option>
              </select>
            </div>
            <div>
              <label className="label">Casa (Opcional)</label>
              <select className="input" value={form.casa_id || ''}
                onChange={(e) => setForm({ ...form, casa_id: e.target.value })}>
                <option value="">Selecione (Nenhuma)</option>
                {casas.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
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