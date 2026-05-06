Remodelação das Tabelas professores e lancamentos (v3 — Final)
Contexto
Reestruturar a tabela lancamentos para funcionar como histórico puro (sem FKs) e adicionar campos de identificação à tabela professores. Restringir edição de nomes em Casas, Turmas e Professores para garantir integridade dos snapshots.

1. Migration 005
Tabela professores
Adicionar cpf VARCHAR(11) NULL UNIQUE
Tornar nome UNIQUE (permite NULL)
Tornar telefone UNIQUE (permite NULL)
Todos esses campos continuam opcionais (nullable) para evitar bugs em produção
Tabela lancamentos
DELETE FROM lancamentos → DROP TABLE lancamentos
Recriar:
sql
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
Mapeamento de campos antigos → novos:

Campo Antigo Campo Novo Observação
professor_id (removido) Sem FK
professor_nome professor Snapshot
casa_id (removido) Sem FK
casa_nome casa Snapshot
aluno_id (removido) Sem FK
aluno_nome aluno Snapshot
turma_id (removido) Sem FK
turma_nome turma Snapshot
justificativa_id (removido) Sem FK
custom_justificativa (removido) Redundante
justificativa_snapshot justificativa Renomeado
(novo) complemento Campo TEXT livre
pontuacao pontuacao Mantém
is_custom is_custom Mantém
turno turno Mantém
data_lancamento data_lancamento Mantém
2. Arquivos Impactados — Backend
Migration
[NEW]
005_remodel_professores_lancamentos.sql
Script SQL completo.

Lançamentos (Repository / Service / Controller)
[MODIFY]
lancamentos.repository.js
criar(): receber somente campos de snapshot (professor, casa, aluno, turma, justificativa, complemento, is_custom, turno, pontuacao, data_lancamento)
listar(): filtros por casa e turma (texto) em vez de IDs
atualizar(): referenciar justificativa em vez de justificativa_snapshot
Remover todas as referências a *_id e custom_justificativa
[MODIFY]
lancamentos.service.js
criar(): continua consultando as tabelas (casas, alunos, turmas, justificativas) para obter os nomes, mas salva somente os nomes (snapshots). Adicionar complemento ao dados.
Remover checks de permissão no atualizar() e deletar() — sem FK, sem dependência
Adaptar nomes de campos para a nova estrutura
[MODIFY]
lancamentos.controller.js
Filtros no listar(): casa e turma (texto) em vez de casa_id e turma_id
Professores (Repository / Service / Controller)
[MODIFY]
professores.repository.js
listar() e buscarPorId(): incluir cpf, email, telefone no SELECT
criar(): aceitar cpf, email, telefone
atualizar(): não atualizar nome nem cpf (ineditáveis, exceto CPF quando vazio)
[MODIFY]
professores.service.js
criar(): aceitar cpf, email, telefone
atualizar(): excluir nome do update. CPF só editável se o valor atual for NULL/vazio
Tratar erro de UNIQUE constraint e retornar mensagem amigável (ex: "CPF já cadastrado")
[MODIFY]
professores.controller.js
criar(): extrair cpf, email, telefone do body
atualizar(): extrair campos editáveis (permissao, casa_id, senha, email, telefone, cpf condicionalmente)
Casas (Service / Repository)
[MODIFY]
casas.repository.js
Remover atualizar() — casas não são mais editáveis
deletar(): antes de apagar, setar casa_id = NULL em todas as linhas de alunos e professores vinculadas
IMPORTANT

Cascade NULL: ao deletar uma casa, o service/repository deve executar:

sql
UPDATE alunos SET casa_id = NULL WHERE casa_id = ?;
UPDATE professores SET casa_id = NULL WHERE casa_id = ?;
DELETE FROM casas WHERE id = ?;
Turmas (Service)
WARNING

Turmas NÃO podem ser deletadas se houver alunos vinculados (FK alunos.turma_id). O service de turmas deve verificar isso antes de deletar e retornar erro amigável.

Routes
[MODIFY]
ranking.routes.js
Mudar JOIN: LEFT JOIN lancamentos l ON l.casa = c.nome
[MODIFY]
export.routes.js
formatarLancamentosParaCSV(): usar novos nomes (casa, professor, aluno, turma, justificativa, complemento)
Filtros de lancamentos: casa e turma por texto em vez de ID
Ranking query: mesma mudança do ranking.routes.js
Export de professores: incluir cpf, email, telefone
3. Arquivos Impactados — Frontend
Utils
[MODIFY]
formatters.js
Adicionar função formatCPF(value) — formata visualmente (XXX.XXX.XXX-XX), retém somente dígitos para envio ao backend
Hooks
[MODIFY]
useLancarPontos.js
Continua enviando IDs ao backend (o service resolve nomes). Adicionar campo complemento ao form e payload.
[MODIFY]
useListagemLancamentos.js
Filtros: dropdown de casa/turma busca da API, mas envia nome (texto) como filtro
Remover check lancamento.professor_id === usuario?.id
[MODIFY]
useAdminProfessores.js
Adicionar cpf, email, telefone ao FORM_VAZIO
abrirEditar(): carregar cpf, email, telefone
CPF: formatar com formatCPF() no display, enviar dígitos cru ao backend
Tratar erros de UNIQUE constraint vindos do backend (toast)
[MODIFY]
useAdminCasas.js
Remover abrirEditar — casas não são mais editáveis
[MODIFY]
useAdminTurmas.js
abrirEditar(): nome read-only, somente turno editável
Views
[MODIFY]
AdminProfessores.jsx
Adicionar campos CPF, Email, Telefone no modal de criação
Modal de edição: nome sempre read-only; cpf editável somente se vazio (read-only se já preenchido)
Coluna CPF na tabela (formatado visualmente)
Mensagem de erro de campo único duplicado (toast ou texto vermelho)
[MODIFY]
AdminCasas.jsx
Remover botão/opção de edição — casas só podem ser criadas ou deletadas
Remover onEdit do CrudTable
[MODIFY]
AdminTurmas.jsx
Modal de edição: nome como read-only, somente turno editável
[MODIFY]
ListagemLancamentos.jsx
l.casa_nome → l.casa, l.justificativa_snapshot → l.justificativa
Exibir l.complemento se existir
Filtros: dropdown de casa/turma busca da API, envia nome como filtro
[MODIFY]
LancarPontos.jsx
Adicionar campo complemento (textarea) ao formulário
[MODIFY]
Perfil.jsx
Exibir nome e cpf como campos de informação (read-only)
4. Verificação
Migration 005 roda sem erros
DESCRIBE professores → cpf, nome, telefone com UNIQUE
DESCRIBE lancamentos → nova estrutura com complemento, sem FKs
Criar lançamento → salva somente snapshots + complemento
Deletar casa → alunos e professores vinculados ficam com casa_id = NULL
Deletar turma com alunos → retorna erro amigável
Ranking público → contabiliza por l.casa = c.nome
Export CSV de lançamentos e professores → campos atualizados
Professor com CPF duplicado → mensagem de erro
Casas: sem opção de edição
Turmas: só turno editável
CPF: editável quando vazio, read-only quando preenchido
