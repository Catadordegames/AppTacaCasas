-- ============================================================
-- 005_fix_remodel.sql
-- Correção da migration 005 que falhou parcialmente no servidor.
-- Idempotente: pode ser executada múltiplas vezes com segurança.
-- ============================================================

-- ── 1. Coluna CPF (pode já existir da execução parcial) ─────
-- MariaDB não tem ADD COLUMN IF NOT EXISTS nativo, usamos procedure
DELIMITER //
CREATE PROCEDURE _fix_005()
BEGIN
    -- Adicionar coluna cpf se não existir
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'professores' 
          AND COLUMN_NAME = 'cpf'
    ) THEN
        ALTER TABLE professores ADD COLUMN cpf VARCHAR(11) NULL;
    END IF;
END //
DELIMITER ;
CALL _fix_005();
DROP PROCEDURE IF EXISTS _fix_005;

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
-- Usa CREATE INDEX IF NOT EXISTS (suportado no MariaDB 10.5+)
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
