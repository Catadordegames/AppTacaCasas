// ============================================================
// routes/ranking.routes.js
// Endpoint público: qualquer pessoa (alunos, pais, etc.)
// pode ver o placar sem precisar de login.
// v3: JOIN por texto (l.casa = c.nome) em vez de FK.
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /api/ranking
 * Retorna a soma de pontos por casa, ordenada do maior para o menor.
 * É a página pública principal do sistema.
 */
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.id,
        c.nome,
        c.brasao,
        COALESCE(SUM(l.pontuacao), 0) AS total_pontos,
        COUNT(l.id) AS total_lancamentos
      FROM casas c
      LEFT JOIN lancamentos l ON l.casa = c.nome
      GROUP BY c.id, c.nome, c.brasao
      ORDER BY total_pontos DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;