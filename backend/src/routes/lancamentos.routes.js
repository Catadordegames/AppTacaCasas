const express = require('express');
const router = express.Router();
const LancamentosController = require('../controllers/lancamentos.controller');
const { autenticar } = require('../middlewares/auth.middleware');

// Todos os endpoints exigem autenticação
// A diferença professor/admin é tratada no service
router.get('/', autenticar, LancamentosController.listar);
router.get('/:id', autenticar, LancamentosController.buscarPorId);
router.post('/', autenticar, LancamentosController.criar);
router.delete('/:id', autenticar, LancamentosController.deletar);

module.exports = router;