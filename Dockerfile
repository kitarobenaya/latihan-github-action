# =============================================================================
# Stage 1: Install production dependencies
# =============================================================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first (layer cache optimization)
COPY package.json package-lock.json ./

# Install production dependencies only — no devDependencies
RUN npm ci --omit=dev --ignore-scripts

# =============================================================================
# Stage 2: Final runtime image
# =============================================================================
FROM node:20-alpine AS final

# Security: create a non-root user and group
RUN addgroup -S appgroup && adduser -S -G appgroup -u 1001 appuser

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY src/ ./src/
COPY package.json ./

# Set ownership of app files to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3000

# Health check — uses /health endpoint (for HAProxy / Docker / Kubernetes)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "src/app.js"]
