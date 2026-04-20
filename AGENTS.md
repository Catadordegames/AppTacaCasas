# REGRAS PARA AGENTES DE IA - PROJETO TAÇA DAS CASAS

Arquivo global de configuração de regras e diretrizes para agentes de Inteligência Artificial atuando neste projeto (Cursor, Claude Code, Roo Code, Gemini, etc.). Você deve obedecer aos tópicos abaixo estritamente antes e durante a realização de qualquer tarefa.

## 1. CONTEXTO E INICIAÇÃO

> **🚨 MANDATÓRIO PARA TODAS AS ATIVIDADES 🚨**
>
> É **estritamente proibido** iniciar qualquer tarefa (codificação, correção, análise, refatoração) sem antes:
>
> 1. Ler e compreender `docs/REGRAS.md`.
> 2. Seguir o workflow definido (criação de arquivo de workflow, atualização de changelog).
>
> **Não existem exceções.** A documentação é parte integrante e obrigatória do código.

Para garantir que o fluxo de trabalho siga o padrão do projeto, o seu conhecimento primário e permanente deve ser baseado nos seguintes documentos:

- `docs/REGRAS.md`: Workflow essencial de desenvolvimento e padrão de changelog.
- `docs/ESTRUTURA.md`: Árvore de diretórios estrutural e localização correta de arquivos.
- `README.md`: Visão principal do projeto e escopo de tecnologias.

*Nota: Não é necessário ler esses arquivos repetidamente em interações se você já sabe como agir, mas consulte-os obrigatoriamente se houver dúvida de onde colocar um arquivo novo.*

## 2. COMPORTAMENTO DE EXECUÇÃO E LIMITES

- **Não Apague Lógicas Essenciais:** Nunca sobrescreva deletando lógicas antigas sem entender seu contexto e ter a certeza absoluta de que está obsoleto perante a regra de negócios.
- **Liste Arquivos Antes de Agir:** Exponha claramente seus passos e liste os arquivos que deseja modificar ANTES de aplicar grandes blocos de código ou iniciar refatorações profundas.
- **Sem Decisões Isoladas de Arquitetura:** Em caso de dúvida entre "gambiarra funcional" e "solução sistêmica", pare, dê opções e aguarde. Não altere a base estrutural sem pedir permissão.

## 3. IDIOMA E PADRÃO DE DADOS

- **Idioma Padrão:** Sempre produza documentação, explicações, respostas no chat, mensagens de commit e comentários de código em Português do Brasil (pt-BR).
- **Código Sistêmico:** Nomes técnicos essenciais no código (variáveis, funções, classes e métodos) seguem padrão internacional em inglês ou o padrão em português vigente. Bancos de dados e rotas seguem o padrão brasileiro definido nos artefatos vigentes.

## 4. STATUS DO PROJETO E TECNOLOGIAS

Sistema web de gerenciamento de gincana escolar. O escopo encontra-se no `README.md`.

**Principais Tecnologias do Repositório:**

- **Frontend:** React 18, Vite, TailwindCSS, Axios.
- **Backend API:** Node.js, Express, JWT, bcryptjs.
- **Banco de Dados SQL:** MariaDB 11.
- **Servidor:** Nginx (frontend), PM2 (backend).
- **DevOps / Container:** Docker e Docker Compose.

## 5. REGRAS PARA FRONTEND, ARQUITETURA E "DRY"

### Arquitetura MVC (Model-View-Controller) e Separação de Preocupações

O projeto adota o padrão arquitetural **MVC (Model-View-Controller)** adaptado para uma aplicação moderna com API e SPA.
Mantenha a estrita separação entre a interface visual (A camada *View*, no Frontend) e a lógica sensível e controle de dados (As camadas *Controller* e *Model*, no Backend).

As divisões cruciais do **Backend Node** (`backend/src/`) seguem a estrutura de controle e modelos:

