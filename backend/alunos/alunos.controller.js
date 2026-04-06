const AlunosService = require('../services/alunos.service');

const AlunosController = {
  async listar(req, res, next) {
    try {
      const { turma_id, casa_id } = req.query;
      res.json(await AlunosService.listar({ turma_id, casa_id }));
    } catch (e) { next(e); }
  },
  async buscarPorId(req, res, next) {
    try { res.json(await AlunosService.buscarPorId(req.params.id)); } catch (e) { next(e); }
  },
  async criar(req, res, next) {
    try {
      const { nome, turma_id, casa_id } = req.body;
      res.status(201).json(await AlunosService.criar(nome, turma_id, casa_id));
    } catch (e) { next(e); }
  },
  async atualizar(req, res, next) {
    try {
      const { nome, turma_id, casa_id } = req.body;
      res.json(await AlunosService.atualizar(req.params.id, nome, turma_id, casa_id));
    } catch (e) { next(e); }
  },
  async deletar(req, res, next) {
    try { await AlunosService.deletar(req.params.id); res.status(204).send(); } catch (e) { next(e); }
  },
};

module.exports = AlunosController;