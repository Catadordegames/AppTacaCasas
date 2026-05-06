import { useState, useEffect } from 'react'
import { useCrud } from './useCrud'
import { useFetch } from './useFetch'
import toast from 'react-hot-toast'
import { validarSenha } from '../utils/password'
import { formatCPF, formatPhone } from '../utils/formatters'
import { isValidCPF } from '../utils/validators'

// permissao: '2' = Professor (padrão ao criar). ADMIN = 1, PROFESSOR = 2.
const FORM_VAZIO = { nome: '', senha: '', permissao: '2', casa_id: '', cpf: '', email: '', telefone: '' }

export default function useAdminProfessores() {
  const { data: professores, loading, loadingSave: salvando, loadingDelete: deletando, load, save, remove } = useCrud('/professores', 'Professor')
  const { data: casas } = useFetch('/casas')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(FORM_VAZIO)

  useEffect(() => { load() }, [load])

  const abrirCriar = () => { setEditando(null); setForm({ ...FORM_VAZIO, casa_id: '' }); setModalAberto(true) }
  // Converte para String(): selects HTML sempre comparam values como string;
  // sem isso, o React não consegue fazer o match com as <option> se o valor
  // vier como number do JSON, causando o select não refletir a opção correta.
  const abrirEditar = (p) => {
    setEditando(p)
    setForm({
      nome: p.nome,
      senha: '',
      permissao: String(p.permissao),
      casa_id: p.casa_id ? String(p.casa_id) : '',
      cpf: p.cpf ? formatCPF(p.cpf) : '',
      email: p.email || '',
      telefone: p.telefone ? formatPhone(p.telefone) : '',
    })
    setModalAberto(true)
  }
  const fecharModal = () => { setModalAberto(false); setEditando(null) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    if (!editando && !form.senha) { toast.error('Senha é obrigatória na criação.'); return }
    if (form.senha) {
      const erroSenha = validarSenha(form.senha)
      if (erroSenha) { toast.error(erroSenha); return }
    }

    // CPF obrigatório na criação
    const cpfDigitos = form.cpf ? form.cpf.replace(/\D/g, '') : ''
    if (!editando && !cpfDigitos) {
      toast.error('CPF é obrigatório para criar um professor.')
      return
    }

    // Validar CPF se preenchido
    if (cpfDigitos && !isValidCPF(cpfDigitos)) {
      toast.error('CPF inválido. Verifique os dígitos informados.')
      return
    }

    try {
      const payload = {
        ...form,
        permissao: Number(form.permissao),
        casa_id: form.casa_id ? Number(form.casa_id) : null,
        // Enviar dígitos crus (sem formatação) ao backend
        cpf: cpfDigitos || undefined,
        telefone: form.telefone ? form.telefone.replace(/\D/g, '') : undefined,
      }
      if (!payload.senha) delete payload.senha
      // Nome não é enviado na edição (ineditável)
      if (editando) delete payload.nome

      await save(payload, editando?.id)
      fecharModal()
    } catch {}
  }

  const handleDeletar = async (p) => {
    await remove(p.id)
  }

  return { professores, casas, loading, salvando, deletando, modalAberto, editando, form, setForm, abrirCriar, abrirEditar, fecharModal, handleSalvar, handleDeletar }
}
