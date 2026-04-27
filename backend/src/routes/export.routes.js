// ============================================================
// routes/export.routes.js
// Exportação CSV e Reset Anual.
// Apenas admins têm acesso.
// Atualizado para usar a Esteira Única de Exportação e Validação.
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const LancamentosRepository = require('../repositories/lancamentos.repository');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middleware');
const { gerarSalvarEValidarCSV } = require('../services/exports.service');

/**
 * Função utilitária para enviar o CSV validado de volta ao cliente.
 */
const enviarCSV = (res, result, filename) => {
  if (result.success && result.csvString) {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(result.csvString); 
  } else {
    res.status(500).json({ error: 'Falha ao gerar ou validar o arquivo CSV.' });
  }
};

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

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum lançamento encontrado para exportar.' });
    }

    const filename = `lancamentos_${new Date().toISOString().split('T')[0]}.csv`;
    
    // Passa pela esteira única (Geração -> Salvamento Fisico -> Validação Booleana)
    const result = await gerarSalvarEValidarCSV(rows, filename);
    
    enviarCSV(res, result, filename);
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

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum ranking disponível.' });
    }

    const filename = 'ranking.csv';
    const result = await gerarSalvarEValidarCSV(rows, filename);

    enviarCSV(res, result, filename);
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

    const [rows] = await db.query('SELECT * FROM lancamentos ORDER BY data_lancamento DESC');
    
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Não há lançamentos para resetar.' });
    }

    const filename = `backup_reset_${new Date().toISOString().split('T')[0]}.csv`;
    
    // O caso "Crucial": Gera, Salva e Valida
    const result = await gerarSalvarEValidarCSV(rows, filename);

    // Usa a trava booleana (validação)
    if (!result.success) {
      // Se deu falha ao salvar o backup fisicamente, ABORTA o reset
      return res.status(500).json({ 
        error: 'Falha de integridade ao criar arquivo de backup. Operação de Reset Cancelada.' 
      });
    }

    // Se chegou aqui, o backup está salvo e validado com sucesso!
    // Deleta todos os lançamentos
    await LancamentosRepository.deletarTodos();

    res.setHeader('X-Reset-Count', rows.length);
    enviarCSV(res, result, filename);
  } catch (err) {
    next(err);
  }
});

module.exports = router;