import { useState, useEffect, useCallback } from 'react'
import { Plus, Tag } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'

const FORM_VAZIO = { nome: '', pontos: '' }

export default function AdminJustificativas() {
  const [justificativas, setJustificativas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [salvando, setSalvando] = useState(false)
  const [deletando, setDeletando] = useState(null)

  const carregar = useCallback(async () => {
    try { setLoading(true); const { data } = await api.get('/justificativas'); setJustificativas(data) }
    catch { toast.error('Erro ao carregar.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const abrirCriar = () => { setEditando(null); setForm(FORM_VAZIO); setModalAberto(true) }
  const abrirEditar = (j) => { setEditando(j); setForm({ nome: j.nome, pontos: j.pontos }); setModalAberto(true) }
  const fecharModal = () => { setModalAberto(false); setEditando(null) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    try {
      setSalvando(true)
      const payload = { nome: form.nome, pontos: Number(form.pontos) }
      if (editando) { await api.put(`/justificativas/${editando.id}`, payload); toast.success('Justificativa atualizada!') }
      else { await api.post('/justificativas', payload); toast.success('Justificativa criada!') }
      fecharModal(); carregar()
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao salvar.') }
    finally { setSalvando(false) }
  }

  const handleDeletar = async (j) => {
    if (!confirm(`Deletar "${j.nome}"?`)) return
    try {
      setDeletando(j.id); await api.delete(`/justificativas/${j.id}`)
      toast.success('Removida.'); setJustificativas((prev) => prev.filter((x) => x.id !== j.id))
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao deletar.') }
    finally { setDeletando(null) }
  }

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
      <div className="flex items-center justify-between">
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