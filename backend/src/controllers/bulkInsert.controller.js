// ============================================================
// controllers/bulkInsert.controller.js
// Recebe requisicao de bulk insert, delega para o service
// e retorna resposta padronizada.
// ============================================================

const BulkInsertService = require('../services/bulkInsert.service');

const BulkInsertController = {
    async criar(req, res, next) {
        try {
            const { tabela, dados } = req.body;
            const resultado = await BulkInsertService.inserirLote(tabela, dados);
            res.status(201).json(resultado);
        } catch (e) {
            next(e);
        }
    },
};

module.exports = BulkInsertController;
