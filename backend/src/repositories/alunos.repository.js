const db = require('../config/database');

const AlunosRepository = {
  async listar(filtros = {}) {
    let query = `
      SELECT a.id, a.nome, a.turma_id, t.nome AS turma_nome,
             a.casa_id, c.nome AS casa_nome
      FROM alunos a
      LEFT JOIN turmas t ON a.turma_id = t.id
      LEFT JOIN casas c ON a.casa_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filtros.turma_id) {
      query += ' AND a.turma_id = ?';
      params.push(filtros.turma_id);
    }
    if (filtros.casa_id) {
      query += ' AND a.casa_id = ?';
      params.push(filtros.casa_id);
    }

    query += ' ORDER BY a.nome';
    const [rows] = await db.query(query, params);
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      `SELECT a.id, a.nome, a.turma_id, t.nome AS turma_nome,
              a.casa_id, c.nome AS casa_nome
       FROM alunos a
       LEFT JOIN turmas t ON a.turma_id = t.id
       LEFT JOIN casas c ON a.casa_id = c.id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async criar(nome, turma_id, casa_id) {
    const [result] = await db.query(
      'INSERT INTO alunos (nome, turma_id, casa_id) VALUES (?, ?, ?)',
      [nome, turma_id, casa_id || null]
    );
    return result.insertId;
  },

  async atualizar(id, nome, turma_id, casa_id) {
    const [result] = await db.query(
      'UPDATE alunos SET nome = ?, turma_id = ?, casa_id = ? WHERE id = ?',
      [nome, turma_id, casa_id || null, id]
    );
    return result.affectedRows > 0;
  },

  async deletar(id) {
    const [result] = await db.query('DELETE FROM alunos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = AlunosRepository;