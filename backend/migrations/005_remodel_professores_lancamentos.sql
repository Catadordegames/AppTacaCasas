-- ============================================================
-- 005_remodel_professores_lancamentos.sql
-- Reestrutura: professores (UNIQUE + cpf) e lancamentos (sem FKs)
-- ============================================================

-- ── Tabela professores ──────────────────────────────────────
ALTER TABLE professores ADD COLUMN cpf VARCHAR(11) NULL;
ALTER TABLE professores ADD UNIQUE INDEX uq_professores_cpf (cpf);
ALTER TABLE professores ADD UNIQUE INDEX uq_professores_nome (nome);
ALTER TABLE professores ADD UNIQUE INDEX uq_professores_telefone (telefone);
ALTER TABLE professores ADD UNIQUE INDEX uq_professores_email (email);

-- ── Tabela lancamentos ──────────────────────────────────────
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
