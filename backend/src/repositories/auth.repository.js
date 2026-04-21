// ============================================================
// repositories/auth.repository.js
// Acesso a dados referente à autenticação (Login)
// ============================================================

const pool = require('../config/database');

const AuthRepository = {
  /**
   * Busca um professor/admin pelo nome para realizar o login
   * @param {string} nome
   * @returns {Promise<Object|null>} Retorna o registro ou undefined se não encontrar
   */
  async buscarPorNome(nome) {
    const [rows] = await pool.query('SELECT * FROM professores WHERE nome = ?', [nome]);
    return rows.length > 0 ? rows[0] : null;
  }
};

module.exports = AuthRepository;