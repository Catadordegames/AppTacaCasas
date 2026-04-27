// ============================================================
// views/admin/CadastroRapido.jsx
// Tela de cadastro rapido em lote para Alunos, Professores,
// Turmas e Justificativas. Acumula itens localmente e salva
// tudo de uma vez via POST /api/bulk-insert.
// ============================================================

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Plus, Save, Pencil, Trash2, Users, School, BookOpen, ClipboardList, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, PasswordRequirements, LoadingSpinner } from '../../components/ui'
import { validarSenha } from '../../utils/password'

// ── Configuracao de metadados por tabela ──────────────────────

const CONFIG_TABELAS = {
    alunos: {
        nome: 'Alunos',
        icone: Users,
        campos: [
            { name: 'nome', label: 'Nome Completo', type: 'text', required: true },
            { name: 'turma_id', label: 'Turma', type: 'select', source: '/turmas', required: true },
            { name: 'casa_id', label: 'Casa', type: 'select', source: '/casas', required: false },
        ],
        resumo: (item, opcoes) => {
            const turma = opcoes.turmas?.find(t => t.id === Number(item.turma_id))?.nome || item.turma_id
            const casa = opcoes.casas?.find(c => c.id === Number(item.casa_id))?.nome || ''
            return `${item.nome} — Turma: ${turma}${casa ? ` — Casa: ${casa}` : ''}`
        },
    },
    professores: {
        nome: 'Professores',
        icone: School,
        campos: [
            { name: 'nome', label: 'Nome', type: 'text', required: true },
            { name: 'senha', label: 'Senha Provisoria', type: 'password', required: true, props: { maxLength: 20, autoComplete: 'off', 'data-lpignore': 'true', preventSuggest: true } },
            {
                name: 'permissao', label: 'Perfil', type: 'select', options: [
                    { value: '1', label: 'Admin' },
                    { value: '2', label: 'Professor' },
                ], required: true
            },
            { name: 'casa_id', label: 'Casa Vinculada (Opcional)', type: 'select', source: '/casas', required: false },
        ],
        resumo: (item, opcoes) => {
            const casa = opcoes.casas?.find(c => c.id === Number(item.casa_id))?.nome || item.casa_id
            const perfil = item.permissao === '1' ? 'Admin' : 'Professor'
            return `${item.nome} — ${perfil}${casa ? ` — Casa: ${casa}` : ' — Sem Casa'}`
        },
    },
    turmas: {
        nome: 'Turmas',
        icone: BookOpen,
        campos: [
            { name: 'nome', label: 'Nome da Turma', type: 'text', required: true },
            {
                name: 'turno', label: 'Turno', type: 'select', options: [
                    { value: 'Matutino', label: 'Matutino' },
                    { value: 'Vespertino', label: 'Vespertino' },
                ], required: true
            },
        ],
        resumo: (item) => `${item.nome} — ${item.turno}`,
    },
    justificativas: {
        nome: 'Justificativas',
        icone: ClipboardList,
        campos: [
            { name: 'nome', label: 'Descricao', type: 'text', required: true },
            { name: 'pontos', label: 'Pontuacao', type: 'number', required: true },
        ],
        resumo: (item) => `${item.nome} — ${item.pontos} pts`,
    },
}

const TABELAS_OPTIONS = Object.entries(CONFIG_TABELAS).map(([key, cfg]) => ({
    value: key,
    label: cfg.nome,
}))

// ── Componente principal ──────────────────────────────────────

