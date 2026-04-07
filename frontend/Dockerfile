# ============================================================
# Dockerfile do Frontend — Build multi-stage
# Stage 1: compila o React com Vite
# Stage 2: serve os arquivos estáticos com Nginx (muito mais leve)
# Resultado: imagem final com ~25MB ao invés de ~400MB
# ============================================================

# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
# Os arquivos compilados ficam em /app/dist

# ── Stage 2: Serve com Nginx ─────────────────────────────────
FROM nginx:alpine

# Copia os arquivos compilados para o diretório padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]