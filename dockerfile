# Use a imagem oficial do Node.js como imagem base
FROM node:lts

# Defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Construa a aplicação NestJS
RUN npm run build

# Inicie a aplicação NestJS
CMD ["npm", "run", "start:dev"]