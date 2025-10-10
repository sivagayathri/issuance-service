# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev (typescript)
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Compile TypeScript
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy build output from builder
COPY --from=builder /app/dist ./dist

USER node
EXPOSE 4000
CMD ["node", "dist/index.js"]
