// ============================================================
// services/turmas.service.js
// v3: Nome read-only na edição, verificação de FK ao deletar.
// ============================================================

const TurmasRepository = require('../repositories/turmas.repository');
const db = require('../config/database');

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

  /**
   * Atualiza turma. Somente o turno é editável; o nome é preservado.
   */
  async atualizar(id, nome, turno) {
    const turma = await this.buscarPorId(id);
    if (!turno) { const e = new Error('Turno é obrigatório.'); e.status = 400; throw e; }
    // Nome é sempre preservado (ineditável)
    await TurmasRepository.atualizar(id, turma.nome, turno);
    return TurmasRepository.buscarPorId(id);
  },

  /**
   * Deleta turma. Verifica se há alunos vinculados antes.
   */
  async deletar(id) {
    await this.buscarPorId(id);

    // Verificar se existem alunos vinculados
    const [alunos] = await db.query('SELECT COUNT(*) as total FROM alunos WHERE turma_id = ?', [id]);
    if (alunos[0].total > 0) {
      const e = new Error(`Não é possível deletar esta turma. Existem ${alunos[0].total} aluno(s) vinculado(s). Remova ou transfira os alunos primeiro.`);
      e.status = 409;
      throw e;
    }

    await TurmasRepository.deletar(id);
  },
};

module.exports = TurmasService;