- **Controllers (`controllers/`)**: Gerenciam as requisições HTTP, validam entradas e orquestram respostas.
- **Models / Repositories (`repositories/`)**: Representam a camada de abstração de dados (Model). O acesso ao MariaDB e queries cruas ocorrem *somente* aqui. Nunca vaze esse escopo para o controller.
- Camadas auxiliares de apoio: `middlewares/`, `routes/` e `services/`.

A camada de interface (**Frontend React**, em `frontend/src/`) compõe a View:

- `views/` (ou `pages/`): Implementam as telas finais e orquestração visual dos Controllers do React.
- `components/`: Gerem componentes abstratos para composição das views.
- `services/` concentram as chamadas externas via Axios para o backend.

### Princípio DRY (Don't Repeat Yourself) / Funções Utilitárias

- **Regra CRÍTICA:** Caso necessite de tratativas corriqueiras de interface ou hooks globais (contextos, interceptors), verifique as pastas utilitárias/serviços respectivas se já não existe uma função pronta. Evite recriar variáveis globais ou duplicação.

### Design System (UI / Estilos / Classes CSS)

Ao atuar no Frontend com Tailwind CSS e React:

- Mantenha conformidade com atributos predefinidos pelo projeto via `tailwind.config.js`. Respeite o arranjo de modais genéricos (`Modal.jsx`) e tipografia base já integrados.
- Priorize um design moderno de tema escuro, com transições em hover utilizando Tailwind.
- **MANDATÓRIO:** Consulte SEMPRE o mapa de classes configurado em `agentes/paleta-cores.md` antes de criar ou modificar `views/` e `components/` no frontend, para não quebrar a coesão padrão das cores.

### Mobile First e Responsividade

- **Mobile First é essencial:** Todo novo componente, tela ou interacao deve ser projetado priorizando a experiencia em dispositivos moveis. O layout deve escalar para cima (desktop) e nao o contrario.
- **Componentes de Selecao:** Em campos de selecao (dropdowns), prefira no mobile uma interface de popover/modal ao clicar, onde o usuario escolhe a opcao em um painel sobreposto. No desktop, dropdowns padrao ou menus suspensos sao aceitaveis.

## 6. CONVENÇÕES DE NOMENCLATURA E COMANDOS

**Nomenclatura de Arquivos e Código:**

- **Backend (Camada Node API):** `camelCase` por padrão de objeto/variável. Os arquivos devem adotar pontos dividindo finalidades nas respectivas camadas. (Exemplo: `auth.controller.js`, `casas.routes.js`, `lancamentos.repository.js`).
- **Frontend (JSX):** OBRIGATÓRIA nomenclatura `PascalCase` para componentes React (Exemplo: `CrudTable.jsx`, `MeusLancamentos.jsx`). Demais scripts utilitários `camelCase`.
- **Banco de Dados:** Tabelas originais e relacionamentos FKs devem ter notação relacional nativa `snake_case` (Exemplo: `casa_id`, `justificativa_id`).

**Comandos do Sistema (Local vs Container - Consulte `README.md`):**

```bash
# OPÇÃO Docker Compose (Levantará DB + Back + Front simultâneos)
docker-compose up --build

# OPÇÃO Baremetal (Run Local Nodes) - Requer MariaDB local
# No dir backend/
npm run dev

# No dir frontend/
npm run dev
```

## 7. TAREFAS DE FINALIZAÇÃO DA ATIVIDADE E WORKFLOW

> 🛠️ **MANDATÓRIO ANTES DE DECLARAR A TAREFA CONCLUÍDA**:
>
> Quando terminar as implementações e verificar o funcionamento finalizado na codebase:
>
> 1. Observe e preserve o schema `database/init.sql` ou repasses de `routes/`. Toda alteração deve constar nas exportações do controller.
> 2. Documente as mudanças na estrutura referenciada em `docs/ESTRUTURA.md` se tiver criado ou movido pastas, e obrigatoriamente **rode o script** `node scripts/gerar-estrutura-arquivos-linhas.js` para atualizar o `docs/ESTRUTURA-LINHAS.md`.
> 3. Feche o log com as diretrizes do diário requeridos no arquivo de REGRAS central.
