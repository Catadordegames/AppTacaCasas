// ============================================================
// repositories/lancamentos.repository.js
// Queries para a tabela lancamentos.
// Essa tabela guarda um SNAPSHOT histórico completo:
// mesmo que alunos/professores/casas sejam alterados depois,
// o lançamento mantém os dados do momento em que foi feito.
// Estrutura v3: sem FKs, somente campos de texto (snapshot puro).
// ============================================================

const db = require('../config/database');

const LancamentosRepository = {
  /**
   * Lista lançamentos com filtros opcionais.
   * Filtros são por texto (casa, turma, professor) e não por ID.
   */
  async listar(filtros = {}) {
    let query = `
      SELECT l.*
      FROM lancamentos l
      WHERE 1=1
    `;
    const params = [];

    if (filtros.professor) {
      query += ' AND l.professor LIKE ?';
      params.push(`%${filtros.professor}%`);
    }
    if (filtros.casa) {
      query += ' AND l.casa = ?';
      params.push(filtros.casa);
    }
    if (filtros.turma) {
      query += ' AND l.turma = ?';
      params.push(filtros.turma);
    }
    if (filtros.data_inicio) {
      query += ' AND l.data_lancamento >= ?';
      params.push(filtros.data_inicio);
    }
    if (filtros.data_fim) {
      query += ' AND l.data_lancamento <= ?';
      params.push(filtros.data_fim);
    }
    if (typeof filtros.is_custom === 'boolean') {
      query += ' AND l.is_custom = ?';
      params.push(filtros.is_custom ? 1 : 0);
    }

    query += ' ORDER BY l.data_lancamento DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query('SELECT * FROM lancamentos WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async criar(dados) {
    const {
      professor, casa,
      aluno, turma,
      justificativa, complemento,
      is_custom, turno,
      pontuacao, data_lancamento,
    } = dados;

    const [result] = await db.query(
      `INSERT INTO lancamentos
        (professor, casa, aluno, turma,
         justificativa, complemento,
         is_custom, turno, pontuacao, data_lancamento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        professor, casa,
        aluno || null, turma || null,
        justificativa, complemento || null,
        is_custom, turno || null,
        pontuacao, data_lancamento,
      ]
    );
    return result.insertId;
  },

  async atualizar(id, dados) {
    const { pontuacao, justificativa } = dados;
    const [result] = await db.query(
      'UPDATE lancamentos SET pontuacao = ?, justificativa = ? WHERE id = ?',
      [pontuacao, justificativa, id]
    );
    return result.affectedRows > 0;
  },

  async deletar(id) {
    const [result] = await db.query('DELETE FROM lancamentos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Deletar todos os lançamentos (usado no reset anual).
   */
  async deletarTodos() {
    await db.query('DELETE FROM lancamentos');
  },
};

module.exports = LancamentosRepository;