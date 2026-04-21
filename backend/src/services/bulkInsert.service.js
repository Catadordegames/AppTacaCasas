// ============================================================
// services/bulkInsert.service.js
// Regras de negocio para bulk insert: validacao de tabela,
// campos obrigatorios e hash de senha para professores.
// ============================================================

const bcryptjs = require('bcryptjs');
const BulkInsertRepository = require('../repositories/bulkInsert.repository');

/** Schemas de validacao por tabela */
const SCHEMAS = {
    alunos: {
        obrigatorios: ['nome', 'turma_id'],
        opcionais: ['casa_id'],
    },
    professores: {
        obrigatorios: ['nome', 'senha', 'permissao', 'casa_id'],
        opcionais: [],
    },
    turmas: {
        obrigatorios: ['nome', 'turno'],
        opcionais: [],
    },
    justificativas: {
        obrigatorios: ['nome', 'pontos'],
        opcionais: [],
    },
};

const BulkInsertService = {
    async inserirLote(tabela, dados) {
        // 1. Validar tabela
        if (!BulkInsertRepository.tabelaPermitida(tabela)) {
            const erro = new Error('Tabela nao permitida para cadastro em lote.');
            erro.status = 400;
            throw erro;
        }

        // 2. Validar array
        if (!Array.isArray(dados) || dados.length === 0) {
            const erro = new Error('O campo "dados" deve ser um array nao vazio.');
            erro.status = 400;
            throw erro;
        }

        const schema = SCHEMAS[tabela];
        const todosCampos = [...schema.obrigatorios, ...schema.opcionais];

        // 3. Validar cada item
        const dadosProcessados = dados.map((item, index) => {
            // Verificar campos obrigatorios
            for (const campo of schema.obrigatorios) {
                if (item[campo] === undefined || item[campo] === null || item[campo] === '') {
                    const erro = new Error(`Item ${index + 1}: campo obrigatorio "${campo}" faltando.`);
                    erro.status = 400;
                    throw erro;
                }
            }

            // Filtrar apenas campos validos (ignora campos extras)
            const itemFiltrado = {};
            for (const campo of todosCampos) {
                if (item[campo] !== undefined && item[campo] !== null && item[campo] !== '') {
                    itemFiltrado[campo] = item[campo];
                }
            }

            // Para campos opcionais que podem ser null no banco
            for (const campo of schema.opcionais) {
                if (item[campo] === undefined || item[campo] === null || item[campo] === '') {
                    itemFiltrado[campo] = null;
                }
            }

            return itemFiltrado;
        });

        // 4. Hash de senha para professores
        if (tabela === 'professores') {
            for (const item of dadosProcessados) {
                item.senha = bcryptjs.hashSync(item.senha, 10);
            }
        }

        // 5. Converter pontos para numero (justificativas)
        if (tabela === 'justificativas') {
            for (const item of dadosProcessados) {
                item.pontos = parseInt(item.pontos, 10);
            }
        }

        // 6. Executar insert em lote
        const resultado = await BulkInsertRepository.inserirLote(tabela, dadosProcessados);

        return {
            message: `${resultado.count} ${tabela} cadastrado${resultado.count !== 1 ? 's' : ''} com sucesso`,
            insertedCount: resultado.count,
            ids: resultado.ids,
        };
    },
};

module.exports = BulkInsertService;
