const LancamentosService = require('../services/lancamentos.service');

const LancamentosController = {
  async listar(req, res, next) {
    try {
      const filtros = {
        casa_id: req.query.casa_id,
        turma_id: req.query.turma_id,
        data_inicio: req.query.data_inicio,
        data_fim: req.query.data_fim,
        professor_id: req.query.professor_id,
      };
      // Filtro de justificativa customizada: aceita "true", "false" ou omitido
      const isCustom = req.query.is_custom;
      if (isCustom === 'true') filtros.is_custom = true;
      else if (isCustom === 'false') filtros.is_custom = false;

      res.json(await LancamentosService.listar(req.usuario, filtros));
    } catch (e) { next(e); }
  },

  async buscarPorId(req, res, next) {
    try { res.json(await LancamentosService.buscarPorId(req.params.id)); } catch (e) { next(e); }
  },

  async criar(req, res, next) {
    try {
      const novo = await LancamentosService.criar(req.usuario, req.body);
      res.status(201).json(novo);
    } catch (e) { next(e); }
  },

  async deletar(req, res, next) {
    try {
      await LancamentosService.deletar(req.params.id, req.usuario);
      res.status(204).send();
    } catch (e) { next(e); }
  },
};

module.exports = LancamentosController;