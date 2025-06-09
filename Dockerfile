# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Declare uma variável de build (recebida via --build-arg)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Etapa de produção
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
