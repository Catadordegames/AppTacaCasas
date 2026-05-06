// ============================================================
// controllers/professores.controller.js
// Controlador HTTP para professores.
// v3: cpf, email, telefone. Nome ineditável.
// ============================================================

const ProfessoresService = require('../services/professores.service');

const ProfessoresController = {
  async listar(req, res, next) {
    try { res.json(await ProfessoresService.listar()); } catch (e) { next(e); }
  },

  async listarNomes(req, res, next) {
    try {
      const lista = await ProfessoresService.listar();
      res.json(lista.map((p) => ({ id: p.id, nome: p.nome })));
    } catch (e) { next(e); }
  },

  async buscarPorId(req, res, next) {
    try { res.json(await ProfessoresService.buscarPorId(req.params.id)); } catch (e) { next(e); }
  },

  async criar(req, res, next) {
    try {
      const { nome, senha, permissao, casa_id, cpf, email, telefone } = req.body;
      res.status(201).json(await ProfessoresService.criar(nome, senha, permissao, casa_id, cpf, email, telefone));
    } catch (e) { next(e); }
  },

  async atualizar(req, res, next) {
    try {
      const { permissao, casa_id, senha, email, telefone, cpf } = req.body;
      res.json(await ProfessoresService.atualizar(req.params.id, {
        permissao,
        casa_id,
        email,
        telefone,
        cpf,
        novaSenha: senha,
      }));
    } catch (e) { next(e); }
  },

  async deletar(req, res, next) {
    try {
      await ProfessoresService.deletar(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  },
};

module.exports = ProfessoresController;