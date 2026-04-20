// ============================================================
// routes/export.routes.js
// Exportação CSV e Reset Anual.
// Apenas admins têm acesso.
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const LancamentosRepository = require('../repositories/lancamentos.repository');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middleware');

/**
 * Converte array de objetos para string CSV.
 */
function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]).join(',');
  const lines = rows.map((row) =>
    Object.values(row)
      .map((v) => {
        if (v === null || v === undefined) return '';
        const str = String(v);
        // Envolve em aspas se contiver vírgula, aspas ou quebra de linha
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
      .join(',')
  );
  return [headers, ...lines].join('\n');
}

/**
 * GET /api/export/lancamentos
 * Exporta todos os lançamentos (ou filtrados) como CSV.
 */
router.get('/lancamentos', autenticar, apenasAdmin, async (req, res, next) => {
  try {
    const { casa_id, turma_id, data_inicio, data_fim } = req.query;

    let query = 'SELECT * FROM lancamentos WHERE 1=1';
    const params = [];

    if (casa_id) { query += ' AND casa_id = ?'; params.push(casa_id); }
    if (turma_id) { query += ' AND turma_id = ?'; params.push(turma_id); }
    if (data_inicio) { query += ' AND data_lancamento >= ?'; params.push(data_inicio); }
    if (data_fim) { query += ' AND data_lancamento <= ?'; params.push(data_fim); }

    query += ' ORDER BY data_lancamento DESC';

    const [rows] = await db.query(query, params);

    const csv = toCSV(rows);
    const filename = `lancamentos_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM para Excel reconhecer UTF-8
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/export/ranking
 * Exporta o ranking atual como CSV.
 */
router.get('/ranking', autenticar, apenasAdmin, async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.nome AS casa,
        COALESCE(SUM(l.pontuacao), 0) AS total_pontos,
        COUNT(l.id) AS total_lancamentos
      FROM casas c
      LEFT JOIN lancamentos l ON c.id = l.casa_id
      GROUP BY c.id, c.nome
      ORDER BY total_pontos DESC
    `);

    const csv = toCSV(rows);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ranking.csv"');
    res.send('\uFEFF' + csv);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/export/reset
 * Reset anual: apaga todos os lançamentos após exportar.
 * OPERAÇÃO DESTRUTIVA — apenas admin.
 * Body: { confirmar: true } — segurança extra para evitar reset acidental.
 */
router.post('/reset', autenticar, apenasAdmin, async (req, res, next) => {
  try {
    if (!req.body.confirmar) {
      return res.status(400).json({
        error: 'Envie { "confirmar": true } no body para confirmar o reset.',
      });
    }

    // Gera o CSV antes de deletar (retorna no response)
    const [rows] = await db.query('SELECT * FROM lancamentos ORDER BY data_lancamento DESC');
    const csv = toCSV(rows);

    // Deleta todos os lançamentos
    await LancamentosRepository.deletarTodos();

    const filename = `backup_reset_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Reset-Count', rows.length);
    res.send('\uFEFF' + csv);
  } catch (err) {
    next(err);
  }
});

module.exports = router;