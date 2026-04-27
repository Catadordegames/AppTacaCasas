import { useState, useEffect, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function useListagemLancamentos() {
    const [lancamentos, setLancamentos] = useState([])
    const [casas, setCasas] = useState([])
    const [professores, setProfessores] = useState([])
    const [loading, setLoading] = useState(true)

    const [filtros, setFiltros] = useState({
        casa_id: '',
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
        if (filtros.casa_id) params.append('casa_id', filtros.casa_id)
        if (filtros.professor_id) params.append('professor_id', filtros.professor_id)
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio)
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim)
        // Apenas envia is_custom se somente um tipo estiver selecionado
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
            toast.error('Erro ao carregar lancamentos.')
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

    return {
        lancamentos,
        casas,
        professores,
        loading,
        filtros,
        setFiltro,
        carregar,
        total,
    }
}
