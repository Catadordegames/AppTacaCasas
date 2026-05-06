// ============================================================
// repositories/casas.repository.js
// v3: Sem atualizar(). Cascade NULL ao deletar.
// ============================================================

const db = require('../config/database');

const CasasRepository = {
  async listar() {
    const [rows] = await db.query('SELECT * FROM casas ORDER BY nome');
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query('SELECT * FROM casas WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async criar(nome, brasao) {
    const [result] = await db.query(
      'INSERT INTO casas (nome, brasao) VALUES (?, ?)',
      [nome, brasao]
    );
    return { id: result.insertId, nome, brasao };
  },

  /**
   * Deleta uma casa aplicando cascade NULL:
   * alunos e professores vinculados ficam com casa_id = NULL.
   */
  async deletar(id) {
    await db.query('UPDATE alunos SET casa_id = NULL WHERE casa_id = ?', [id]);
    await db.query('UPDATE professores SET casa_id = NULL WHERE casa_id = ?', [id]);
    const [result] = await db.query('DELETE FROM casas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = CasasRepository;