# Frontend Dockerfile for @upgrad/frontend
# Multi-stage build for optimal image size

# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:20-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy workspace root files needed for pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile --filter @upgrad/frontend...

# ========================================
# Stage 2: Builder
# ========================================
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules

# Copy source code
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/frontend ./apps/frontend
COPY packages ./packages

WORKDIR /app/apps/frontend

# Build arguments for environment variables at build time
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN pnpm build

# ========================================
# Stage 3: Production Runner (Nginx)
# ========================================
FROM nginx:alpine AS runner

# Copy custom nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Add non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/log/nginx && \
  touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 5174
EXPOSE 5174

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5174/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
