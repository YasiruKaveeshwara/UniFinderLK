# Backend Dockerfile (Node.js/Express)
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy package files first for better caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-5000}/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
