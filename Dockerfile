FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

COPY --from=base /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=node:node /app/dist ./dist

USER node

EXPOSE 3000 # Static documentation

CMD ["sh", "-c", "npx typeorm migration:run -d dist/database/data-source.js && node dist/main"]