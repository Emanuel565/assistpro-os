# ==============================================================================
# AssistPro OS - Dockerfile Multi-Stage de Produção
# Suporte de Alta Performance para Nuvem / SaaS
# ==============================================================================

# Estágio 1: Build do Frontend (Vite + React + Tailwind)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Estágio 2: Build do Backend (Node.js + TypeScript + Prisma)
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# Estágio 3: Runtime Final Leve e Seguro
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Dependências necessárias para o runtime (openssl para o Prisma)
RUN apk add --no-cache openssl dumb-init curl

# Copia dependências de produção do backend
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copia schemas e prisma client compilado
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=backend-builder /app/backend/node_modules/@prisma ./node_modules/@prisma

# Copia código backend compilado
COPY --from=backend-builder /app/backend/dist ./dist

# Copia build estático do frontend para o backend servir
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Cria diretório para uploads de mídia persistentes
RUN mkdir -p /app/data/uploads

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]
