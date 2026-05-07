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
  },

  /**
   * Busca um professor/admin pelo nome, email ou CPF para realizar o login
   * @param {string} identificador
   * @returns {Promise<Object|null>}
   */
  async buscarPorIdentificador(identificador) {
    // Normaliza CPF removendo pontos e traço (ex: 123.456.789-00 -> 12345678900)
    const cpfNormalizado = identificador.replace(/[\.\-]/g, '');

    const [rows] = await pool.query(
      'SELECT * FROM professores WHERE nome = ? OR email = ? OR cpf = ? LIMIT 1',
      [identificador, identificador, cpfNormalizado]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Busca um professor/admin pelo ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async buscarPorId(id) {
    const [rows] = await pool.query('SELECT * FROM professores WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
};

module.exports = AuthRepository;