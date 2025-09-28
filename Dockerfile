# Dockerfile monorepo: Next.js (frontend) + Express/Puppeteer (backend)

# Etapa 1: Build do frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY apps/frontend/package*.json ./
RUN npm install --frozen-lockfile
COPY apps/frontend/ .
RUN npm run build


# Etapa 2: Build do backend real (robot-backend)
FROM node:20 AS backend-builder
WORKDIR /app/robot-backend
COPY robot-backend/package*.json ./
RUN npm install --frozen-lockfile
COPY robot-backend/ .
RUN npm run build

# Etapa 3: Imagem final
FROM node:20-slim
WORKDIR /app

# Dependências do sistema para Puppeteer
RUN apt-get update && \
	apt-get install -y wget ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libdrm2 libgbm1 libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 xdg-utils --no-install-recommends && \
	rm -rf /var/lib/apt/lists/*

# Copia frontend buildado
COPY --from=frontend-builder /app/frontend/.next ./apps/frontend/.next
COPY --from=frontend-builder /app/frontend/public ./apps/frontend/public
COPY --from=frontend-builder /app/frontend/package.json ./apps/frontend/package.json
COPY --from=frontend-builder /app/frontend/next.config.ts ./apps/frontend/next.config.ts
COPY --from=frontend-builder /app/frontend/tsconfig.json ./apps/frontend/tsconfig.json
COPY --from=frontend-builder /app/frontend/node_modules ./apps/frontend/node_modules



# Copia backend buildado (robot-backend)
COPY --from=backend-builder /app/robot-backend/dist ./robot-backend/dist
COPY --from=backend-builder /app/robot-backend/package.json ./robot-backend/package.json
COPY --from=backend-builder /app/robot-backend/node_modules ./robot-backend/node_modules



# Expor portas
EXPOSE 3000 4000

# Inicia backend e frontend juntos
CMD ["sh", "-c", "node robot-backend/dist/index.js & PORT=3000 npm --prefix apps/frontend start"]
