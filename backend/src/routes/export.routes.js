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
const AuthRepository = require('../repositories/auth.repository');
const AlunosRepository = require('../repositories/alunos.repository');
const ProfessoresRepository = require('../repositories/professores.repository');
const TurmasRepository = require('../repositories/turmas.repository');
const bcrypt = require('bcryptjs');
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
 * Função utilitária para formatar os lançamentos antes de exportar
 * Remove IDs de FKs e renomeia colunas para ficarem amigáveis
 */
const formatarLancamentosParaCSV = (rows) => {
  return rows.map(row => {
    let dataFormatada = row.data_lancamento;
    if (row.data_lancamento) {
      const d = new Date(row.data_lancamento);
      dataFormatada = d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    }

    return {
      'ID': row.id,
      'Data': dataFormatada,
      'Casa': row.casa_nome,
      'Pontos': row.pontuacao,
      'Professor': row.professor_nome,
      'Aluno': row.aluno_nome || '-',
      'Turma': row.turma_nome || '-',
      'Turno': row.turno || '-',
      'Justificativa': row.justificativa_snapshot,
      'Tipo': row.is_custom ? 'Customizada' : 'Pré-definida',
    };
  });
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

    let [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum lançamento encontrado para exportar.' });
    }

    const filename = `lancamentos_${new Date().toISOString().split('T')[0]}.csv`;
    
    // Passa pela esteira única (Geração -> Salvamento Fisico -> Validação Booleana)
    const rowsFormatadas = formatarLancamentosParaCSV(rows);
    const result = await gerarSalvarEValidarCSV(rowsFormatadas, filename);
    
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
 * GET /api/export/alunos
 * Exporta todos os alunos como CSV.
 */
router.get('/alunos', autenticar, apenasAdmin, async (req, res, next) => {
  try {
    const rows = await AlunosRepository.listar(); // Retorna com JOINs de turma e casa

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum aluno encontrado para exportar.' });
    }

    const rowsFormatadas = rows.map(r => ({
      'ID': r.id,
      'Aluno': r.nome,
      'Turma': r.turma_nome || '-',
      'Casa': r.casa_nome || '-'
    }));

    const filename = `alunos_${new Date().toISOString().split('T')[0]}.csv`;
    const result = await gerarSalvarEValidarCSV(rowsFormatadas, filename);
    enviarCSV(res, result, filename);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/export/professores
 * Exporta todos os professores como CSV.
 */
router.get('/professores', autenticar, apenasAdmin, async (req, res, next) => {
  try {
    const rows = await ProfessoresRepository.listar(); // Retorna com JOIN de casa

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nenhum professor encontrado para exportar.' });
    }

    const rowsFormatadas = rows.map(r => ({
      'ID': r.id,
      'Professor': r.nome,
      'Permissão': r.permissao === 1 ? 'Administrador' : 'Professor',
      'Casa do Coração': r.casa_nome || '-'
    }));

    const filename = `professores_${new Date().toISOString().split('T')[0]}.csv`;
    const result = await gerarSalvarEValidarCSV(rowsFormatadas, filename);
    enviarCSV(res, result, filename);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/export/turmas
 * Exporta todas as turmas como CSV.
 */
router.get('/turmas', autenticar, apenasAdmin, async (req, res, next) => {
  try {
    const rows = await TurmasRepository.listar();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nenhuma turma encontrada para exportar.' });
    }

    const rowsFormatadas = rows.map(r => ({
      'ID': r.id,
      'Turma': r.nome,
      'Turno': r.turno || '-'
    }));

    const filename = `turmas_${new Date().toISOString().split('T')[0]}.csv`;
    const result = await gerarSalvarEValidarCSV(rowsFormatadas, filename);
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
    const { confirmar, senha } = req.body;
    if (!confirmar || !senha) {
      return res.status(400).json({
        error: 'Envie { "confirmar": true, "senha": "sua_senha" } no body para confirmar o reset.',
      });
    }

    // Validação de senha
    const adminId = req.usuario.id; // Pegue o ID do admin que fez a requisição (do token jwt)
    const adminData = await AuthRepository.buscarPorId(adminId); // Vamos assumir que buscarPorId existe, se não usaremos query direta
    if (!adminData) {
        return res.status(401).json({ error: 'Administrador não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, adminData.senha);
    if (!senhaCorreta) {
        return res.status(401).json({ error: 'Senha incorreta. Reset cancelado.' });
    }

    let [rows] = await db.query('SELECT * FROM lancamentos ORDER BY data_lancamento DESC');
    
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Não há lançamentos para resetar.' });
    }

    const filename = `backup_reset_${new Date().toISOString().split('T')[0]}.csv`;
    
    // O caso "Crucial": Gera, Salva e Valida
    const rowsFormatadas = formatarLancamentosParaCSV(rows);
    const result = await gerarSalvarEValidarCSV(rowsFormatadas, filename);

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