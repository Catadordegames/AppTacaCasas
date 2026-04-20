const AlunosRepository = require('../repositories/alunos.repository');

const AlunosService = {
  async listar(filtros) { return AlunosRepository.listar(filtros); },

  async buscarPorId(id) {
    const aluno = await AlunosRepository.buscarPorId(id);
    if (!aluno) { const e = new Error('Aluno não encontrado.'); e.status = 404; throw e; }
    return aluno;
  },

  async criar(nome, turma_id, casa_id) {
    if (!nome || !turma_id) {
      const e = new Error('Nome e turma são obrigatórios.'); e.status = 400; throw e;
    }
    const id = await AlunosRepository.criar(nome, turma_id, casa_id);
    return AlunosRepository.buscarPorId(id);
  },

  async atualizar(id, nome, turma_id, casa_id) {
    await this.buscarPorId(id);
    await AlunosRepository.atualizar(id, nome, turma_id, casa_id);
    return AlunosRepository.buscarPorId(id);
  },

  async deletar(id) {
    await this.buscarPorId(id);
    await AlunosRepository.deletar(id);
  },
};

module.exports = AlunosService;