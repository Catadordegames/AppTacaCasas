import { useState, useEffect } from 'react'
import { useCrud } from './useCrud'
import toast from 'react-hot-toast'

const FORM_VAZIO = { nome: '', brasao: '' }

export default function useAdminCasas() {
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
    try { await save(form, editando?.id); fecharModal() } catch {}
  }

  const handleDeletar = async (casa) => {
    if (!confirm(`Deletar "${casa.nome}"? Esta ação não pode ser desfeita.`)) return
    await remove(casa.id)
  }

  return { casas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar }
}
