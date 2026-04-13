// ============================================================
// pages/admin/AdminCasas.jsx
// CRUD completo de Casas (Equipes).
// Padrão que todas as outras páginas admin seguem:
// 1. carregar() — busca do backend
// 2. Modal de criação/edição com form controlado
// 3. handleSalvar() — POST ou PUT dependendo de `editando`
// 4. handleDeletar() — DELETE com confirmação
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { Plus, Shield } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'

const FORM_VAZIO = { nome: '', brasao: '' }

export default function AdminCasas() {
  const [casas, setCasas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null) // null = criando, objeto = editando
  const [form, setForm] = useState(FORM_VAZIO)
  const [salvando, setSalvando] = useState(false)
  const [deletando, setDeletando] = useState(null)

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/casas')
      setCasas(data)
    } catch { toast.error('Erro ao carregar casas.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const abrirCriar = () => { setEditando(null); setForm(FORM_VAZIO); setModalAberto(true) }
  const abrirEditar = (casa) => { setEditando(casa); setForm({ nome: casa.nome, brasao: casa.brasao }); setModalAberto(true) }
  const fecharModal = () => { setModalAberto(false); setEditando(null); setForm(FORM_VAZIO) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.brasao.trim()) { toast.error('Preencha todos os campos.'); return }
    try {
      setSalvando(true)
      if (editando) {
        await api.put(`/casas/${editando.id}`, form)
        toast.success('Casa atualizada!')
      } else {
        await api.post('/casas', form)
        toast.success('Casa criada!')
      }
      fecharModal()
      carregar()
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao salvar.') }
    finally { setSalvando(false) }
  }

  const handleDeletar = async (casa) => {
    if (!confirm(`Deletar "${casa.nome}"? Esta ação não pode ser desfeita.`)) return
    try {
      setDeletando(casa.id)
      await api.delete(`/casas/${casa.id}`)
      toast.success('Casa removida.')
      setCasas((prev) => prev.filter((c) => c.id !== casa.id))
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao deletar.') }
    finally { setDeletando(null) }
  }

  const columns = [
    { key: 'brasao', label: 'Brasão', render: (v) => <span className="text-2xl">{v}</span> },
    { key: 'nome',   label: 'Nome'   },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={22} className="text-gold-400" />
          <h1 className="text-2xl font-display font-bold text-white">Casas</h1>
        </div>
        <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nova Casa
        </button>
      </div>

      <div className="card border border-dark-600">
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