// ============================================================
// services/professores.service.js
// Lógica de negócio: hash de senha, validações, etc.
// ============================================================

const bcrypt = require('bcryptjs');
const ProfessoresRepository = require('../repositories/professores.repository');

const SALT_ROUNDS = 10;

const ProfessoresService = {
  async listar() {
    return ProfessoresRepository.listar();
  },

  async buscarPorId(id) {
    const prof = await ProfessoresRepository.buscarPorId(id);
    if (!prof) {
      const e = new Error('Professor não encontrado.');
      e.status = 404;
      throw e;
    }
    return prof;
  },

  async criar(nome, senha, permissao, casa_id) {
    if (!nome || !senha || permissao === undefined || !casa_id) {
      const e = new Error('Nome, senha, permissão e casa são obrigatórios.');
      e.status = 400;
      throw e;
    }
    // Garante permissao válida (1=professor, 2=admin)
    if (![1, 2].includes(Number(permissao))) {
      const e = new Error('Permissão deve ser 1 (professor) ou 2 (admin).');
      e.status = 400;
      throw e;
    }
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    const id = await ProfessoresRepository.criar(nome, senhaHash, permissao, casa_id);
    return ProfessoresRepository.buscarPorId(id);
  },

  async atualizar(id, nome, permissao, casa_id, novaSenha) {
    await this.buscarPorId(id);
    await ProfessoresRepository.atualizar(id, nome, permissao, casa_id);
    // Senha só é atualizada se fornecida
    if (novaSenha) {
      const hash = await bcrypt.hash(novaSenha, SALT_ROUNDS);
      await ProfessoresRepository.atualizarSenha(id, hash);
    }
    return ProfessoresRepository.buscarPorId(id);
  },

  async deletar(id) {
    await this.buscarPorId(id);
    await ProfessoresRepository.deletar(id);
  },
};

module.exports = ProfessoresService;