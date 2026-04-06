const JustificativasRepository = require('../repositories/justificativas.repository');

const JustificativasService = {
  async listar() { return JustificativasRepository.listar(); },

  async buscarPorId(id) {
    const j = await JustificativasRepository.buscarPorId(id);
    if (!j) { const e = new Error('Justificativa não encontrada.'); e.status = 404; throw e; }
    return j;
  },

  async criar(nome, pontos) {
    if (!nome || pontos === undefined) {
      const e = new Error('Nome e pontos são obrigatórios.'); e.status = 400; throw e;
    }
    return JustificativasRepository.criar(nome, pontos);
  },

  async atualizar(id, nome, pontos) {
    await this.buscarPorId(id);
    await JustificativasRepository.atualizar(id, nome, pontos);
    return JustificativasRepository.buscarPorId(id);
  },

  async deletar(id) {
    await this.buscarPorId(id);
    await JustificativasRepository.deletar(id);
  },
};

module.exports = JustificativasService;