import { useState, useEffect } from 'react'
import { useCrud } from './useCrud'
import { useFetch } from './useFetch'

const FORM_VAZIO = { nome: '', turma_id: '', casa_id: '' }

export default function useAdminAlunos() {
  const [filtroTurma, setFiltroTurma] = useState('')
  const [filtroCasa, setFiltroCasa] = useState('')

  const { data: alunos, loading, loadingSave: salvando, loadingDelete: deletando, load: loadAlunos, save, remove } = useCrud('/alunos', 'Aluno')
  const { data: casas } = useFetch('/casas')
  const { data: turmas } = useFetch('/turmas')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filtroTurma) params.append('turma_id', filtroTurma)
    if (filtroCasa) params.append('casa_id', filtroCasa)
    loadAlunos(params.toString())
  }, [filtroTurma, filtroCasa, loadAlunos])

  const abrirCriar = () => { setEditando(null); setForm(FORM_VAZIO); setModalAberto(true) }
  const abrirEditar = (a) => {
    setEditando(a)
    setForm({ nome: a.nome, turma_id: a.turma_id, casa_id: a.casa_id || '' })
    setModalAberto(true)
  }
  const fecharModal = () => { setModalAberto(false); setEditando(null) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, turma_id: Number(form.turma_id), casa_id: form.casa_id ? Number(form.casa_id) : null }
      await save(payload, editando?.id)
      fecharModal()
    } catch {}
  }

  const handleDeletar = async (a) => {
    await remove(a.id)
  }

  return { alunos, casas, turmas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar, filtroTurma, setFiltroTurma, filtroCasa, setFiltroCasa }
}
