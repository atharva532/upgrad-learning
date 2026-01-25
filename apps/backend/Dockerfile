# Backend Dockerfile for @upgrad/backend
# Multi-stage build for optimal image size

# ========================================
# Stage 1: Builder (Build + Dependencies)
# ========================================
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy workspace root files needed for pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./

# Copy the backend package.json
COPY apps/backend/package.json ./apps/backend/

# Copy packages (shared dependencies)
COPY packages ./packages

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy backend source code
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

# Generate Prisma client
RUN pnpm db:generate

# Build the application
RUN pnpm build

# ========================================
# Stage 2: Production Runner
# ========================================
FROM node:20-alpine AS runner

# Install pnpm for production dependency installation
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package.json, pnpm files, and prisma schema for production
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/prisma ./prisma

# Copy the full node_modules from builder (includes generated Prisma client)
# Then prune dev dependencies to reduce image size
COPY --from=builder /app/apps/backend/node_modules ./node_modules
RUN pnpm prune --prod

# Copy built application
COPY --from=builder /app/apps/backend/dist ./dist

# Switch to non-root user
USER expressjs

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "dist/server.js"]
