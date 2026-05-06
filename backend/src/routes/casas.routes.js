const express = require('express');
const router = express.Router();
const CasasController = require('../controllers/casas.controller');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middleware');
const upload = require('../config/upload');

// Público — qualquer um pode ver as casas (necessário para o placar)
router.get('/', CasasController.listar);
router.get('/:id', CasasController.buscarPorId);

// Apenas admin pode criar/deletar (casas não são editáveis)
router.post('/', autenticar, apenasAdmin, upload.single('brasaoFile'), CasasController.criar);
router.delete('/:id', autenticar, apenasAdmin, CasasController.deletar);

module.exports = router;