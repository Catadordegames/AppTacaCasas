// ============================================================
// config/database.js
// Cria e exporta um pool de conexões com o MariaDB usando mysql2.
// Um pool reutiliza conexões existentes em vez de abrir uma nova
// a cada requisição, o que é muito mais eficiente em produção.
// ============================================================

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'taca_das_casas',
  waitForConnections: true,
  connectionLimit: 10,      // máximo de conexões simultâneas no pool
  queueLimit: 0,            // 0 = sem limite de fila
  timezone: '-03:00',       // Brasília (UTC-3)
  multipleStatements: true, // permite executar migrations com vários statements
});

// Testa a conexão ao inicializar
pool.getConnection()
  .then((conn) => {
    console.log('✅ Conectado ao MariaDB com sucesso');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MariaDB:', err.message);
    process.exit(1); // Encerra se não conseguir conectar ao banco
  });

module.exports = pool;