# 🏗️ Estrutura do Projeto

## 🔍 Visão Geral

Este documento descreve a estrutura de arquitetura, pacotes e diretórios organizacionais do projeto **Taça das Casas**. A ideia deste arquivo não é listar todos os arquivos detalhadamente, mas sim documentar o propósito de cada pacote estrutural. Para visualizar a listagem completa detalhada (com quantidade de linhas), consulte o arquivo gerado dinamicamente: `docs/ESTRUTURA-LINHAS.md`.

---

## 📁 Estrutura Atual

```text
📁 taca-das-casas/
├── 📄 docker-compose.yml               # → Orquestração local com React, API e MariaDB
├── 📄 README.md                        # → Documentação principal do projeto
├── 📁 backend/                         # → Servidor backend API (Node + Express)
│   └── 📁 src/                         # → Lógica de backend Node (MVC)
│       ├── 📁 config/                  # → Configurações de banco, app
│       ├── 📁 controllers/             # → Controladores HTTP
│       ├── 📁 middlewares/             # → Filtros e middlewares Express
│       ├── 📁 repositories/            # → Acesso a dados MariaDB
│       ├── 📁 routes/                  # → Definição de Rotas API
│       ├── 📁 services/                # → Regras de Negócio
│       └── 📄 app.js                   # → Instância principal do Express
├── 📁 frontend/                        # → Interface da aplicação (React + Vite)
│   ├── 📁 public/                      # → Assets públicos acessíveis externamente
│   └── 📁 src/                         # → Lógica de negócio Frontend escrita em React
│       ├── 📁 components/              # → Componentes reaproveitáveis de UI e layout
│       ├── 📁 context/                 # → Hooks de contexto global (AuthContext e etc)
│       ├── 📁 hooks/                   # → Controladores locais estritos das Views
│       ├── 📁 services/                # → Libs internas (Manipuladores de Requisição Axios)
│       ├── 📁 utils/                   # → Extratores, formatadores e classes dinâmicas
│       └── 📁 views/                   # → Templates visuais principais da interface (Páginas)
│           ├── 📁 admin/               # → Páginas estritas ao perfil da Coordenação
│           ├── 📁 professor/           # → Páginas estritas ao perfil do Professor logado
│           └── 📁 public/              # → Placar das casas global / Dashboard
├── 📁 docs/                            # → Documentação técnica e de gestão
│   ├── 📁 changelog/                   # → Registros de alterações diárias (MD)
│   ├── 📁 workflow/                    # → Logs de execução de tarefas dos devs
│   ├── 📄 ESTRUTURA-LINHAS.md          # → Contagem computada de arquivos e linhas (Gerado)
│   ├── 📄 ESTRUTURA.md                 # → Este arquivo de mapa base do projeto
│   └── 📄 REGRAS.md                    # → Regras de desenvolvimento e padronização
├── 📁 sql/                             # → Scripts e manipulações de banco de dados
│   └── 📄 init.sql                     # → Estruturas e seeds do MariaDB
└── 📁 scripts/                         # → Scripts de automação e utilitários
    └── 📄 gerar-estrutura-arquivos-linhas.js # → Analisa árvore e atualiza ESTRUTURA-LINHAS.md
```
