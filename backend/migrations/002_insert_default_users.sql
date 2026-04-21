-- ============================================================
-- 002_insert_default_users.sql
-- Adiciona usuários iniciais padrão solicitados
-- Senha para ambos: Liberdade
-- ============================================================

-- Garante que exista pelo menos uma "Casa" (ID 1) para satisfazer a constraint Foreign Key
INSERT IGNORE INTO casas (id, nome, brasao) VALUES (1, 'Coordenação', '⚙️');

INSERT INTO professores (nome, senha, permissao, casa_id)
VALUES 
    -- Admin (permissao = 1)
    ('admin', '$2a$10$9pdiaorVaJ6qg9b.i5zzFepPY0t6yx8gXTEcRVyhhoGmlst9mfsuy', 1, 1),
    -- Professor (permissao = 2)
    ('professor', '$2a$10$9pdiaorVaJ6qg9b.i5zzFepPY0t6yx8gXTEcRVyhhoGmlst9mfsuy', 2, 1);
