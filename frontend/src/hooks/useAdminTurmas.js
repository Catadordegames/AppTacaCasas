import { useState, useEffect } from 'react'
import { useCrud } from './useCrud'

const FORM_VAZIO = { nome: '', turno: 'Matutino' }

export default function useAdminTurmas() {
  const { data: turmas, loading, loadingSave: salvando, loadingDelete: deletando, load, save, remove } = useCrud('/turmas', 'Turma')
  
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)

  useEffect(() => { load() }, [load])

  const abrirCriar = () => { setEditando(null); setForm(FORM_VAZIO); setModalAberto(true) }
  const abrirEditar = (t) => { setEditando(t); setForm({ nome: t.nome, turno: t.turno }); setModalAberto(true) }
  const fecharModal = () => { setModalAberto(false); setEditando(null) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    try { await save(form, editando?.id); fecharModal() } catch {}
  }

  const handleDeletar = async (t) => {
    await remove(t.id)
  }

  return { turmas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar }
}
