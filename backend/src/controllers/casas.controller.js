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
      const novoBrasao = req.file ? `/api/uploads/brasoes/${req.file.filename}` : brasao;
      const nova = await CasasService.criar(nome, novoBrasao);
      res.status(201).json(nova);
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