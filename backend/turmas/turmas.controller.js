const TurmasService = require('../services/turmas.service');

const TurmasController = {
  async listar(req, res, next) {
    try { res.json(await TurmasService.listar()); } catch (err) { next(err); }
  },
  async buscarPorId(req, res, next) {
    try { res.json(await TurmasService.buscarPorId(req.params.id)); } catch (err) { next(err); }
  },
  async criar(req, res, next) {
    try {
      const { nome, turno } = req.body;
      res.status(201).json(await TurmasService.criar(nome, turno));
    } catch (err) { next(err); }
  },
  async atualizar(req, res, next) {
    try {
      const { nome, turno } = req.body;
      res.json(await TurmasService.atualizar(req.params.id, nome, turno));
    } catch (err) { next(err); }
  },
  async deletar(req, res, next) {
    try { await TurmasService.deletar(req.params.id); res.status(204).send(); } catch (err) { next(err); }
  },
};

module.exports = TurmasController;