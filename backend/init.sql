-- ============================================================
-- init.sql — Script de inicialização do banco de dados
-- Executado automaticamente pelo MariaDB ao subir o container
-- pela primeira vez (quando /var/lib/mysql está vazio).
-- ============================================================
 
CREATE DATABASE IF NOT EXISTS taca_das_casas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
 
USE taca_das_casas;
 
-- ── Tabelas ──────────────────────────────────────────────────
 
CREATE TABLE IF NOT EXISTS casas (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nome   VARCHAR(100) NOT NULL,
  brasao VARCHAR(255) NOT NULL
);
 
CREATE TABLE IF NOT EXISTS turmas (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(100) NOT NULL,
  turno VARCHAR(100) NOT NULL
);
 
CREATE TABLE IF NOT EXISTS justificativas (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nome   VARCHAR(100) NOT NULL,
  pontos INT          NOT NULL
);
 
CREATE TABLE IF NOT EXISTS professores (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  senha     VARCHAR(255) NOT NULL,
  permissao INT          NOT NULL,
  casa_id   INT          NOT NULL,
  CONSTRAINT fk_professores_casa FOREIGN KEY (casa_id) REFERENCES casas(id)
);
 
CREATE TABLE IF NOT EXISTS alunos (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nome     VARCHAR(100) NOT NULL,
  turma_id INT          NOT NULL,
  casa_id  INT,
  CONSTRAINT fk_alunos_casa  FOREIGN KEY (casa_id)  REFERENCES casas(id),
  CONSTRAINT fk_alunos_turma FOREIGN KEY (turma_id) REFERENCES turmas(id)
);
 
CREATE TABLE IF NOT EXISTS lancamentos (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  professor_id          INT          NOT NULL,
  professor_nome        VARCHAR(255) NOT NULL,
  casa_id               INT          NOT NULL,
  casa_nome             VARCHAR(100) NOT NULL,
  aluno_id              INT,
  aluno_nome            VARCHAR(255),
  turma_id              INT,
  turma_nome            VARCHAR(100),
  justificativa_id      INT,
  custom_justificativa  VARCHAR(100),
  justificativa_snapshot VARCHAR(100) NOT NULL,
  is_custom             BOOLEAN      NOT NULL,
  turno                 VARCHAR(36),
  pontuacao             INT          NOT NULL,
  data_lancamento       DATETIME     NOT NULL,
  CONSTRAINT fk_lancamentos_professor   FOREIGN KEY (professor_id)   REFERENCES professores(id),
  CONSTRAINT fk_lancamentos_casa        FOREIGN KEY (casa_id)        REFERENCES casas(id),
  CONSTRAINT fk_lancamentos_aluno       FOREIGN KEY (aluno_id)       REFERENCES alunos(id),
  CONSTRAINT fk_lancamentos_turma       FOREIGN KEY (turma_id)       REFERENCES turmas(id),
  CONSTRAINT fk_lancamentos_justificativa FOREIGN KEY (justificativa_id) REFERENCES justificativas(id)
);
 
-- ── Dados Iniciais (Seeds) ───────────────────────────────────
 
INSERT INTO casas (nome, brasao) VALUES
  ('Casa Leão',    '🦁'),
  ('Casa Águia',   '🦅'),
  ('Casa Serpente','🐍'),
  ('Casa Lobo',    '🐺');
 
INSERT INTO turmas (nome, turno) VALUES
  ('6º A', 'Matutino'),
  ('6º B', 'Matutino'),
  ('7º A', 'Vespertino'),
  ('7º B', 'Vespertino'),
  ('8º A', 'Matutino'),
  ('9º A', 'Matutino');
 
INSERT INTO justificativas (nome, pontos) VALUES
  ('Participação em aula',        10),
  ('Dever de casa completo',       5),
  ('Bom comportamento',           15),
  ('Trabalho em equipe',          20),
  ('Olimpíada / Competição',      50),
  ('Projeto especial',            30),
  ('Penalidade - mau comportamento', -10),
  ('Penalidade - falta injustificada', -5);
 
-- Admin padrão: senha = "admin123"
-- Hash bcrypt gerado com 10 rounds
INSERT INTO professores (nome, senha, permissao, casa_id) VALUES
  (
    'Coordenação',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    2,
    1
  );
 
-- Nota: a senha acima é "password" (hash de exemplo do bcryptjs)
-- TROQUE IMEDIATAMENTE ao colocar em produção!
-- Para gerar um novo hash: node -e "const b=require('bcryptjs');console.log(b.hashSync('suasenha',10))"
 