// ============================================================
// repositories/bulkInsert.repository.js
// Executa INSERT em lote dentro de uma transacao MariaDB.
// Se qualquer INSERT falhar, todo o lote e revertido (ROLLBACK).
// ============================================================

const db = require('../config/database');

const TABELAS_PERMITIDAS = new Set([
    'alunos',
    'professores',
    'turmas',
    'justificativas',
]);

const BulkInsertRepository = {
    /**
     * Verifica se o nome da tabela esta na whitelist.
     * @param {string} tabela
     */
    tabelaPermitida(tabela) {
        return TABELAS_PERMITIDAS.has(tabela);
    },

    /**
     * Insere um array de objetos na tabela dentro de uma transacao.
     * @param {string} tabela - Nome da tabela (ja validado pela whitelist)
     * @param {Array<Object>} dados - Array de objetos com os dados
     * @returns {Promise<{count: number, ids: number[]}>}
     */
    async inserirLote(tabela, dados) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const ids = [];
            for (const item of dados) {
                const colunas = Object.keys(item);
                const valores = Object.values(item);
                const placeholders = colunas.map(() => '?').join(',');

                const [result] = await connection.query(
                    `INSERT INTO ${tabela} (${colunas.join(',')}) VALUES (${placeholders})`,
                    valores
                );
                ids.push(result.insertId);
            }

            await connection.commit();
            return { count: ids.length, ids };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },
};

module.exports = BulkInsertRepository;
