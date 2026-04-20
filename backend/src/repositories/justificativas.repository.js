const db = require('../config/database');

const JustificativasRepository = {
  async listar() {
    const [rows] = await db.query('SELECT * FROM justificativas ORDER BY nome');
    return rows;
  },
  async buscarPorId(id) {
    const [rows] = await db.query('SELECT * FROM justificativas WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async criar(nome, pontos) {
    const [result] = await db.query(
      'INSERT INTO justificativas (nome, pontos) VALUES (?, ?)',
      [nome, pontos]
    );
    return { id: result.insertId, nome, pontos };
  },
  async atualizar(id, nome, pontos) {
    await db.query('UPDATE justificativas SET nome = ?, pontos = ? WHERE id = ?', [nome, pontos, id]);
  },
  async deletar(id) {
    const [result] = await db.query('DELETE FROM justificativas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = JustificativasRepository;