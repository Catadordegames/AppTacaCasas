// ============================================================
// config/runMigrations.js
// Sistema de migrations para MariaDB.
// Executa arquivos .sql em backend/migrations/ que ainda
// não constam na tabela _migrations.
// ============================================================

const fs = require('fs');
const path = require('path');
const pool = require('./database');

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'migrations');

/**
 * Garante que a tabela de controle _migrations exista.
 */
async function ensureMigrationsTable() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
}

/**
 * Retorna a lista de migrations já executadas.
 */
async function getExecutedMigrations() {
    const [rows] = await pool.query('SELECT filename FROM _migrations');
    return new Set(rows.map(r => r.filename));
}

/**
 * Executa uma migration e registra na tabela de controle.
 */
async function runMigration(filename) {
    const filepath = path.join(MIGRATIONS_DIR, filename);
    const sql = fs.readFileSync(filepath, 'utf-8');

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // O pool está configurado com multipleStatements: true, 
        // então podemos executar o arquivo SQL inteiro de uma vez.
        if (sql.trim().length > 0) {
            await conn.query(sql);
        }

        await conn.query(
            'INSERT INTO _migrations (filename) VALUES (?)',
            [filename]
        );

        await conn.commit();
        console.log(`✅ Migration aplicada: ${filename}`);
    } catch (err) {
        await conn.rollback();
        throw new Error(`Falha na migration ${filename}: ${err.message}`);
    } finally {
        conn.release();
    }
}

/**
 * Entrypoint: descobre arquivos pendentes e os executa em ordem.
 */
async function runMigrations() {
    if (!fs.existsSync(MIGRATIONS_DIR)) {
        console.log('📁 Pasta de migrations não encontrada. Pulando...');
        return;
    }

    const files = fs
        .readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.sql'))
        .sort();

    if (files.length === 0) {
        console.log('📁 Nenhuma migration encontrada. Pulando...');
        return;
    }

    await ensureMigrationsTable();
    const executed = await getExecutedMigrations();

    let appliedCount = 0;
    for (const file of files) {
        if (!executed.has(file)) {
            await runMigration(file);
            appliedCount++;
        }
    }

    if (appliedCount === 0) {
        console.log('✅ Todas as migrations já estão aplicadas.');
    } else {
        console.log(`🚀 ${appliedCount} migration(s) aplicada(s).`);
    }
}

module.exports = { runMigrations };
