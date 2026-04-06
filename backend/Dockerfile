FROM node:20-alpine

# Instala PM2 globalmente para gerenciar o processo em produção
RUN npm install -g pm2

WORKDIR /app

# Copia os arquivos de dependências primeiro (otimiza cache do Docker)
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --omit=dev

# Copia o restante do código
COPY . .

# Cria pasta de logs para o PM2
RUN mkdir -p logs

EXPOSE 3001

# Usa PM2 para rodar a aplicação (mantém processo vivo e reinicia em falhas)
CMD ["pm2-runtime", "ecosystem.config.js"]