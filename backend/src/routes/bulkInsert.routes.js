// ============================================================
// routes/bulkInsert.routes.js
// Rota POST /api/bulk-insert protegida por autenticacao admin.
// ============================================================

const express = require('express');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middleware');
const BulkInsertController = require('../controllers/bulkInsert.controller');

const router = express.Router();

router.post('/', autenticar, apenasAdmin, BulkInsertController.criar);

module.exports = router;
