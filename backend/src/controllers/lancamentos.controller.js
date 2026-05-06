// ============================================================
// controllers/lancamentos.controller.js
// Controlador HTTP para lançamentos.
// Estrutura v3: filtros por texto (casa, turma, professor).
// ============================================================

const LancamentosService = require('../services/lancamentos.service');
const ProfessoresRepository = require('../repositories/professores.repository');

const LancamentosController = {
  async listar(req, res, next) {
    try {
      const filtros = {
        casa: req.query.casa,
        turma: req.query.turma,
        data_inicio: req.query.data_inicio,
        data_fim: req.query.data_fim,
      };

      // Suporte a filtro por professor_id: busca o nome para filtrar por texto
      if (req.query.professor_id) {
        const prof = await ProfessoresRepository.buscarPorId(req.query.professor_id);
        if (prof) filtros.professor = prof.nome;
      }

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

  async atualizar(req, res, next) {
    try {
      const atualizado = await LancamentosService.atualizar(req.params.id, req.usuario, req.body);
      res.json(atualizado);
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