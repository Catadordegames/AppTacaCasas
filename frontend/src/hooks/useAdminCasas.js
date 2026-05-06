import { useState, useEffect } from 'react'
import { useCrud } from './useCrud'
import toast from 'react-hot-toast'

const FORM_VAZIO = { nome: '', brasao: '', arquivoBrasao: null }

export default function useAdminCasas() {
  const { data: casas, loading, loadingSave: salvando, loadingDelete: deletando, load, save, remove } = useCrud('/casas', 'Casa')

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)

  useEffect(() => { load() }, [load])

  const abrirCriar = () => { setForm(FORM_VAZIO); setModalAberto(true) }
  const fecharModal = () => { setModalAberto(false); setForm(FORM_VAZIO) }

  const handleSalvar = async (e) => {
    e.preventDefault()
    if (!form.nome.trim() || (!form.brasao.trim() && !form.arquivoBrasao)) { toast.error('Preencha o nome e insira um brasão.'); return }
    try {
      const formData = new FormData()
      formData.append('nome', form.nome)
      
      if (form.arquivoBrasao) {
        formData.append('brasaoFile', form.arquivoBrasao)
      } else {
        formData.append('brasao', form.brasao)
      }

      await save(formData)
      fecharModal()
    } catch {}
  }

  const handleDeletar = async (casa) => {
    await remove(casa.id)
  }

  return { casas, loading, salvando, deletando, modalAberto, form, setForm, abrirCriar, fecharModal, handleSalvar, handleDeletar }
}
