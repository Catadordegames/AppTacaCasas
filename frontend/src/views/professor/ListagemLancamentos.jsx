// ============================================================
// views/professor/ListagemLancamentos.jsx
// View de listagem de lancamentos com filtros avancados.
// ============================================================

import { useState, useMemo } from 'react'
import {
    ClipboardList,
    Filter,
    X,
    CalendarDays,
    User,
    Home,
    CheckSquare,
    Square,
} from 'lucide-react'
import useListagemLancamentos from '../../hooks/useListagemLancamentos'

function formatDate(dt) {
    return new Date(dt).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    })
}

export default function ListagemLancamentos() {
    const {
        lancamentos,
        casas,
        professores,
        loading,
        filtros,
        setFiltro,
        total,
    } = useListagemLancamentos()

    const [mostrarFiltros, setMostrarFiltros] = useState(false)

    const toggleFiltros = () => setMostrarFiltros((v) => !v)

    const isCustomChecked = filtros.is_custom
    const isPredefinidaChecked = filtros.is_predefinida

    // Garante que pelo menos uma opcao de justificativa esteja marcada
    const handleJustificativaToggle = (tipo) => {
        if (tipo === 'custom') {
            const novo = !isCustomChecked
            if (!novo && !isPredefinidaChecked) return // bloqueia desmarcar ambas
            setFiltro('is_custom', novo)
        } else {
            const novo = !isPredefinidaChecked
            if (!novo && !isCustomChecked) return // bloqueia desmarcar ambas
            setFiltro('is_predefinida', novo)
        }
    }

    const filtrosAtivos = useMemo(() => {
        const lista = []
        if (filtros.casa_id) {
            const c = casas.find((x) => String(x.id) === filtros.casa_id)
            lista.push(`Casa: ${c ? c.nome : filtros.casa_id}`)
        }
        if (filtros.professor_id) {
            const p = professores.find((x) => String(x.id) === filtros.professor_id)
            lista.push(`Professor: ${p ? p.nome : filtros.professor_id}`)
        }
        if (filtros.data_inicio) lista.push(`De: ${filtros.data_inicio}`)
        if (filtros.data_fim) lista.push(`Ate: ${filtros.data_fim}`)
        if (!isCustomChecked) lista.push('Pre-definidas')
        if (!isPredefinidaChecked) lista.push('Customizadas')
        return lista
    }, [filtros, casas, professores, isCustomChecked, isPredefinidaChecked])

    const limparFiltros = () => {
        setFiltro('casa_id', '')
        setFiltro('professor_id', '')
        setFiltro('data_inicio', '')
        setFiltro('data_fim', '')
        setFiltro('is_custom', true)
        setFiltro('is_predefinida', true)
    }

    return (
        <div className="space-y-4">
            {/* Cabecalho */}
            <div className="card px-4 py-3 border border-background-600 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <ClipboardList size={22} className="text-primary-400" />
                    <h1 className="text-2xl font-display font-bold text-white">
                        Listagem de Lancamentos
                    </h1>
                </div>
                <button
                    onClick={toggleFiltros}
                    className="btn-secondary flex items-center gap-1.5 text-sm py-1.5"
                >
                    {mostrarFiltros ? <X size={14} /> : <Filter size={14} />}
                    {mostrarFiltros ? 'Ocultar Filtros' : 'Filtros'}
                </button>
            </div>

            {/* Painel de filtros */}
            {mostrarFiltros && (
                <div className="card border border-background-600 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                            <label className="label text-xs flex items-center gap-1">
                                <Home size={12} /> Casa
                            </label>
                            <select
                                className="input text-sm py-1.5 w-full"
                                value={filtros.casa_id}
                                onChange={(e) => setFiltro('casa_id', e.target.value)}
                            >
                                <option value="">Todas</option>
                                {casas.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.brasao} {c.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label text-xs flex items-center gap-1">
                                <User size={12} /> Professor
                            </label>
                            <select
                                className="input text-sm py-1.5 w-full"
                                value={filtros.professor_id}
                                onChange={(e) => setFiltro('professor_id', e.target.value)}
                            >
                                <option value="">Todos</option>
                                {professores.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label text-xs flex items-center gap-1">
                                <CalendarDays size={12} /> De
                            </label>
                            <input
                                type="date"
                                className="input text-sm py-1.5 w-full"
                                value={filtros.data_inicio}
                                onChange={(e) => setFiltro('data_inicio', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="label text-xs flex items-center gap-1">
                                <CalendarDays size={12} /> Ate
                            </label>
                            <input
                                type="date"
                                className="input text-sm py-1.5 w-full"
                                value={filtros.data_fim}
                                onChange={(e) => setFiltro('data_fim', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Checkboxes de justificativa */}
                    <div className="flex items-center gap-4 pt-1">
                        <span className="text-xs text-gray-400">Justificativa:</span>
                        <button
                            onClick={() => handleJustificativaToggle('custom')}
                            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            {isCustomChecked ? (
                                <CheckSquare size={16} className="text-primary-400" />
                            ) : (
                                <Square size={16} className="text-gray-500" />
                            )}
                            Customizada
                        </button>
                        <button
                            onClick={() => handleJustificativaToggle('predefinida')}
                            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            {isPredefinidaChecked ? (
                                <CheckSquare size={16} className="text-primary-400" />
                            ) : (
                                <Square size={16} className="text-gray-500" />
                            )}
                            Pre-definida
                        </button>
                    </div>

                    {filtrosAtivos.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-xs text-gray-500">Ativos:</span>
                            {filtrosAtivos.map((f) => (
                                <span
                                    key={f}
                                    className="text-xs px-2 py-0.5 rounded-full bg-background-700 text-primary-300 border border-background-600"
                                >
                                    {f}
                                </span>
                            ))}
                            <button
                                onClick={limparFiltros}
                                className="text-xs text-red-400 hover:text-red-300 underline ml-1"
                            >
                                Limpar
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Cards de resumo */}
            <div className="grid grid-cols-2 gap-3">
                <div className="card border border-background-500 text-center">
                    <div className="text-2xl font-display font-bold text-primary-400">
                        {lancamentos.length}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Lancamentos</div>
                </div>
                <div
                    className={`card border text-center ${total >= 0 ? 'border-green-500/30' : 'border-red-500/30'
                        }`}
                >
                    <div
                        className={`text-2xl font-display font-bold ${total >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                    >
                        {total > 0 ? '+' : ''}
                        {total}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Pontos no filtro</div>
                </div>
            </div>

            {/* Lista */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : lancamentos.length === 0 ? (
                <div className="card text-center py-12 text-gray-500 border border-background-600">
                    <ClipboardList size={36} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhum lancamento encontrado.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {lancamentos.map((l) => (
                        <div
                            key={l.id}
                            className="card border border-background-600 flex items-start gap-3"
                        >
                            <div
                                className={`flex-shrink-0 w-14 text-center font-display font-bold text-lg rounded-lg py-1 ${l.pontuacao > 0
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'bg-red-500/10 text-red-400'
                                    }`}
                            >
                                {l.pontuacao > 0 ? '+' : ''}
                                {l.pontuacao}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white text-sm truncate">
                                    {l.justificativa_snapshot}
                                </p>
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500">
                                    <span>
                                        {l.casa_nome}
                                    </span>
                                    {l.turma_nome && <span>{l.turma_nome}</span>}
                                    {l.aluno_nome && <span>{l.aluno_nome}</span>}
                                    <span className="text-gray-600">
                                        por {l.professor_nome}
                                    </span>
                                    <span>{formatDate(l.data_lancamento)}</span>
                                </div>
                                {l.is_custom && (
                                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-primary-900/30 text-primary-400 border border-primary-700/30">
                                        Customizada
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
