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

  async atualizar(id, nome, brasao) {
    const [result] = await db.query(
      'UPDATE casas SET nome = ?, brasao = ? WHERE id = ?',
      [nome, brasao, id]
    );
    return result.affectedRows > 0;
  },

  async deletar(id) {
    const [result] = await db.query('DELETE FROM casas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = CasasRepository;