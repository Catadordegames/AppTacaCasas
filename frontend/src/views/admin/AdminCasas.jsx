// ============================================================
// pages/admin/AdminCasas.jsx
// CRUD completo de Casas (Equipes).
// Padrão que todas as outras páginas admin seguem:
// 1. carregar() — busca do backend
// 2. Modal de criação/edição com form controlado
// 3. handleSalvar() — POST ou PUT dependendo de `editando`
// 4. handleDeletar() — DELETE com confirmação
// ============================================================

import { useState, useEffect } from 'react'
import { Plus, Shield } from 'lucide-react'
import { useCrud } from '../../hooks/useCrud'
import toast from 'react-hot-toast'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'

const FORM_VAZIO = { nome: '', brasao: '' }

export default function AdminCasas() {
  const { data: casas, loading, loadingSave: salvando, loadingDelete: deletando, load, save, remove } = useCrud('/casas', 'Casa')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)

  useEffect(() => { load() }, [load])

  const abrirCriar = () => { setEditando(null); setForm(FORM_VAZIO); setModalAberto(true) }
  const abrirEditar = (casa) => { setEditando(casa); setForm({ nome: casa.nome, brasao: casa.brasao }); setModalAberto(true) }
  const fecharModal = () => { setModalAberto(false); setEditando(null); setForm(FORM_VAZIO) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.brasao.trim()) { toast.error('Preencha todos os campos.'); return }
    try {
      await save(form, editando?.id)
      fecharModal()
    } catch {} // handled in hook
  }

  const handleDeletar = async (casa) => {
    if (!confirm(`Deletar "${casa.nome}"? Esta ação não pode ser desfeita.`)) return
    await remove(casa.id)
  }

  const columns = [
    { key: 'brasao', label: 'Brasão', render: (v) => <span className="text-2xl">{v}</span> },
    { key: 'nome',   label: 'Nome'   },
  ]

  return (
    <div className="space-y-5">
      <div className="card px-4 py-3 border border-background-600 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Shield size={22} className="text-primary-400" />
          <h1 className="text-2xl font-display font-bold text-white">Casas</h1>
        </div>
        <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nova Casa
        </button>
      </div>

      <div className="card border border-background-600">
        <CrudTable
          columns={columns}
          data={casas}
          loading={loading}
          onEdit={abrirEditar}
          onDelete={handleDeletar}
          deletando={deletando}
          searchPlaceholder="Buscar casa..."
        />
      </div>

      {modalAberto && (
        <Modal title={editando ? 'Editar Casa' : 'Nova Casa'} onClose={fecharModal}>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="label">Nome *</label>
              <input className="input" placeholder="Ex: Casa Leão" value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div>
              <label className="label">Brasão (emoji ou URL) *</label>
              <input className="input" placeholder="Ex: 🦁" value={form.brasao}
                onChange={(e) => setForm({ ...form, brasao: e.target.value })} required />
              {form.brasao && <div className="text-center text-4xl mt-2">{form.brasao}</div>}
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