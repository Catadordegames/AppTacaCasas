// ============================================================
// repositories/lancamentos.repository.js
// Queries para a tabela lancamentos.
// Essa tabela guarda um SNAPSHOT histórico completo:
// mesmo que alunos/professores/casas sejam alterados depois,
// o lançamento mantém os dados do momento em que foi feito.
// ============================================================

const db = require('../config/database');

const LancamentosRepository = {
  /**
   * Lista lançamentos com filtros opcionais.
   * Professores verão apenas seus lançamentos no service.
   */
  async listar(filtros = {}) {
    let query = `
      SELECT l.*
      FROM lancamentos l
      WHERE 1=1
    `;
    const params = [];

    if (filtros.professor_id) {
      query += ' AND l.professor_id = ?';
      params.push(filtros.professor_id);
    }
    if (filtros.casa_id) {
      query += ' AND l.casa_id = ?';
      params.push(filtros.casa_id);
    }
    if (filtros.turma_id) {
      query += ' AND l.turma_id = ?';
      params.push(filtros.turma_id);
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
      professor_id, professor_nome,
      casa_id, casa_nome,
      aluno_id, aluno_nome,
      turma_id, turma_nome,
      justificativa_id, custom_justificativa,
      justificativa_snapshot, is_custom,
      turno, pontuacao, data_lancamento,
    } = dados;

    const [result] = await db.query(
      `INSERT INTO lancamentos
        (professor_id, professor_nome, casa_id, casa_nome,
         aluno_id, aluno_nome, turma_id, turma_nome,
         justificativa_id, custom_justificativa, justificativa_snapshot,
         is_custom, turno, pontuacao, data_lancamento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        professor_id, professor_nome,
        casa_id, casa_nome,
        aluno_id || null, aluno_nome || null,
        turma_id || null, turma_nome || null,
        justificativa_id || null, custom_justificativa || null,
        justificativa_snapshot, is_custom,
        turno || null, pontuacao, data_lancamento,
      ]
    );
    return result.insertId;
  },

  async atualizar(id, dados) {
    const { pontuacao, justificativa_snapshot } = dados;
    const [result] = await db.query(
      'UPDATE lancamentos SET pontuacao = ?, justificativa_snapshot = ? WHERE id = ?',
      [pontuacao, justificativa_snapshot, id]
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