// ============================================================
// controllers/auth.controller.js
// Responsável apenas por receber a requisição HTTP, chamar
// o service e formatar a resposta. Sem lógica de negócio aqui.
// ============================================================

const AuthService = require('../services/auth.service');

const AuthController = {
  async login(req, res, next) {
    try {
      const { identificador, senha } = req.body;

      if (!identificador || !senha) {
        return res.status(400).json({ error: 'Usuario e senha sao obrigatorios.' });
      }

      const resultado = await AuthService.login(identificador, senha);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;