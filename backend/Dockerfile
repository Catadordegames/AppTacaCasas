FROM node:20-alpine

WORKDIR /app

# Instalar PM2 globalmente conforme mencionado na documentação
RUN npm install -g pm2

# Instalar dependências
COPY package*.json ./
RUN npm install --production

# Copiar restante do código
COPY . .

# Expor a porta em que a API vai rodar
EXPOSE 3000

# Inicializar utilizando o pm2-runtime, ideal para containers Docker
CMD ["pm2-runtime", "index.js"]
