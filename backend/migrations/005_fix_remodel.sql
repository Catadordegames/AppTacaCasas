-- ============================================================
-- 005_fix_remodel.sql
-- Correção da migration 005 que falhou parcialmente no servidor.
-- Idempotente: pode ser executada múltiplas vezes com segurança.
-- Compatível com driver Node.js (sem DELIMITER/PROCEDURE).
-- ============================================================

-- ── 1. Coluna CPF (ignora erro se já existir) ───────────────
-- MariaDB 10.5+ suporta IF NOT EXISTS em ALTER TABLE ADD COLUMN
ALTER TABLE professores ADD COLUMN IF NOT EXISTS cpf VARCHAR(11) NULL;

-- ── 2. Limpar telefones duplicados antes do UNIQUE ──────────
-- Mantém o telefone no registro com menor ID, nullifica os demais
UPDATE professores p
JOIN (
    SELECT telefone, MIN(id) AS manter_id
    FROM professores
    WHERE telefone IS NOT NULL AND telefone != ''
    GROUP BY telefone
    HAVING COUNT(*) > 1
) dup ON p.telefone = dup.telefone AND p.id != dup.manter_id
SET p.telefone = NULL;

-- ── 3. Limpar emails duplicados antes do UNIQUE ─────────────
UPDATE professores p
JOIN (
    SELECT email, MIN(id) AS manter_id
    FROM professores
    WHERE email IS NOT NULL AND email != ''
    GROUP BY email
    HAVING COUNT(*) > 1
) dup ON p.email = dup.email AND p.id != dup.manter_id
SET p.email = NULL;

-- ── 4. Indexes UNIQUE (ignora se já existem) ────────────────
CREATE UNIQUE INDEX IF NOT EXISTS uq_professores_cpf ON professores (cpf);
CREATE UNIQUE INDEX IF NOT EXISTS uq_professores_nome ON professores (nome);
CREATE UNIQUE INDEX IF NOT EXISTS uq_professores_telefone ON professores (telefone);
CREATE UNIQUE INDEX IF NOT EXISTS uq_professores_email ON professores (email);

-- ── 5. Tabela lancamentos (recria) ──────────────────────────
DROP TABLE IF EXISTS lancamentos;

CREATE TABLE lancamentos (
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