export default function CadastroRapido() {
    const { isAdmin } = useAuth()

    const [tabelaAtiva, setTabelaAtiva] = useState('')
    const [formData, setFormData] = useState({})
    const [rascunho, setRascunho] = useState([])
    const [salvando, setSalvando] = useState(false)
    const [opcoesFk, setOpcoesFk] = useState({})
    const [carregandoFk, setCarregandoFk] = useState(false)

    const config = tabelaAtiva ? CONFIG_TABELAS[tabelaAtiva] : null

    // Carrega dados das FKs quando a tabela muda
    useEffect(() => {
        if (!config) {
            setOpcoesFk({})
            setFormData({})
            return
        }

        const sources = new Set()
        config.campos.forEach(c => {
            if (c.source) sources.add(c.source)
        })

        if (sources.size === 0) return

        async function carregarFks() {
            setCarregandoFk(true)
            const novasOpcoes = {}
            try {
                for (const source of sources) {
                    const res = await api.get(source)
                    const key = source.replace('/', '')
                    novasOpcoes[key] = res.data
                }
                setOpcoesFk(novasOpcoes)
            } catch {
                toast.error('Erro ao carregar opcoes de selecao.')
            } finally {
                setCarregandoFk(false)
            }
        }

        carregarFks()
        // Limpa form ao trocar de tabela
        setFormData({})
    }, [tabelaAtiva])

    const handleChange = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const validarForm = useCallback(() => {
        if (!config) return false
        for (const campo of config.campos) {
            if (campo.required) {
                const val = formData[campo.name]
                if (val === undefined || val === null || val === '') {
                    toast.error(`Campo "${campo.label}" é obrigatório.`)
                    return false
                }
            }
        }
        
        if (tabelaAtiva === 'professores' && formData.senha) {
            const erroSenha = validarSenha(formData.senha)
            if (erroSenha) {
                toast.error(erroSenha)
                return false
            }
        }

        return true
    }, [config, formData, tabelaAtiva])

    const handleAdicionar = useCallback(() => {
        if (!validarForm()) return

        const novoItem = {
            _idLocal: crypto.randomUUID(),
            ...formData,
        }

        setRascunho(prev => [...prev, novoItem])
        // Preserva campos para facilitar cadastro sequencial
        if (tabelaAtiva === 'turmas') {
            setFormData({ turno: formData.turno })
        } else if (tabelaAtiva === 'alunos') {
            setFormData({ turma_id: formData.turma_id })
        } else if (tabelaAtiva === 'professores') {
            setFormData({ permissao: formData.permissao })
        } else {
            setFormData({})
        }
        toast.success('Item adicionado a lista.')
    }, [validarForm, formData, tabelaAtiva])

    const handleRemover = useCallback((idLocal) => {
        setRascunho(prev => prev.filter(item => item._idLocal !== idLocal))
    }, [])

    const handleEditar = useCallback((item) => {
        const { _idLocal, ...dados } = item
        setFormData(dados)
        setRascunho(prev => prev.filter(i => i._idLocal !== _idLocal))
    }, [])

    const handleSalvarTodos = useCallback(async () => {
        if (rascunho.length === 0) {
            toast.error('Adicione pelo menos um item a lista.')
            return
        }

        setSalvando(true)
        try {
            // Remove _idLocal antes de enviar
            const dados = rascunho.map(({ _idLocal, ...rest }) => rest)
            const res = await api.post('/bulk-insert', { tabela: tabelaAtiva, dados })
            toast.success(res.data.message)
            setRascunho([])
            setFormData({})
        } catch (err) {
            toast.error(err.response?.data?.error || 'Erro ao salvar.')
        } finally {
            setSalvando(false)
        }
    }, [rascunho, tabelaAtiva])

    const handleTrocarTabela = useCallback((valor) => {
        if (rascunho.length > 0 && valor !== tabelaAtiva) {
            if (!confirm('Trocar de tabela limpara a lista atual. Deseja continuar?')) return
            setRascunho([])
        }
        setTabelaAtiva(valor)
    }, [rascunho, tabelaAtiva])

    // ── Renderizacao dos campos do formulario ───────────────────

    const renderCampo = (campo) => {
        const { name, label, type, required, options, source } = campo
        const valor = formData[name] ?? ''

        if (type === 'select' && source) {
            const key = source.replace('/', '')
            const opcoes = opcoesFk[key]?.map(item => ({
                value: String(item.id),
                label: item.nome,
            })) || []

            return (
                <Select
                    key={name}
                    label={label}
                    required={required}
                    value={valor}
                    onChange={(e) => handleChange(name, e.target.value)}
                    disabled={carregandoFk}
                >
                    <option value="">{carregandoFk ? 'Carregando...' : 'Selecione...'}</option>
                    {opcoes.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </Select>
            )
        }

        if (type === 'select' && options) {
            return (
                <Select
                    key={name}
                    label={label}
                    required={required}
                    value={valor}
                    onChange={(e) => handleChange(name, e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </Select>
            )
        }

        return (
            <div key={name} className="flex flex-col">
                <Input
                    label={label}
                    type={type}
                    required={required}
                    value={valor}
                    onChange={(e) => handleChange(name, e.target.value)}
                    {...(campo.props || {})}
                />
                {name === 'senha' && <PasswordRequirements password={valor} />}
            </div>
        )
    }

    // ── Render ────────────────────────────────────────────────────

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <Card className="px-4 py-3 flex items-center gap-3 border-background-600">
                <Plus size={24} className="text-primary-400" />
                <h1 className="text-2xl font-display font-bold text-white">Cadastro Rápido</h1>
            </Card>

            {/* Seletor de tabela */}
            <Card>
                <div className="space-y-4">
                    <label className="label">Tabela *</label>
                    <Select
                        value={tabelaAtiva}
                        onChange={(e) => handleTrocarTabela(e.target.value)}
                    >
                        <option value="">Selecione uma tabela...</option>
                        {TABELAS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>
                </div>
            </Card>

            {/* Formulario */}
            {config && (
                <Card>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-background-600">
                            <config.icone size={18} className="text-primary-400" />
                            <h2 className="font-display font-semibold text-white">
                                Novo(a) {config.nome.slice(0, -1)}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {config.campos.map(renderCampo)}
                        </div>

                        <Button
                            onClick={handleAdicionar}
                            fullWidth
                            className="mt-2"
                        >
                            <Plus size={16} /> Adicionar à Lista
                        </Button>
                    </div>
                </Card>
            )}

            {/* Lista de Rascunho */}
            {rascunho.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display font-semibold text-white flex items-center gap-2">
                            <ClipboardList size={18} className="text-primary-400" />
                            Lista de Rascunho
                            <span className="text-sm text-primary-300 bg-background-700 px-2 py-0.5 rounded-full">
                                {rascunho.length}
                            </span>
                        </h2>
                    </div>

                    <div className="space-y-2">
                        {rascunho.map((item) => (
                            <div
                                key={item._idLocal}
                                className="flex items-center justify-between bg-background-800 border border-background-600 rounded-xl px-4 py-3 hover:bg-background-700 transition-colors"
                            >
                                <span className="text-sm text-gray-300 truncate pr-4">
                                    {config?.resumo(item, opcoesFk)}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleEditar(item)}
                                        className="text-gray-500 hover:text-primary-400 transition-colors p-1"
                                        title="Editar"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => handleRemover(item._idLocal)}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                        title="Remover"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={handleSalvarTodos}
                        loading={salvando}
                        disabled={salvando}
                        fullWidth
                        size="lg"
                    >
                        <Save size={18} />
                        Salvar Todos ({rascunho.length})
                    </Button>
                </div>
            )}

            {/* Estado vazio */}
            {tabelaAtiva && rascunho.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <AlertCircle size={32} className="mx-auto mb-3 text-gray-600" />
                    <p className="text-sm">Preencha os campos acima e clique em "Adicionar à Lista".</p>
                    <p className="text-xs mt-1">Os itens aparecerão aqui antes de serem salvos.</p>
                </div>
            )}
        </div>
    )
}
