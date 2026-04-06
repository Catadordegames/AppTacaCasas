const JustificativasService = require('../services/justificativas.service');

const JustificativasController = {
  async listar(req, res, next) {
    try { res.json(await JustificativasService.listar()); } catch (e) { next(e); }
  },
  async buscarPorId(req, res, next) {
    try { res.json(await JustificativasService.buscarPorId(req.params.id)); } catch (e) { next(e); }
  },
  async criar(req, res, next) {
    try {
      const { nome, pontos } = req.body;
      res.status(201).json(await JustificativasService.criar(nome, pontos));
    } catch (e) { next(e); }
  },
  async atualizar(req, res, next) {
    try {
      const { nome, pontos } = req.body;
      res.json(await JustificativasService.atualizar(req.params.id, nome, pontos));
    } catch (e) { next(e); }
  },
  async deletar(req, res, next) {
    try { await JustificativasService.deletar(req.params.id); res.status(204).send(); } catch (e) { next(e); }
  },
};

module.exports = JustificativasController;