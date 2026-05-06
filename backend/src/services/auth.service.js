// ============================================================
// services/auth.service.js
// Regras de negócio para autenticação: verifica senha e gera JWT.
// ============================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthRepository = require('../repositories/auth.repository');

const AuthService = {
  /**
   * Realiza login do professor.
   * Lança erros com status HTTP para o controller tratar.
   */
  async login(identificador, senha) {
    const professor = await AuthRepository.buscarPorNomeOuEmail(identificador);

    if (!professor) {
      const err = new Error('Credenciais inválidas.');
      err.status = 401;
      throw err;
    }

    const senhaCorreta = await bcrypt.compare(senha, professor.senha);
    if (!senhaCorreta) {
      const err = new Error('Credenciais inválidas.');
      err.status = 401;
      throw err;
    }

    // Gera o token JWT com os dados necessários para autorização
    const token = jwt.sign(
      {
        id: professor.id,
        nome: professor.nome,
        permissao: professor.permissao,
        casa_id: professor.casa_id,
        senha_alterada: professor.senha_alterada,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return {
      token,
      usuario: {
        id: professor.id,
        nome: professor.nome,
        cpf: professor.cpf || null,
        permissao: professor.permissao,
        casa_id: professor.casa_id,
        senha_alterada: professor.senha_alterada,
        email: professor.email,
        telefone: professor.telefone,
      },
    };
  },
};

module.exports = AuthService;