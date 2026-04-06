const TurmasRepository = require('../repositories/turmas.repository');

const TurmasService = {
  async listar() { return TurmasRepository.listar(); },

  async buscarPorId(id) {
    const turma = await TurmasRepository.buscarPorId(id);
    if (!turma) { const e = new Error('Turma não encontrada.'); e.status = 404; throw e; }
    return turma;
  },

  async criar(nome, turno) {
    if (!nome || !turno) { const e = new Error('Nome e turno são obrigatórios.'); e.status = 400; throw e; }
    return TurmasRepository.criar(nome, turno);
  },

  async atualizar(id, nome, turno) {
    await this.buscarPorId(id);
    if (!nome || !turno) { const e = new Error('Nome e turno são obrigatórios.'); e.status = 400; throw e; }
    await TurmasRepository.atualizar(id, nome, turno);
    return TurmasRepository.buscarPorId(id);
  },

  async deletar(id) {
    await this.buscarPorId(id);
    await TurmasRepository.deletar(id);
  },
};

module.exports = TurmasService;