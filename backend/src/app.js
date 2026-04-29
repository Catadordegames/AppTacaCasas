// ============================================================
// src/app.js
// Configuração central do Express: middlewares globais e rotas.
// Separar do index.js facilita testes unitários futuros.
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');

// Importa todos os roteadores
const authRoutes = require('./routes/auth.routes');
const casasRoutes = require('./routes/casas.routes');
const turmasRoutes = require('./routes/turmas.routes');
const professoresRoutes = require('./routes/professores.routes');
const alunosRoutes = require('./routes/alunos.routes');
const justificativasRoutes = require('./routes/justificativas.routes');
const lancamentosRoutes = require('./routes/lancamentos.routes');
const rankingRoutes = require('./routes/ranking.routes');
const exportRoutes = require('./routes/export.routes');
const bulkInsertRoutes = require('./routes/bulkInsert.routes');
const perfilRoutes = require('./routes/perfil.routes');

const app = express();

// ── Middlewares Globais ──────────────────────────────────────
// Permite requisições de origens diferentes (necessário para o frontend em outro container)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Interpreta corpo das requisições como JSON
app.use(express.json());

// Serve arquivos estáticos da pasta mapeada no volume (uploads)
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Rotas ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/casas', casasRoutes);
app.use('/api/turmas', turmasRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/justificativas', justificativasRoutes);
app.use('/api/lancamentos', lancamentosRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/bulk-insert', bulkInsertRoutes);
app.use('/api/perfil', perfilRoutes);

const pool = require('./config/database');

// ── Health Check ─────────────────────────────────────────────
// Rota útil para Nginx e para o próprio dev checar fisicamente o banco
app.get(['/', '/api/health'], async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      api: 'online', 
      database: 'connected ✅', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      api: 'online', 
      database: 'disconnected ❌', 
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// ── Middleware de Erro Global ─────────────────────────────────
// Captura erros não tratados e retorna resposta padronizada
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);

  // Captura erros de foreign key do MariaDB (ex: tentar apagar algo que é FK em outra tabela)
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({ 
      error: 'Não é possível excluir este item pois outros objetos dependem dele.' 
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
});

module.exports = app;