# Estágio 1: Build da aplicação React
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Certifique-se de que a variável de ambiente para a API aponte para o Nginx (proxy reverso)
# ou construa o app com a URL relativa EX: /api/
RUN npm run build

# Estágio 2: Nginx para servir arquivos estáticos e atuar como proxy
FROM nginx:alpine

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar o build do React (Geralmente na pasta 'dist' se for Vite ou 'build' se for Create React App)
# Aqui assumimos 'dist' como é padrão para Vite. Se for CRA mude para 'build'
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
