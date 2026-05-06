import { useState, useEffect, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function useListagemLancamentos() {
    const { usuario } = useAuth()
    const [lancamentos, setLancamentos] = useState([])
    const [casas, setCasas] = useState([])
    const [professores, setProfessores] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletando, setDeletando] = useState(false)

    // Modal de confirmação de exclusão
    const [modalExclusao, setModalExclusao] = useState({ aberto: false, lancamento: null })

    const [filtros, setFiltros] = useState({
        casa: '',
        professor_id: '',
        data_inicio: '',
        data_fim: '',
        is_custom: true,
        is_predefinida: true,
    })

    const setFiltro = useCallback((k, v) => {
        setFiltros((f) => ({ ...f, [k]: v }))
    }, [])

    const buildParams = useCallback(() => {
        const params = new URLSearchParams()
        if (filtros.casa) params.append('casa', filtros.casa)
        if (filtros.professor_id) params.append('professor_id', filtros.professor_id)
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio)
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim)
        if (filtros.is_custom && !filtros.is_predefinida) {
            params.append('is_custom', 'true')
        } else if (!filtros.is_custom && filtros.is_predefinida) {
            params.append('is_custom', 'false')
        }
        return params
    }, [filtros])

    const carregar = useCallback(async () => {
        try {
            setLoading(true)
            const params = buildParams()
            const [l, c, p] = await Promise.all([
                api.get(`/lancamentos?${params}`),
                api.get('/casas'),
                api.get('/professores/nomes'),
            ])
            setLancamentos(l.data)
            setCasas(c.data)
            setProfessores(p.data)
        } catch {
            toast.error('Erro ao carregar lançamentos.')
        } finally {
            setLoading(false)
        }
    }, [buildParams])

    useEffect(() => {
        carregar()
    }, [carregar])

    const total = useMemo(
        () => lancamentos.reduce((s, l) => s + l.pontuacao, 0),
        [lancamentos]
    )

    // Permissão: admin (permissao=1) ou autor do lançamento (por nome)
    const podeDeletar = useCallback((lancamento) =>
        usuario?.permissao === 1 || lancamento.professor === usuario?.nome,
        [usuario]
    )

    // Abre o modal de confirmação
    const pedirExclusao = useCallback((lancamento) => {
        setModalExclusao({ aberto: true, lancamento })
    }, [])

    const cancelarExclusao = useCallback(() => {
        if (!deletando) setModalExclusao({ aberto: false, lancamento: null })
    }, [deletando])

    // Executa a exclusão após confirmação no modal
    const confirmarExclusao = useCallback(async () => {
        const lancamento = modalExclusao.lancamento
        if (!lancamento) return
        try {
            setDeletando(true)
            await api.delete(`/lancamentos/${lancamento.id}`)
            setLancamentos((prev) => prev.filter((l) => l.id !== lancamento.id))
            toast.success('Lançamento removido.')
            setModalExclusao({ aberto: false, lancamento: null })
        } catch (err) {
            toast.error(err.response?.data?.error || 'Erro ao remover lançamento.')
        } finally {
            setDeletando(false)
        }
    }, [modalExclusao.lancamento])

    return {
        lancamentos,
        casas,
        professores,
        loading,
        deletando,
        filtros,
        setFiltro,
        carregar,
        total,
        podeDeletar,
        modalExclusao,
        pedirExclusao,
        cancelarExclusao,
        confirmarExclusao,
    }
}
