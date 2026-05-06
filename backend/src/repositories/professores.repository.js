// ============================================================
// repositories/professores.repository.js
// Queries SQL para a tabela professores.
// NUNCA retorna o campo senha em listagens — apenas quando
// necessário (ex: login). Isso é uma boa prática de segurança.
// v3: inclui cpf, email, telefone. Nome e CPF ineditáveis.
// ============================================================

const db = require('../config/database');

const ProfessoresRepository = {
  async listar() {
    // Exclui a senha do retorno público
    const [rows] = await db.query(
      `SELECT p.id, p.nome, p.cpf, p.email, p.telefone, p.permissao, p.casa_id, c.nome AS casa_nome
       FROM professores p
       LEFT JOIN casas c ON p.casa_id = c.id
       ORDER BY p.nome`
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      `SELECT p.id, p.nome, p.cpf, p.email, p.telefone, p.permissao, p.casa_id, c.nome AS casa_nome
       FROM professores p
       LEFT JOIN casas c ON p.casa_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async criar(nome, senhaHash, permissao, casa_id, cpf, email, telefone) {
    const [result] = await db.query(
      'INSERT INTO professores (nome, senha, permissao, casa_id, cpf, email, telefone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, senhaHash, permissao, casa_id, cpf || null, email || null, telefone || null]
    );
    return result.insertId;
  },

  /**
   * Atualiza professor. Nome NÃO é editável.
   * CPF só é editável se o valor atual for NULL/vazio.
   */
  async atualizar(id, dados) {
    const { permissao, casa_id, email, telefone, cpf } = dados;

    let query = 'UPDATE professores SET permissao = ?, casa_id = ?, email = ?, telefone = ?';
    const params = [permissao, casa_id, email || null, telefone || null];

    // CPF só é atualizado se fornecido (o service garante que só envia quando permitido)
    if (cpf !== undefined) {
      query += ', cpf = ?';
      params.push(cpf || null);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.query(query, params);
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