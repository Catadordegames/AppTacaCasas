# 🏆 Taça das Casas

> Site mobile first para gerenciamento de gincanas escolares, com controle de pontuação, equipes e permissões por perfil de usuário.

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Plataforma](https://img.shields.io/badge/Plataforma-Web-green)
![Linguagem](https://img.shields.io/badge/:badgeContent?style=flat&logo=nodedotjs)
![Banco de Dados](https://img.shields.io/badge/Banco%20de%20Dados-MariaDB-red)

> 🔗 **Acesse a aplicação:** [tacadascasas.duckdns.org](https://tacadascasas.duckdns.org)

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Perfis de Acesso](#-perfis-de-acesso)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Padrões de Nomenclatura](#%EF%B8%8F-padrões-de-nomenclatura)
- [Infraestrutura e Hospedagem](#%EF%B8%8F-infraestrutura-e-hospedagem)
- [Equipe](#-equipe)
- [Metodologia](#-metodologia)
- [Informações Acadêmicas](#-informações-acadêmicas)
- [Status do Projeto](#-status-do-projeto)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **Taça das Casas** é uma aplicação web com suporte ao formato **Web App (PWA)**, desenvolvida com abordagem mobile first para auxiliar a escola **CEF 102 Norte** no gerenciamento de suas gincanas internas. A aplicação permite o acompanhamento em tempo real da pontuação das equipes, com diferentes níveis de acesso para **professores** e **coordenação/direção**.

O projeto visa substituir métodos manuais de controle de pontuação (planilhas, quadros físicos, etc.) por uma solução digital moderna, prática e acessível a toda a comunidade escolar, podendo ser acessada de qualquer dispositivo com um navegador de internet ou instalada diretamente no dispositivo como um aplicativo.

---

## ✨ Funcionalidades

### Gerais

- 📊 Placar geral das equipes em tempo real com visualização pública (alunos e comunidade visualizam apenas as posições/placar)
- 🔐 Sistema de autenticação com dois níveis de permissão (Professor e Coordenação/Direção)
- 📱 Interface responsiva (Mobile First)
- 📁 Exportação de dados em CSV (tabelas e relatórios) com filtros por Turma e Casa/Equipe
- 🔄 Função de "Reset" letivo (arquivar, exportar CSV e/ou limpar dados para iniciar um novo ano/gincana)

### Para Professores

- ✅ Cadastro e autenticação no sistema
- ➕ Lançamento de pontos às equipes com descrição/justificativa
- 🗑️ Exclusão e gerenciamento exclusivo dos **próprios lançamentos** realizados

### Para Coordenação / Diretoria (Admin)

- 🔑 Acesso administrativo completo (CRUD em todas as tabelas)
- 👥 Cadastro/Gerenciamento de Alunos, Professores, Turmas, Casas (Equipes), Justificativas e Tipos de Pontuação
- ✏️ Controle total sobre os lançamentos de pontuação (lançar, editar e/ou remover qualquer lançamento)

---

## 👥 Perfis de Acesso

| Perfil                     | Acesso                                                                                                                      |
|:---------------------------|:----------------------------------------------------------------------------------------------------------------------------|
| **Público (Alunos/etc)**   | Visualização apenas do placar/ranking das equipes (sem acesso aos detalhes da pontuação)                                    |
| **Professor**              | Cadastro, login, lançamento de pontos e remoção apenas dos *próprios* pontos lançados                                       |
| **Coordenação/Diretoria**  | Acesso Total (CRUD): gerenciar usuários (alunos/professores), turmas, casas, justificativas e exclusão irrestrita de pontos |

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React**: Biblioteca JavaScript para construção da interface de usuário.
- **TailwindCSS**: Framework CSS utilitário para estilização rápida e responsiva.

### Backend

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express**: Framework web minimalista para Node.js, utilizado para criar a API.

### Banco de Dados

- **MariaDB**: Sistema de gerenciamento de banco de dados relacional.

### Gerenciamento de Processos

- **PM2**: Um gerenciador de processos de produção para aplicações Node.js. Ele é utilizado para manter a aplicação online (rodando em segundo plano) 24 horas por dia, garantindo reinicialização automática em caso de falhas e facilitando a gestão dos logs e o monitoramento da API.

---

## 🏷️ Padrões de Nomenclatura

Para manter a organização e legibilidade do código-fonte em todo o ecossistema do projeto, adotamos as seguintes convenções de nomenclatura:

### 🗄️ Banco de Dados (MariaDB)

- **Tabelas**: Letras minúsculas, preferencialmente no plural e utilizando `snake_case` (Exemplo: `usuarios`, `lancamentos_pontos`).
- **Colunas/Campos**: Utilizando `snake_case` (Exemplo: `id`, `nome_completo`, `data_criacao`).
- **Chaves Primárias e Estrangeiras**: Chaves primárias apenas `id`, chaves estrangeiras seguem o padrão `nome_tabela_id` (Exemplo: `usuario_id`).

### ⚙️ Backend (Node.js / API)

- **Arquivos e Pastas**: Utilizando `kebab-case` (Exemplo: `user-routes.js`, `auth-controller.js`).
- **Variáveis, Funções e Métodos**: Utilizando `camelCase` (Exemplo: `buscarUsuario`, `calcularPontos()`).
- **Classes e Models**: Utilizando `PascalCase` (Exemplo: `DatabaseConnection`, `UsuarioModel`).
- **Constantes (Globais e Env)**: Utilizando `UPPER_SNAKE_CASE` (Exemplo: `DB_HOST`, `JWT_SECRET`).

### 🖥️ Frontend (React)

- **Componentes e Arquivos de Componentes**: Utilizando `PascalCase` (Exemplo: `Dashboard.jsx`, `CardEquipe.tsx`).
- **Pastas (Rotas, Contextos, Utils)**: Utilizando `kebab-case` ou uma única palavra minúscula (Exemplo: `components`, `utils`, `auth-context`).
- **Hooks Customizados**: `camelCase` começando com o prefixo `use` (Exemplo: `useAuth()`, `usePlacar()`).
- **Variáveis e Funções Naturais**: Utilizando `camelCase` (Exemplo: `handleClick`, `isLoading`, `usuarioLogado`).
- **Constantes Constantes (imutáveis)**: Utilizando `UPPER_SNAKE_CASE` (Exemplo: `MAX_PONTOS_POR_LANCAMENTO`).

---

## 🚀 Orientações para Deploy e Setup

Para garantir que a automação e o deploy manual no servidor (via `git pull`) funcionem sem quebrar a aplicação, os desenvolvedores devem aderir às seguintes regras de configuração:

### 1. Arquivos Ignorados (.gitignore)

- **Imagens e Uploads**: A pasta `uploads/` **deve** permanecer no `.gitignore`. Ela armazena os brasões das equipes e imagens geradas dinamicamente. Se não for ignorada, o Git pode sobrescrever o diretório na VM e apagar os arquivos enviados pelos usuários.
- **Dependências e Builds**: Pastas como `node_modules/`, `build/` e `dist/` nunca devem ser comitadas.
- **Dados Sensíveis**: O arquivo `.env` definitivo não deve ir para o GitHub.

### 2. Variáveis de Ambiente

- O projeto possui um arquivo `.env.example` com chaves vazias (como `DB_PASSWORD=` e `API_URL=`).
- No ambiente local, as variáveis apontam para o `localhost` e usam credenciais de desenvolvimento.
- **Na VM (Produção)**: A equipe criará um `.env` real preenchido com os dados definitivos (como o IP da Oracle Cloud e as senhas do MariaDB). O frontend utilizará essa variável para rotear o login corretamente.

### 3. Scripts Padronizados (package.json)

Para que o servidor consiga inicializar o projeto corretamente, utilize scripts padronizados:

- **Frontend**: Garanta a existência de um script `"build"` para compilar os estáticos do React.
- **Backend**: Configure um script `"start"`. No servidor, não usaremos `nodemon` ou `node index.js` diretamente; o backend rodará através do **PM2**, garantindo a reinicialização automática em caso de *crash*.

### 4. Controle do Banco de Dados (Migrations)

Como o banco de dados local difere do servidor de produção, exportações manuais não devem ser feitas para transferir informações.

- Centralize as alterações (como adicionar colunas novas) na pasta `/sql/`.
- Crie scripts `.sql` para cada modificação (migration) feita na sprint.
- No servidor, apenas aplique os scripts correspondentes para atualizar o esquema sem correr o risco de perder dados que já estão cadastrados.

---

## ☁️ Infraestrutura e Hospedagem

A aplicação está hospedada e configurada com as seguintes tecnologias de infraestrutura:

| Tecnologia               | Descrição / Uso                                      |
|:-------------------------|:-----------------------------------------------------|
| **Oracle Cloud**         | Provedor de computação em nuvem em que o servidor está hospedado. |
| **Ubuntu 20.04**         | Sistema operacional (Linux) rodando no servidor.     |
| **Nginx**                | Servidor web atuando como proxy reverso para a API Node.js e servindo os arquivos estáticos do Frontend. |
| **DuckDNS**              | Serviço de DNS dinâmico gratuito para associar o IP do servidor a um domínio amigável. |
| **Certbot / Let's Encrypt** | Automação e geração de certificados SSL/TLS para garantir a segurança da comunicação via protocolo HTTPS. |

---

## 👨‍💻 Equipe

| Membro   | Papel                                         |
|:---------|:----------------------------------------------|
| **Cauê** | PO (Product Owner) & Dba                      |
| **Caio** | Dev full stack                                |
| **Luiz** | Documentador                                  |
-
---

## 📐 Metodologia

O desenvolvimento seguirá a metodologia **Scrum**, com as seguintes práticas:

- **Sprints** com duração quinzenal (2 semanas)
- **Quadro Kanban** no [Trello](https://trello.com) para organização das tarefas
- **Sprint Reviews** para validação das entregas

---

## 🎓 Informações Acadêmicas

| Campo                | Detalhe                                         |
|:---------------------|:------------------------------------------------|
| **Instituição**      | UniCEUB — Centro Universitário de Brasília       |
| **Curso**            | Ciências da Computação                           |
| **Disciplina**       | Projeto Integrador 2                             |
| **Semestre**         | 2026/1                                           |

---

## 📊 Status do Projeto

- [x] Definição da ideia do projeto
- [x] Escolha das tecnologias
- [x] Criação do repositório
- [x] Reunião com o cliente (CEF 102 Norte) e levantamento de requisitos
- [ ] Definição detalhada dos requisitos funcionais e não funcionais
- [ ] Prototipação das telas (wireframes)
- [ ] Modelagem do banco de dados (MariaDB)
- [ ] Configuração do ambiente de desenvolvimento e VPS
- [ ] Desenvolvimento do módulo de autenticação e API (Express)
- [ ] Desenvolvimento do frontend (React + TailwindCSS)
- [ ] Testes e validação
- [ ] Deploy na Oracle Cloud (PM2, Nginx, SSL)
- [ ] Entrega final

---

## 📄 Licença

Este projeto de caráter acadêmico é de código aberto e está licenciado sob a **[GNU General Public License v3.0 (GPLv3)](LICENSE)**.

O projeto foi desenvolvido como parte da disciplina **Projeto Integrador 2** do curso de **Ciências da Computação** do **UniCEUB**.

---

<p align="center">
  Feito com ❤️ pela equipe do Taça das Casas — UniCEUB 2026
</p>
