// ============================================================
// services/professores.service.js
// Lógica de negócio: hash de senha, validações, UNIQUE, etc.
// v3: cpf, email, telefone. Nome ineditável.
// ============================================================

const bcrypt = require('bcryptjs');
const ProfessoresRepository = require('../repositories/professores.repository');

const SALT_ROUNDS = 10;

/**
 * Trata erros de UNIQUE constraint do MySQL/MariaDB (código 1062).
 * Retorna uma mensagem amigável para o usuário.
 */
function tratarErroUnique(err) {
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    const msg = err.message || '';
    if (msg.includes('uq_professores_cpf')) return 'CPF já cadastrado.';
    if (msg.includes('uq_professores_nome')) return 'Nome já existe.';
    if (msg.includes('uq_professores_telefone')) return 'Telefone já cadastrado.';
    if (msg.includes('uq_professores_email')) return 'Email já cadastrado.';
    return 'Valor duplicado encontrado. Verifique os campos únicos.';
  }
  return null;
}

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

  async criar(nome, senha, permissao, casa_id, cpf, email, telefone) {
    if (!nome || !senha || permissao === undefined) {
      const e = new Error('Nome, senha e permissão são obrigatórios.');
      e.status = 400;
      throw e;
    }

    // CPF é obrigatório na criação
    if (!cpf) {
      const e = new Error('CPF é obrigatório para criar um professor.');
      e.status = 400;
      throw e;
    }
    // Garante permissao válida (1=admin, 2=professor)
    if (![1, 2].includes(Number(permissao))) {
      const e = new Error('Permissão deve ser 1 (admin) ou 2 (professor).');
      e.status = 400;
      throw e;
    }

    // Limpar dígitos de CPF e telefone
    const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : null;
    const telLimpo = telefone ? telefone.replace(/\D/g, '') : null;

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    try {
      const id = await ProfessoresRepository.criar(nome, senhaHash, permissao, casa_id, cpfLimpo, email, telLimpo);
      return ProfessoresRepository.buscarPorId(id);
    } catch (err) {
      const msgAmigavel = tratarErroUnique(err);
      if (msgAmigavel) {
        const e = new Error(msgAmigavel);
        e.status = 409;
        throw e;
      }
      throw err;
    }
  },

  async atualizar(id, dados) {
    const prof = await this.buscarPorId(id);

    const { permissao, casa_id, email, telefone, cpf, novaSenha } = dados;

    // Limpar dígitos de telefone e CPF
    const telLimpo = telefone ? telefone.replace(/\D/g, '') : null;

    // CPF só pode ser editado se o valor atual for NULL/vazio
    let cpfFinal = undefined; // undefined = não atualizar
    if (cpf !== undefined) {
      const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : null;
      if (!prof.cpf || prof.cpf.trim() === '') {
        cpfFinal = cpfLimpo;
      }
      // Se já tem CPF preenchido, ignora silenciosamente a tentativa de edição
    }

    try {
      await ProfessoresRepository.atualizar(id, {
        permissao,
        casa_id,
        email: email || null,
        telefone: telLimpo,
        cpf: cpfFinal,
      });

      // Senha só é atualizada se fornecida
      if (novaSenha) {
        const hash = await bcrypt.hash(novaSenha, SALT_ROUNDS);
        await ProfessoresRepository.atualizarSenha(id, hash);
      }

      return ProfessoresRepository.buscarPorId(id);
    } catch (err) {
      const msgAmigavel = tratarErroUnique(err);
      if (msgAmigavel) {
        const e = new Error(msgAmigavel);
        e.status = 409;
        throw e;
      }
      throw err;
    }
  },

  async deletar(id) {
    await this.buscarPorId(id);
    await ProfessoresRepository.deletar(id);
  },
};

module.exports = ProfessoresService;