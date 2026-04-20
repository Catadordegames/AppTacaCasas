const db = require('../config/database');

const TurmasRepository = {
  async listar() {
    const [rows] = await db.query('SELECT * FROM turmas ORDER BY nome');
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query('SELECT * FROM turmas WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async criar(nome, turno) {
    const [result] = await db.query(
      'INSERT INTO turmas (nome, turno) VALUES (?, ?)',
      [nome, turno]
    );
    return { id: result.insertId, nome, turno };
  },

  async atualizar(id, nome, turno) {
    const [result] = await db.query(
      'UPDATE turmas SET nome = ?, turno = ? WHERE id = ?',
      [nome, turno, id]
    );
    return result.affectedRows > 0;
  },

  async deletar(id) {
    const [result] = await db.query('DELETE FROM turmas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = TurmasRepository;