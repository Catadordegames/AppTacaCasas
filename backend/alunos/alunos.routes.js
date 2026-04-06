const express = require('express');
const router = express.Router();
const AlunosController = require('../controllers/alunos.controller');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middleware');

router.get('/', autenticar, AlunosController.listar);
router.get('/:id', autenticar, AlunosController.buscarPorId);
router.post('/', autenticar, apenasAdmin, AlunosController.criar);
router.put('/:id', autenticar, apenasAdmin, AlunosController.atualizar);
router.delete('/:id', autenticar, apenasAdmin, AlunosController.deletar);

module.exports = router;