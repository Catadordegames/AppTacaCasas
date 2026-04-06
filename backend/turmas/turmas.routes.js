const express = require('express');
const router = express.Router();
const TurmasController = require('../controllers/turmas.controller');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middleware');

router.get('/', TurmasController.listar);
router.get('/:id', TurmasController.buscarPorId);
router.post('/', autenticar, apenasAdmin, TurmasController.criar);
router.put('/:id', autenticar, apenasAdmin, TurmasController.atualizar);
router.delete('/:id', autenticar, apenasAdmin, TurmasController.deletar);

module.exports = router;