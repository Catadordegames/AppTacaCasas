// ============================================================
// controllers/auth.controller.js
// Responsável apenas por receber a requisição HTTP, chamar
// o service e formatar a resposta. Sem lógica de negócio aqui.
// ============================================================

const AuthService = require('../services/auth.service');

const AuthController = {
  async login(req, res, next) {
    try {
      const { nome, senha } = req.body;

      if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
      }

      const resultado = await AuthService.login(nome, senha);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;