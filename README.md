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
- [Infraestrutura e Hospedagem](#-infraestrutura-e-hospedagem)
- [Equipe](#-equipe)
- [Metodologia](#-metodologia)
- [Informações Acadêmicas](#-informações-acadêmicas)
- [Status do Projeto](#-status-do-projeto)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **Taça das Casas** é uma aplicação web mobile first desenvolvida para auxiliar a escola **CEF 102 Norte** no gerenciamento de suas gincanas internas. A aplicação permite o acompanhamento em tempo real da pontuação das equipes, com diferentes níveis de acesso para **professores** e **coordenação/direção**.

O projeto visa substituir métodos manuais de controle de pontuação (planilhas, quadros físicos, etc.) por uma solução digital moderna, prática e acessível a toda a comunidade escolar, podendo ser acessada de qualquer dispositivo com um navegador de internet.

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
| **Cauê** | PO (Product Owner) e Dev Back End             |
| **Caio** | Dev Front End e Documentador                  |
| **Gemini**| Tech Lead                                    |

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
