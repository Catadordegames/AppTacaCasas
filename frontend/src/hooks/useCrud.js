import { useState, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

/**
 * Hook universal para operações CRUD genéricas seguindo o princípio DRY.
 * 
 * @param {string} endpoint O segmento da API (ex: '/alunos')
 * @param {string} entityName Nome da entidade para os toasts (ex: 'Aluno')
 */
export function useCrud(endpoint, entityName = 'Item') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(null) // Armazena o ID sendo deletado

  // Função para buscar os dados (GET)
  const load = useCallback(async (queryParams = '') => {
    try {
      setLoading(true)
      const res = await api.get(`${endpoint}${queryParams ? `?${queryParams}` : ''}`)
      setData(res.data)
      return res.data
    } catch (err) {
      toast.error(`Erro ao carregar lista de ${entityName.toLowerCase()}s.`)
      throw err
    } finally {
      setLoading(false)
    }
  }, [endpoint, entityName])

  // Função para salvar (POST ou PUT dependendo se tem ID)
  const save = useCallback(async (payload, id = null) => {
    try {
      setLoadingSave(true)
      let res;
      if (id) {
        res = await api.put(`${endpoint}/${id}`, payload)
        toast.success(`${entityName} atualizado(a) com sucesso!`)
      } else {
        res = await api.post(endpoint, payload)
        toast.success(`${entityName} criado(a) com sucesso!`)
      }
      // Sempre que salva com sucesso, recarrega os dados do endpoint padrão
      await load()
      return res.data
    } catch (err) {
      toast.error(err.response?.data?.error || `Erro ao salvar ${entityName.toLowerCase()}.`)
      throw err
    } finally {
      setLoadingSave(false)
    }
  }, [endpoint, entityName, load])

  // Função para excluir (DELETE)
  const remove = useCallback(async (id) => {
    try {
      setLoadingDelete(id)
      await api.delete(`${endpoint}/${id}`)
      toast.success(`${entityName} removido(a) com sucesso.`)
      // Remove localmente sem precisar fazer outro GET
      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.error || `Erro ao remover ${entityName.toLowerCase()}.`)
      throw err
    } finally {
      setLoadingDelete(null)
    }
  }, [endpoint, entityName])

  return {
    data,
    loading,
    loadingSave,
    loadingDelete,
    load,
    save,
    remove,
    setData, // Exposto caso a view queira mutar o cache manualmente
  }
}
