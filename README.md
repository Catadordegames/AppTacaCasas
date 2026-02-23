# 🏆 Taça das Casas

> Aplicativo Android para gerenciamento de gincanas escolares, com controle de pontuação, equipes e permissões por perfil de usuário.

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Plataforma](https://img.shields.io/badge/Plataforma-Android-green)
![Linguagem](https://img.shields.io/badge/Linguagem-Kotlin%20%7C%20Java-blue)
![Banco de Dados](https://img.shields.io/badge/Banco%20de%20Dados-Oracle%20Free%20Tier-red)

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Perfis de Acesso](#-perfis-de-acesso)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Download](#-download)
- [Normas de Nomenclatura](#-normas-de-nomenclatura)
- [Metodologia](#-metodologia)
- [Equipe](#-equipe)
- [Informações Acadêmicas](#-informações-acadêmicas)
- [Status do Projeto](#-status-do-projeto)
- [Licença](#-licença)

---

## 📖 Sobre o Projeto

O **Taça das Casas** é um aplicativo mobile desenvolvido para auxiliar escolas no gerenciamento de suas gincanas internas. A aplicação permite o acompanhamento em tempo real da pontuação das equipes, com diferentes níveis de acesso para **alunos**, **professores** e **direção**.

O projeto visa substituir métodos manuais de controle de pontuação (planilhas, quadros físicos, etc.) por uma solução digital moderna, prática e acessível a toda a comunidade escolar.

> ⚠️ **Nota:** A reunião com o cliente ainda será realizada para definir os detalhes e requisitos finais do projeto.

---

## ✨ Funcionalidades

### Gerais

- 📊 Placar geral das equipes em tempo real
- 🔐 Sistema de autenticação com diferentes níveis de permissão
- 📱 Interface intuitiva e responsiva para dispositivos Android

### Para Alunos

- 👀 Visualização da pontuação de cada equipe
- 🏅 Placar/ranking das equipes
- 📈 Acompanhamento do desempenho ao longo da gincana

### Para Professores

- ✅ Cadastro e autenticação no sistema
- ➕ Adição de pontos às equipes
- 📝 Registro de descrição/justificativa para cada lançamento de pontos
- 📋 Histórico de lançamentos realizados

### Para Diretora

- 🔑 Login com permissões administrativas
- 🗑️ Exclusão de lançamentos de pontos considerados inadequados
- 👁️ Visualização completa de todos os lançamentos e suas justificativas

---

## 👥 Perfis de Acesso

| Perfil       | Acesso                                                                 |
|:-------------|:-----------------------------------------------------------------------|
| **Aluno**    | Consulta de pontuação e placar das equipes (sem necessidade de login)   |
| **Professor**| Cadastro, login e lançamento de pontos com descrição                    |
| **Diretora** | Login administrativo e poder de exclusão de lançamentos inadequados     |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia               | Uso                                      |
|:--------------------------|:------------------------------------------|
| **Android Studio**        | IDE de desenvolvimento                    |
| **Kotlin / Java**         | Linguagens de programação                 |
| **Oracle Free Tier**      | Banco de dados em nuvem                   |
| **Trello**                | Gerenciamento do projeto (Quadro Kanban)  |
| **Git / GitHub**          | Controle de versão                        |

---

## 🏗️ Arquitetura

> 🚧 A arquitetura detalhada será definida após a reunião com o cliente.

Estrutura prevista:

```
AppTacaCasas/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/               # Código-fonte (Kotlin/Java)
│   │   │   │   ├── model/          # Modelos de dados
│   │   │   │   ├── view/           # Activities e Fragments
│   │   │   │   ├── viewmodel/      # ViewModels
│   │   │   │   ├── repository/     # Repositórios de dados
│   │   │   │   └── network/        # Comunicação com o banco
│   │   │   ├── res/                # Recursos (layouts, strings, etc.)
│   │   │   └── AndroidManifest.xml
│   │   └── test/                   # Testes unitários
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── README.md
```

---

## 📦 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Android Studio Panda](https://developer.android.com/studio) (versão mais recente)
- Minimo SDK a ser definido
- Conexão com a internet (para acesso ao banco de dados Oracle)
- Dispositivo Android ou emulador

---

## � Download

> 🚧 O APK para download estará disponível em breve, após a finalização da primeira versão estável do aplicativo.

<!-- Quando disponível, adicionar o link abaixo:
📲 [Baixar APK - Versão X.X.X](link-para-o-apk)
-->

---

## 📏 Normas de Nomenclatura

Para manter a consistência e legibilidade do código, o projeto seguirá as seguintes convenções de nomenclatura:

### Código (Kotlin / Java)

| Elemento             | Convenção          | Exemplo                          | Descrição                                    |
|:---------------------|:-------------------|:---------------------------------|:---------------------------------------------|
| **Classes**          | `PascalCase`       | `TeamScore`, `PointEntry`        | Substantivos, primeira letra de cada palavra maiúscula |
| **Interfaces**       | `PascalCase`       | `ScoreRepository`, `AuthService` | Substantivos ou adjetivos descritivos        |
| **Objetos (object)** | `PascalCase`       | `DatabaseHelper`, `AppConstants` | Mesmo padrão das classes                     |
| **Funções/Métodos**  | `camelCase`        | `addPoints()`, `getTeamScore()`  | Verbos que descrevem a ação                  |
| **Variáveis**        | `camelCase`        | `teamName`, `totalPoints`        | Substantivos descritivos                     |
| **Constantes**       | `UPPER_SNAKE_CASE` | `MAX_POINTS`, `DB_URL`           | Letras maiúsculas separadas por underscore   |
| **Parâmetros**       | `camelCase`        | `teamId`, `description`          | Mesmo padrão das variáveis                   |
| **Packages**         | `lowercase`        | `com.tacacasas.model`            | Tudo em minúsculas, sem underscores          |
| **Enums (tipo)**     | `PascalCase`       | `UserRole`, `TeamColor`          | Substantivos no singular                     |
| **Enums (valores)**  | `UPPER_SNAKE_CASE` | `STUDENT`, `TEACHER`, `DIRECTOR` | Mesmo padrão das constantes                  |

### Recursos Android (XML)

| Elemento                | Convenção          | Exemplo                                          |
|:------------------------|:-------------------|:-------------------------------------------------|
| **Layouts**             | `snake_case`       | `activity_login.xml`, `fragment_scoreboard.xml`   |
| **IDs de Views**        | `camelCase`        | `btnAddPoints`, `tvTeamName`, `etDescription`     |
| **Drawables**           | `snake_case`       | `ic_trophy.xml`, `bg_card_team.xml`               |
| **Strings**             | `snake_case`       | `label_team_name`, `msg_points_added`             |
| **Dimens**              | `snake_case`       | `margin_default`, `text_size_title`               |
| **Colors**              | `snake_case`       | `color_primary`, `color_team_red`                 |
| **Menus**               | `snake_case`       | `menu_main.xml`, `menu_director.xml`              |

#### Prefixos recomendados para IDs de Views

| Tipo de View     | Prefixo | Exemplo           |
|:-----------------|:--------|:------------------|
| `TextView`       | `tv`    | `tvTeamScore`     |
| `EditText`       | `et`    | `etDescription`   |
| `Button`         | `btn`   | `btnAddPoints`    |
| `ImageView`      | `iv`    | `ivTeamLogo`      |
| `RecyclerView`   | `rv`    | `rvScoreboard`    |
| `CardView`       | `cv`    | `cvTeamCard`      |
| `ProgressBar`    | `pb`    | `pbLoading`       |
| `Switch`         | `sw`    | `swNotifications` |

### Banco de Dados (Oracle)

| Elemento                 | Convenção          | Exemplo                                   |
|:-------------------------|:-------------------|:------------------------------------------|
| **Tabelas**              | `UPPER_SNAKE_CASE` | `TB_TEAM`, `TB_POINT_ENTRY`, `TB_USER`    |
| **Colunas**              | `UPPER_SNAKE_CASE` | `TEAM_NAME`, `TOTAL_POINTS`, `CREATED_AT` |
| **Primary Keys**         | `PK_` + tabela     | `PK_TEAM`, `PK_USER`                      |
| **Foreign Keys**         | `FK_` + relação    | `FK_ENTRY_TEAM`, `FK_ENTRY_TEACHER`       |
| **Índices**              | `IDX_` + contexto  | `IDX_TEAM_NAME`, `IDX_USER_EMAIL`         |
| **Sequences**            | `SEQ_` + tabela    | `SEQ_TEAM`, `SEQ_POINT_ENTRY`             |
| **Views**                | `VW_` + descrição  | `VW_SCOREBOARD`, `VW_POINT_HISTORY`       |
| **Procedures**           | `SP_` + ação       | `SP_ADD_POINTS`, `SP_DELETE_ENTRY`        |
| **Instância do banco**   | `UPPER_SNAKE_CASE` | `TACA_CASAS_DB`                           |
| **Tablespace**           | `TS_` + nome       | `TS_TACA_CASAS`                           |
| **Schemas/Usuários**     | `UPPER_SNAKE_CASE` | `TACA_CASAS_APP`                          |

#### Prefixos de Tabelas

Todas as tabelas devem utilizar o prefixo `TB_` para fácil identificação:

| Tabela            | Descrição                                |
|:------------------|:-----------------------------------------|
| `TB_USER`         | Usuários do sistema (professores, diretora) |
| `TB_TEAM`         | Equipes da gincana                       |
| `TB_POINT_ENTRY`  | Lançamentos de pontos                    |
| `TB_AUDIT_LOG`    | Log de auditoria (exclusões, alterações) |

---

## 📐 Metodologia

O desenvolvimento seguirá a metodologia **Scrum**, com as seguintes práticas:

- **Sprints** com duração quinzenal (2 semanas)
- **Quadro Kanban** no [Trello](https://trello.com) para organização das tarefas
- **Sprint Reviews** para validação das entregas

### Quadro Kanban (Trello)

O quadro será organizado nas seguintes colunas:

| Coluna          | Descrição                                      |
|:----------------|:-----------------------------------------------|
| **Backlog**     | Tarefas identificadas mas ainda não planejadas  |
| **To Do**       | Tarefas planejadas para a sprint atual          |
| **In Progress** | Tarefas em andamento                            |
| **Review**      | Tarefas em revisão/teste                        |
| **Done**        | Tarefas concluídas                              |

---

## 👨‍💻 Equipe

| Membro  | Papel                  |
|:--------|:-----------------------|
| **Cauê**| Desenvolvedor          |
| **Caio**| Desenvolvedor          |

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
- [ ] Reunião com o cliente para levantamento de requisitos
- [ ] Definição dos requisitos funcionais e não funcionais
- [ ] Prototipação das telas (wireframes)
- [ ] Modelagem do banco de dados
- [ ] Configuração do ambiente de desenvolvimento
- [ ] Desenvolvimento do módulo de autenticação
- [ ] Desenvolvimento do módulo de equipes e pontuação
- [ ] Desenvolvimento do painel do aluno
- [ ] Desenvolvimento do painel do professor
- [ ] Desenvolvimento do painel da diretora
- [ ] Testes e validação
- [ ] Entrega final

---

## 📄 Licença

Este projeto é de uso acadêmico e foi desenvolvido como parte da disciplina **Projeto Integrador 2** do curso de **Ciências da Computação** do **UniCEUB**.

---

<p align="center">
  Feito com ❤️ por <strong>Cauê</strong> e <strong>Caio</strong> — UniCEUB 2026
</p>
