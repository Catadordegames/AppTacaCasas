// ============================================================
// repositories/professores.repository.js
// Queries SQL para a tabela professores.
// NUNCA retorna o campo senha em listagens — apenas quando
// necessário (ex: login). Isso é uma boa prática de segurança.
// ============================================================

const db = require('../config/database');

const ProfessoresRepository = {
  async listar() {
    // Exclui a senha do retorno público
    const [rows] = await db.query(
      `SELECT p.id, p.nome, p.permissao, p.casa_id, c.nome AS casa_nome
       FROM professores p
       LEFT JOIN casas c ON p.casa_id = c.id
       ORDER BY p.nome`
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      `SELECT p.id, p.nome, p.permissao, p.casa_id, c.nome AS casa_nome
       FROM professores p
       LEFT JOIN casas c ON p.casa_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async criar(nome, senhaHash, permissao, casa_id) {
    const [result] = await db.query(
      'INSERT INTO professores (nome, senha, permissao, casa_id) VALUES (?, ?, ?, ?)',
      [nome, senhaHash, permissao, casa_id]
    );
    return result.insertId;
  },

  async atualizar(id, nome, permissao, casa_id) {
    const [result] = await db.query(
      'UPDATE professores SET nome = ?, permissao = ?, casa_id = ? WHERE id = ?',
      [nome, permissao, casa_id, id]
    );
    return result.affectedRows > 0;
  },

  async atualizarSenha(id, senhaHash) {
    await db.query('UPDATE professores SET senha = ? WHERE id = ?', [senhaHash, id]);
  },

  async deletar(id) {
    const [result] = await db.query('DELETE FROM professores WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = ProfessoresRepository;