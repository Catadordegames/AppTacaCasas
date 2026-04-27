-- ============================================================
-- 003_remove_house_requirement_for_teachers.sql
-- Permite que a coluna casa_id da tabela professores seja nula (NULL)
-- ============================================================

ALTER TABLE professores MODIFY casa_id INT NULL;
