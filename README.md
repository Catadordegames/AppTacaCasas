# 🏆 Taça das Casas

Sistema web de gerenciamento de gincana escolar para o **CEF 102 Norte**.  
Mobile-first, com suporte a PWA e atualização do placar em tempo real.

---

## 📋 Índice

- [Sobre o Projeto](#sobre)
- [Tecnologias](#tecnologias)
- [Como Rodar com Docker](#docker)
- [Como Rodar sem Docker](#sem-docker)
- [Perfis de Acesso](#perfis)
- [Endpoints da API](#endpoints)
- [Exemplos de Requisição](#exemplos)
- [Estrutura do Projeto](#estrutura)

---

## 🎯 Sobre o Projeto <a name="sobre"></a>

O **Taça das Casas** substitui planilhas e quadros físicos por uma solução digital acessível de qualquer dispositivo.

**Funcionalidades:**
- 📊 Placar público em tempo real (sem login)
- 🔐 Autenticação JWT com dois níveis: Professor e Admin
- ➕ Lançamento de pontos com justificativas pré-cadastradas ou personalizadas
- 🗑️ Professor gerencia apenas seus lançamentos; Admin controla tudo
- 📁 Exportação CSV com filtros
- 🔄 Reset anual com backup automático

---

## 🛠️ Tecnologias <a name="tecnologias"></a>

| Camada    | Tecnologia                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, TailwindCSS, Axios  |
| Backend   | Node.js, Express, JWT, bcryptjs     |
| Banco     | MariaDB 11                          |
| Servidor  | Nginx (frontend), PM2 (backend)     |
| Container | Docker + Docker Compose             |

---

## 🐳 Como Rodar com Docker <a name="docker"></a>

### Pré-requisitos
- Docker Desktop instalado e rodando
- Git

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/taca-das-casas.git
cd taca-das-casas

# 2. Suba todos os serviços (MariaDB + Backend + Frontend)
docker-compose up --build

# Ou em background:
docker-compose up --build -d
```

Aguarde ~30 segundos para o MariaDB inicializar na primeira vez.

| Serviço  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost           |
| API      | http://localhost:3001/api  |
| MariaDB  | localhost:3306             |

### Credenciais padrão

```
Usuário: Coordenação
Senha:   password
```

> ⚠️ **IMPORTANTE:** Troque a senha do admin imediatamente após o primeiro login!
> 
> Para gerar um novo hash:
> ```bash
> docker exec taca_backend node -e "const b=require('bcryptjs'); console.log(b.hashSync('nova_senha', 10))"
> ```
> Depois atualize diretamente no banco:
> ```sql
> UPDATE professores SET senha = 'HASH_GERADO' WHERE nome = 'Coordenação';
> ```

### Comandos úteis com Docker

```bash
# Ver logs em tempo real
docker-compose logs -f backend
docker-compose logs -f frontend

# Parar tudo (mantém dados)
docker-compose down

# Parar e APAGAR todos os dados (banco incluído)
docker-compose down -v

# Rebuild após alterações no código
docker-compose up --build
```

---

## 💻 Como Rodar sem Docker <a name="sem-docker"></a>

### Pré-requisitos
- Node.js 20+
- MariaDB ou MySQL rodando localmente

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env
# Edite .env com suas credenciais do banco local

# Iniciar em desenvolvimento
npm run dev

# Iniciar em produção com PM2
npm run pm2
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar em desenvolvimento (com proxy para o backend)
npm run dev

# Build de produção
npm run build
npm run preview
```

### Banco de Dados

Execute o script SQL manualmente:

```bash
mysql -u root -p < database/init.sql
```

---

## 👥 Perfis de Acesso <a name="perfis"></a>

| Perfil                 | `permissao` | Capacidades                                              |
|------------------------|-------------|----------------------------------------------------------|
| Público                | —           | Ver placar/ranking (sem login)                           |
| Professor              | `1`         | Login, lançar pontos, ver/deletar **seus** lançamentos   |
| Coordenação / Admin    | `2`         | CRUD completo de tudo, deletar qualquer lançamento, exportar CSV, reset anual |

---

## 📡 Endpoints da API <a name="endpoints"></a>

**Base URL:** `http://localhost:3001/api`

### 🔓 Públicos (sem autenticação)

| Método | Endpoint        | Descrição                        |
|--------|-----------------|----------------------------------|
| GET    | `/ranking`      | Placar geral com pontos por casa |
| GET    | `/casas`        | Lista todas as casas             |
| GET    | `/turmas`       | Lista todas as turmas            |
| GET    | `/health`       | Health check do servidor         |

### 🔐 Autenticação

| Método | Endpoint        | Descrição                        |
|--------|-----------------|----------------------------------|
| POST   | `/auth/login`   | Login — retorna token JWT        |

### 👨‍🏫 Professor (requer `Bearer token`)

| Método | Endpoint               | Descrição                                  |
|--------|------------------------|--------------------------------------------|
| GET    | `/lancamentos`         | Lista seus lançamentos (+ filtros)         |
| POST   | `/lancamentos`         | Cria novo lançamento                       |
| DELETE | `/lancamentos/:id`     | Deleta seu próprio lançamento              |
| GET    | `/justificativas`      | Lista justificativas disponíveis           |
| GET    | `/alunos`              | Lista alunos (filtros: turma_id, casa_id)  |

### 🛡️ Admin (requer token com `permissao: 2`)

| Método | Endpoint                    | Descrição                          |
|--------|-----------------------------|------------------------------------|
| GET    | `/professores`              | Lista professores                  |
| POST   | `/professores`              | Cria professor                     |
| PUT    | `/professores/:id`          | Atualiza professor                 |
| DELETE | `/professores/:id`          | Remove professor                   |
| POST   | `/casas`                    | Cria casa                          |
| PUT    | `/casas/:id`                | Atualiza casa                      |
| DELETE | `/casas/:id`                | Remove casa                        |
| POST   | `/turmas`                   | Cria turma                         |
| PUT    | `/turmas/:id`               | Atualiza turma                     |
| DELETE | `/turmas/:id`               | Remove turma                       |
| POST   | `/alunos`                   | Cria aluno                         |
| PUT    | `/alunos/:id`               | Atualiza aluno                     |
| DELETE | `/alunos/:id`               | Remove aluno                       |
| POST   | `/justificativas`           | Cria justificativa                 |
| PUT    | `/justificativas/:id`       | Atualiza justificativa             |
| DELETE | `/justificativas/:id`       | Remove justificativa               |
| DELETE | `/lancamentos/:id`          | Remove qualquer lançamento         |
| GET    | `/export/lancamentos`       | Exporta lançamentos como CSV       |
| GET    | `/export/ranking`           | Exporta ranking como CSV           |
| POST   | `/export/reset`             | Reset anual + backup CSV           |

---

## 📨 Exemplos de Requisição <a name="exemplos"></a>

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "nome": "Coordenação",
  "senha": "password"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nome": "Coordenação",
    "permissao": 2,
    "casa_id": 1
  }
}
```

---

### Lançar Pontos (justificativa padrão)
```http
POST /api/lancamentos
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "casa_id": 1,
  "turma_id": 2,
  "aluno_id": 5,
  "justificativa_id": 3,
  "is_custom": false,
  "turno": "Matutino"
}
```

---

### Lançar Pontos (justificativa personalizada)
```http
POST /api/lancamentos
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "casa_id": 2,
  "is_custom": true,
  "custom_justificativa": "Vencedor da gincana de matemática",
  "pontuacao": 100,
  "turno": "Vespertino"
}
```

---

### Ver Placar (público)
```http
GET /api/ranking
```

**Resposta:**
```json
[
  { "id": 1, "nome": "Casa Leão", "brasao": "🦁", "total_pontos": 350, "total_lancamentos": 12 },
  { "id": 3, "nome": "Casa Serpente", "brasao": "🐍", "total_pontos": 280, "total_lancamentos": 9 },
  { "id": 2, "nome": "Casa Águia", "brasao": "🦅", "total_pontos": 220, "total_lancamentos": 7 },
  { "id": 4, "nome": "Casa Lobo", "brasao": "🐺", "total_pontos": 190, "total_lancamentos": 6 }
]
```

---

### Exportar CSV com filtros
```http
GET /api/export/lancamentos?casa_id=1&data_inicio=2025-01-01
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

### Reset Anual
```http
POST /api/export/reset
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{ "confirmar": true }
```
> Retorna um arquivo `.csv` com backup completo e deleta todos os lançamentos.

---

## 🗂️ Estrutura do Projeto <a name="estrutura"></a>

```
taca-das-casas/
├── docker-compose.yml
├── database/
│   └── init.sql                  # Schema + dados iniciais
│
├── backend/
│   ├── index.js                  # Entry point
│   ├── ecosystem.config.js       # Config PM2
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js                # Express + middlewares + rotas
│       ├── config/
│       │   └── database.js       # Pool de conexões MariaDB
│       ├── middlewares/
│       │   └── auth.middleware.js # JWT + autorização admin
│       ├── repositories/         # Queries SQL (acesso ao banco)
│       │   ├── auth.repository.js
│       │   ├── casas.repository.js
│       │   ├── turmas.repository.js
│       │   ├── professores.repository.js
│       │   ├── alunos.repository.js
│       │   ├── justificativas.repository.js
│       │   └── lancamentos.repository.js
│       ├── services/             # Regras de negócio
│       │   ├── auth.service.js
│       │   ├── casas.service.js
│       │   ├── turmas.service.js
│       │   ├── professores.service.js
│       │   ├── alunos.service.js
│       │   ├── justificativas.service.js
│       │   └── lancamentos.service.js
│       ├── controllers/          # Recebe HTTP, chama service
│       │   ├── auth.controller.js
│       │   ├── casas.controller.js
│       │   ├── turmas.controller.js
│       │   ├── professores.controller.js
│       │   ├── alunos.controller.js
│       │   ├── justificativas.controller.js
│       │   └── lancamentos.controller.js
│       └── routes/               # Define os endpoints HTTP
│           ├── auth.routes.js
│           ├── casas.routes.js
│           ├── turmas.routes.js
│           ├── professores.routes.js
│           ├── alunos.routes.js
│           ├── justificativas.routes.js
│           ├── lancamentos.routes.js
│           ├── ranking.routes.js
│           └── export.routes.js
│
└── frontend/
    ├── Dockerfile                # Multi-stage: Vite build + Nginx
    ├── nginx.conf                # SPA routing + proxy para API
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx               # Rotas + guards de autenticação
        ├── index.css             # Tema dark + componentes Tailwind
        ├── context/
        │   └── AuthContext.jsx   # Estado global de autenticação
        ├── services/
        │   └── api.js            # Axios com interceptors JWT
        ├── components/
        │   ├── layout/
        │   │   ├── Layout.jsx    # Wrapper com Navbar + footer
        │   │   └── Navbar.jsx    # Responsivo + dropdown admin
        │   └── ui/
        │       ├── CrudTable.jsx # Tabela genérica reutilizável
        │       └── Modal.jsx     # Modal genérico
        └── pages/
            ├── public/
            │   ├── Dashboard.jsx # Placar público (atualiza a cada 30s)
            │   └── Login.jsx
            ├── professor/
            │   ├── LancarPontos.jsx
            │   └── MeusLancamentos.jsx
            └── admin/
                ├── AdminLancamentos.jsx
                ├── AdminCasas.jsx
                ├── AdminTurmas.jsx
                ├── AdminProfessores.jsx
                ├── AdminAlunos.jsx
                └── AdminJustificativas.jsx
```

---

## 🔒 Segurança em Produção

Antes de ir para produção, altere obrigatoriamente:

1. **`docker-compose.yml`** — senhas do banco (`MARIADB_ROOT_PASSWORD`, `MARIADB_PASSWORD`)
2. **`JWT_SECRET`** — use uma string aleatória longa (mín. 32 chars)
3. **Senha do admin** — troque via SQL após o primeiro login
4. **`FRONTEND_URL`** no backend — restrinja ao domínio real

```bash
# Gerar JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## 📄 Licença

MIT — CEF 102 Norte · Brasília, DF