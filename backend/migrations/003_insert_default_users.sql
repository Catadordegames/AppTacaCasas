-- ============================================================
-- 003_insert_default_users.sql
-- Adiciona usuários iniciais padrão solicitados
-- Senha para ambos: Liberdade
-- ============================================================

INSERT INTO professores (nome, senha, permissao, casa_id)
VALUES 
    -- Admin (permissao = 1)
    ('admin', '$2a$10$9pdiaorVaJ6qg9b.i5zzFepPY0t6yx8gXTEcRVyhhoGmlst9mfsuy', 1, NULL),
    -- Professor (permissao = 2)
    ('professor', '$2a$10$9pdiaorVaJ6qg9b.i5zzFepPY0t6yx8gXTEcRVyhhoGmlst9mfsuy', 2, NULL);
