const CasasService = require('../services/casas.service');

const CasasController = {
  async listar(req, res, next) {
    try {
      const casas = await CasasService.listar();
      res.json(casas);
    } catch (err) { next(err); }
  },

  async buscarPorId(req, res, next) {
    try {
      const casa = await CasasService.buscarPorId(req.params.id);
      res.json(casa);
    } catch (err) { next(err); }
  },

  async criar(req, res, next) {
    try {
      const { nome, brasao } = req.body;
      const nova = await CasasService.criar(nome, brasao);
      res.status(201).json(nova);
    } catch (err) { next(err); }
  },

  async atualizar(req, res, next) {
    try {
      const { nome, brasao } = req.body;
      const atualizada = await CasasService.atualizar(req.params.id, nome, brasao);
      res.json(atualizada);
    } catch (err) { next(err); }
  },

  async deletar(req, res, next) {
    try {
      await CasasService.deletar(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  },
};

module.exports = CasasController;