import { useState, useEffect } from 'react'
import { Plus, Users } from 'lucide-react'
import { useCrud } from '../../hooks/useCrud'
import { useFetch } from '../../hooks/useFetch'
import toast from 'react-hot-toast'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'

const FORM_VAZIO = { nome: '', senha: '', permissao: 2, casa_id: '' }

export default function AdminProfessores() {
  const { data: professores, loading, loadingSave: salvando, loadingDelete: deletando, load, save, remove } = useCrud('/professores', 'Professor')
  const { data: casas } = useFetch('/casas')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)

  useEffect(() => { load() }, [load])

  const abrirCriar = () => {
    setEditando(null)
    // Usa String() para garantir consistência de tipo com o value das <option> do select
    setForm({ ...FORM_VAZIO, casa_id: String(casas[0]?.id || '') })
    setModalAberto(true)
  }
  const abrirEditar = (p) => {
    setEditando(p)
    // Converte para string: selects HTML sempre comparam valores como string
    setForm({ nome: p.nome, senha: '', permissao: String(p.permissao), casa_id: String(p.casa_id) })
    setModalAberto(true)
  }
  const fecharModal = () => { setModalAberto(false); setEditando(null) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    if (!editando && !form.senha) { toast.error('Senha é obrigatória na criação.'); return }
    try {
      const payload = { ...form, permissao: Number(form.permissao), casa_id: Number(form.casa_id) }
      if (!payload.senha) delete payload.senha // não envia senha vazia na edição

      await save(payload, editando?.id)
      fecharModal()
    } catch { } // Handled internally
  }

  const handleDeletar = async (p) => {
    if (!confirm(`Deletar o professor "${p.nome}"?`)) return
    await remove(p.id)
  }

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'casa_nome', label: 'Casa' },
    {
      key: 'permissao', label: 'Perfil', render: (v) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${v === 2 ? 'bg-purple-900/60 text-purple-300' : 'bg-background-600 text-gray-400'}`}>
          {v === 2 ? 'ADMIN' : 'Professor'}
        </span>
      )
    },
  ]

  return (
    <div className="space-y-5">
      <div className="card px-4 py-3 border border-background-600 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-primary-400" />
          <h1 className="text-2xl font-display font-bold text-white">Professores</h1>
        </div>
        <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Professor
        </button>
      </div>

      <div className="card border border-background-600">
        <CrudTable columns={columns} data={professores} loading={loading}
          onEdit={abrirEditar} onDelete={handleDeletar} deletando={deletando}
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
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                required={!editando} />
            </div>
            <div>
              <label className="label">Perfil *</label>
              <select className="input" value={form.permissao}
                onChange={(e) => setForm({ ...form, permissao: e.target.value })}>
                <option value="1">Professor</option>
                <option value="2">Coordenação / Admin</option>
              </select>
            </div>
            <div>
              <label className="label">Casa *</label>
              <select className="input" value={form.casa_id}
                onChange={(e) => setForm({ ...form, casa_id: e.target.value })} required>
                <option value="">Selecione...</option>
                {casas.map((c) => <option key={c.id} value={String(c.id)}>{c.brasao} {c.nome}</option>)}
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