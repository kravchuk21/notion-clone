# Development stage
FROM node:20-alpine AS development

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install all dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy backend source code
COPY backend/src ./src
COPY backend/tsconfig.json ./

EXPOSE 5001

CMD ["npm", "run", "dev"]

# Build stage
FROM node:20-alpine AS build

RUN apk add --no-cache openssl

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY backend/src ./src
COPY backend/tsconfig.json ./

RUN npm run build

# Production stage
FROM node:20-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install production deps only
COPY backend/package*.json ./
RUN npm install --only=production

# Copy prisma and generate
COPY prisma ./prisma
RUN npx prisma generate

# Copy built files
COPY --from=build /app/dist ./dist

EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

CMD ["npm", "run", "start"]
