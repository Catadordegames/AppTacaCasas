const express = require('express');
const router = express.Router();
const ProfessoresController = require('../controllers/professores.controller');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middleware');

// Apenas admins gerenciam professores
router.get('/', autenticar, apenasAdmin, ProfessoresController.listar);
router.get('/:id', autenticar, apenasAdmin, ProfessoresController.buscarPorId);
router.post('/', autenticar, apenasAdmin, ProfessoresController.criar);
router.put('/:id', autenticar, apenasAdmin, ProfessoresController.atualizar);
router.delete('/:id', autenticar, apenasAdmin, ProfessoresController.deletar);

module.exports = router;