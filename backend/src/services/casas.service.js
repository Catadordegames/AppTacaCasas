const CasasRepository = require('../repositories/casas.repository');

const CasasService = {
  async listar() {
    return CasasRepository.listar();
  },

  async buscarPorId(id) {
    const casa = await CasasRepository.buscarPorId(id);
    if (!casa) {
      const err = new Error('Casa não encontrada.');
      err.status = 404;
      throw err;
    }
    return casa;
  },

  async criar(nome, brasao) {
    if (!nome || !brasao) {
      const err = new Error('Nome e brasão são obrigatórios.');
      err.status = 400;
      throw err;
    }
    return CasasRepository.criar(nome, brasao);
  },

  async atualizar(id, nome, brasao) {
    await this.buscarPorId(id);
    if (!nome || !brasao) {
      const err = new Error('Nome e brasão são obrigatórios.');
      err.status = 400;
      throw err;
    }
    await CasasRepository.atualizar(id, nome, brasao);
    return CasasRepository.buscarPorId(id);
  },

  async deletar(id) {
    await this.buscarPorId(id);
    const ok = await CasasRepository.deletar(id);
    if (!ok) {
      const err = new Error('Não foi possível deletar a casa.');
      err.status = 500;
      throw err;
    }
  },
};

module.exports = CasasService;