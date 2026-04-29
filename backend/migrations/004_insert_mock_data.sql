-- ============================================================
-- 004_insert_mock_data.sql
-- Insere dados falsos para testes (alunos, professores, lancamentos)
-- ============================================================

-- Garante que algumas turmas e justificativas existam antes de inserir alunos e lançamentos
INSERT IGNORE INTO turmas (nome, turno) VALUES
('6º A', 'Matutino'),
('6º B', 'Matutino'),
('7º A', 'Vespertino');

INSERT IGNORE INTO justificativas (nome, pontos) VALUES
('Participação em aula', 10),
('Trabalho em equipe', 20),
('Bom comportamento', 15),
('Olimpíada / Competição', 50);

-- Insere as novas casas personalizadas (ignorando IDs fixos caso não seja necessário, mas mantendo a ordem pra garantir)
INSERT INTO casas (nome, brasao) VALUES
('Pacha', '🐱'),
('Onraka', '🐯'),
('Aksum', '🐘'),
('Protos', '🐻');

-- Inserir alguns professores de mock (Hash bcrypt de "mock123")
INSERT INTO professores (nome, senha, permissao, casa_id) VALUES
('Prof. Mock Pacha', '$2a$10$wE7/L5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5O', 2, (SELECT id FROM casas WHERE nome = 'Pacha' LIMIT 1)),
('Profa. Mock Onraka', '$2a$10$wE7/L5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5O', 2, (SELECT id FROM casas WHERE nome = 'Onraka' LIMIT 1)),
('Prof. Mock Sem Casa', '$2a$10$wE7/L5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5O', 2, NULL);

-- Inserir alguns alunos mock
INSERT INTO alunos (nome, turma_id, casa_id) VALUES
('Aluno Mock Pacha 1', (SELECT id FROM turmas WHERE nome = '6º A' LIMIT 1), (SELECT id FROM casas WHERE nome = 'Pacha' LIMIT 1)),
('Aluno Mock Pacha 2', (SELECT id FROM turmas WHERE nome = '6º A' LIMIT 1), (SELECT id FROM casas WHERE nome = 'Pacha' LIMIT 1)),
('Aluno Mock Onraka 1', (SELECT id FROM turmas WHERE nome = '6º B' LIMIT 1), (SELECT id FROM casas WHERE nome = 'Onraka' LIMIT 1)),
('Aluno Mock Aksum 1', (SELECT id FROM turmas WHERE nome = '7º A' LIMIT 1), (SELECT id FROM casas WHERE nome = 'Aksum' LIMIT 1));

-- Inserir alguns lançamentos mock usando subqueries para garantir que os IDs estejam corretos
INSERT INTO lancamentos (professor_id, professor_nome, casa_id, casa_nome, aluno_id, aluno_nome, turma_id, turma_nome, justificativa_id, custom_justificativa, justificativa_snapshot, is_custom, turno, pontuacao, data_lancamento) VALUES
(
    (SELECT id FROM professores WHERE nome = 'Prof. Mock Pacha' LIMIT 1), 
    'Prof. Mock Pacha', 
    (SELECT id FROM casas WHERE nome = 'Pacha' LIMIT 1), 
    'Pacha', 
    (SELECT id FROM alunos WHERE nome = 'Aluno Mock Pacha 1' LIMIT 1), 
    'Aluno Mock Pacha 1', 
    (SELECT id FROM turmas WHERE nome = '6º A' LIMIT 1), 
    '6º A', 
    (SELECT id FROM justificativas WHERE nome = 'Participação em aula' LIMIT 1), 
    NULL, 
    'Participação em aula', 
    FALSE, 
    'Matutino', 
    10, 
    NOW()
),
(
    (SELECT id FROM professores WHERE nome = 'Profa. Mock Onraka' LIMIT 1), 
    'Profa. Mock Onraka', 
    (SELECT id FROM casas WHERE nome = 'Onraka' LIMIT 1), 
    'Onraka', 
    (SELECT id FROM alunos WHERE nome = 'Aluno Mock Onraka 1' LIMIT 1), 
    'Aluno Mock Onraka 1', 
    (SELECT id FROM turmas WHERE nome = '6º B' LIMIT 1), 
    '6º B', 
    (SELECT id FROM justificativas WHERE nome = 'Trabalho em equipe' LIMIT 1), 
    NULL, 
    'Trabalho em equipe', 
    FALSE, 
    'Matutino', 
    20, 
    NOW()
);
