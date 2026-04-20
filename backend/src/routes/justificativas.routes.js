const express = require('express');
const router = express.Router();
const JustificativasController = require('../controllers/justificativas.controller');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middleware');

// Professores precisam ver justificativas para lançar pontos
router.get('/', autenticar, JustificativasController.listar);
router.get('/:id', autenticar, JustificativasController.buscarPorId);
router.post('/', autenticar, apenasAdmin, JustificativasController.criar);
router.put('/:id', autenticar, apenasAdmin, JustificativasController.atualizar);
router.delete('/:id', autenticar, apenasAdmin, JustificativasController.deletar);

module.exports = router;