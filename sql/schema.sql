-- Exemplo de sintaxe para criar uma tabela no MariaDB
-- Você pode usar este arquivo para definir a estrutura do seu banco de dados.
-- O MariaDB executará este arquivo automaticamente ao iniciar o contêiner (se o volume /var/lib/mysql estiver vazio).
CREATE TABLE IF NOT EXISTS casas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    brasao VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    turno VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS justificativas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    pontos INT NOT NULL
);
CREATE TABLE IF NOT EXISTS professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    permissao INT NOT NULL,
    casa_id INT NOT NULL, --FK 
    CONSTRAINT fk_professores_casa FOREIGN KEY (casa_id) REFERENCES casas(id)
);
CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    turma_id INT NOT NULL,
    casa_id INT,
    --FK 
    CONSTRAINT fk_alunos_casa FOREIGN KEY (casa_id) REFERENCES casas(id),
    CONSTRAINT fk_alunos_turma FOREIGN KEY (turma_id) REFERENCES turmas(id)
);
CREATE TABLE IF NOT EXISTS lancamentos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    professor_nome VARCHAR(255) NOT NULL,
    casa_id INT NOT NULL,
    casa_nome VARCHAR(100) NOT NULL,
    aluno_id INT,
    aluno_nome VARCHAR(255),
    turma_id INT,
    turma_nome VARCHAR(100),
    justificativa_id INT,
    custom_justificativa VARCHAR(100),
    justificativa_snapshot VARCHAR(100) NOT NULL,
    is_custom BOOLEAN NOT NULL,
    turno VARCHAR(36),
    pontuacao INT NOT NULL,
    data_lancamento DATETIME NOT NULL,
    --FKs
    CONSTRAINT fk_lancamentos_professor FOREIGN KEY (professor_id) REFERENCES professores(id),
    CONSTRAINT fk_lancamentos_casa FOREIGN KEY (casa_id) REFERENCES casas(id),
    CONSTRAINT fk_lancamentos_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    CONSTRAINT fk_lancamentos_turma FOREIGN KEY (turma_id) REFERENCES turmas(id),
    CONSTRAINT fk_lancamentos_justificativa FOREIGN KEY (justificativa_id) REFERENCES justificativas(id)
);