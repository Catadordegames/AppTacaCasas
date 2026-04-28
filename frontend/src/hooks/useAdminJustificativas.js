import { useState, useEffect } from 'react'
import { useCrud } from './useCrud'

const FORM_VAZIO = { nome: '', pontos: '' }

export default function useAdminJustificativas() {
  const { data: justificativas, loading, loadingSave: salvando, loadingDelete: deletando, load, save, remove } = useCrud('/justificativas', 'Justificativa')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)

  useEffect(() => { load() }, [load])

  const abrirCriar = () => { setEditando(null); setForm(FORM_VAZIO); setModalAberto(true) }
  const abrirEditar = (j) => { setEditando(j); setForm({ nome: j.nome, pontos: j.pontos }); setModalAberto(true) }
  const fecharModal = () => { setModalAberto(false); setEditando(null) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    try { 
      const payload = { nome: form.nome, pontos: Number(form.pontos) }
      await save(payload, editando?.id); 
      fecharModal() 
    } catch {}
  }

  const handleDeletar = async (j) => {
    await remove(j.id)
  }

  return { justificativas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar }
}
