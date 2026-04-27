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
      const { nome, senha, permissao, casa_id } = req.body;
      res.status(201).json(await ProfessoresService.criar(nome, senha, permissao, casa_id));
    } catch (e) { next(e); }
  },

  async atualizar(req, res, next) {
    try {
      const { nome, permissao, casa_id, senha } = req.body;
      res.json(await ProfessoresService.atualizar(req.params.id, nome, permissao, casa_id, senha));
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