-- ============================================================
-- 005_remodel_professores_lancamentos.sql
-- Reestrutura: professores (UNIQUE + cpf) e lancamentos (sem FKs)
-- Idempotente: seguro para executar após 005_fix_remodel.sql
-- ============================================================

-- ── Tabela professores ──────────────────────────────────────
ALTER TABLE professores ADD COLUMN IF NOT EXISTS cpf VARCHAR(11) NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_professores_cpf ON professores (cpf);
CREATE UNIQUE INDEX IF NOT EXISTS uq_professores_nome ON professores (nome);
CREATE UNIQUE INDEX IF NOT EXISTS uq_professores_telefone ON professores (telefone);
CREATE UNIQUE INDEX IF NOT EXISTS uq_professores_email ON professores (email);

-- ── Tabela lancamentos ──────────────────────────────────────
DROP TABLE IF EXISTS lancamentos;

CREATE TABLE IF NOT EXISTS lancamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor VARCHAR(255) NOT NULL,
    casa VARCHAR(100) NOT NULL,
    aluno VARCHAR(255),
    turma VARCHAR(100),
    justificativa VARCHAR(100) NOT NULL,
    complemento TEXT,
    is_custom BOOLEAN NOT NULL,
    turno VARCHAR(36),
    pontuacao INT NOT NULL,
    data_lancamento DATETIME NOT NULL
) ENGINE=InnoDB;
