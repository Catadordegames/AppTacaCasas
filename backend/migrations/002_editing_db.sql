-- ============================================================
-- 002_editing_db.sql
-- Permite que a coluna casa_id da tabela professores seja nula (NULL)
-- Adiciona colunas de contato e flag de primeira senha
-- ============================================================

ALTER TABLE professores MODIFY casa_id INT NULL;
ALTER TABLE professores ADD COLUMN email VARCHAR(255) NULL;
ALTER TABLE professores ADD COLUMN telefone VARCHAR(50) NULL;
ALTER TABLE professores ADD COLUMN senha_alterada BOOLEAN NOT NULL DEFAULT FALSE;
