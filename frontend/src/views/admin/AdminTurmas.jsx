import { useState, useEffect, useCallback } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'

const FORM_VAZIO = { nome: '', turno: 'Matutino' }
const TURNOS = ['Matutino', 'Vespertino', 'Noturno', 'Integral']

export default function AdminTurmas() {
  const [turmas, setTurmas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [salvando, setSalvando] = useState(false)
  const [deletando, setDeletando] = useState(null)

  const carregar = useCallback(async () => {
    try { setLoading(true); const { data } = await api.get('/turmas'); setTurmas(data) }
    catch { toast.error('Erro ao carregar turmas.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const abrirCriar = () => { setEditando(null); setForm(FORM_VAZIO); setModalAberto(true) }
  const abrirEditar = (t) => { setEditando(t); setForm({ nome: t.nome, turno: t.turno }); setModalAberto(true) }
  const fecharModal = () => { setModalAberto(false); setEditando(null) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    try {
      setSalvando(true)
      if (editando) { await api.put(`/turmas/${editando.id}`, form); toast.success('Turma atualizada!') }
      else { await api.post('/turmas', form); toast.success('Turma criada!') }
      fecharModal(); carregar()
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao salvar.') }
    finally { setSalvando(false) }
  }

  const handleDeletar = async (t) => {
    if (!confirm(`Deletar "${t.nome}"?`)) return
    try {
      setDeletando(t.id); await api.delete(`/turmas/${t.id}`)
      toast.success('Turma removida.'); setTurmas((prev) => prev.filter((x) => x.id !== t.id))
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao deletar.') }
    finally { setDeletando(null) }
  }

  const columns = [
    { key: 'nome',  label: 'Nome'  },
    { key: 'turno', label: 'Turno', render: (v) => (
      <span className="px-2 py-0.5 bg-background-600 rounded-full text-xs text-gray-300">{v}</span>
    )},
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen size={22} className="text-primary-400" />
          <h1 className="text-2xl font-display font-bold text-white">Turmas</h1>
        </div>
        <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nova Turma
        </button>
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