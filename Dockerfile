FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# --- Stage 1: Development Dependencies ---
FROM base AS development
# Install all dependencies (including devDependencies, so we have tsx)
RUN npm install
COPY tsconfig.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
COPY src ./src
ENV NODE_ENV=development
# This CMD will be overridden by the command in docker-compose.override.yml
CMD ["npx", "tsx", "watch", "src/bot.ts"]

# --- Stage 2: Production Build (Builder) ---
FROM base AS builder
COPY --from=development /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
COPY src ./src
RUN npm run build

# --- Stage 3: Production Runtime (Production) ---
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
# Only install production dependencies to reduce image size
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
CMD ["node", "dist/bot.js"]