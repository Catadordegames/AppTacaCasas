const express = require('express');
const router = express.Router();
const PerfilController = require('../controllers/perfil.controller');
const { autenticar } = require('../middlewares/auth.middleware');

router.use(autenticar);

// GET /api/perfil
router.get('/', PerfilController.getMe);
// PUT /api/perfil
router.put('/', PerfilController.updateMe);
// PUT /api/perfil/senha
router.put('/senha', PerfilController.updateSenha);
// PUT /api/perfil/cpf
router.put('/cpf', PerfilController.updateCPF);

module.exports = router;
