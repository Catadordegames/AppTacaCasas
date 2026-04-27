import { useState, useEffect } from 'react'
import { useCrud } from './useCrud'
import { useFetch } from './useFetch'
import toast from 'react-hot-toast'
import { validarSenha } from '../utils/password'

const FORM_VAZIO = { nome: '', senha: '', permissao: 2, casa_id: '' }

export default function useAdminProfessores() {
  const { data: professores, loading, loadingSave: salvando, loadingDelete: deletando, load, save, remove } = useCrud('/professores', 'Professor')
  const { data: casas } = useFetch('/casas')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)

  useEffect(() => { load() }, [load])

  const abrirCriar = () => { setEditando(null); setForm({ ...FORM_VAZIO, casa_id: '' }); setModalAberto(true) }
  const abrirEditar = (p) => { setEditando(p); setForm({ nome: p.nome, senha: '', permissao: p.permissao, casa_id: p.casa_id || '' }); setModalAberto(true) }
  const fecharModal = () => { setModalAberto(false); setEditando(null) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    if (!editando && !form.senha) { toast.error('Senha é obrigatória na criação.'); return }
    if (form.senha) {
      const erroSenha = validarSenha(form.senha)
      if (erroSenha) { toast.error(erroSenha); return }
    }
    try {
      const payload = { ...form, permissao: Number(form.permissao), casa_id: form.casa_id ? Number(form.casa_id) : null }
      if (!payload.senha) delete payload.senha

      await save(payload, editando?.id)
      fecharModal()
    } catch {}
  }

  const handleDeletar = async (p) => {
    if (!confirm(`Deletar o professor "${p.nome}"?`)) return
    await remove(p.id)
  }

  return { professores, casas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar }
}
