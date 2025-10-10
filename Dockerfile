# Use official Node 20 alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies, ignore dev deps (like Vitest)
RUN npm ci --omit=dev --legacy-peer-deps

# Copy rest of the source code
COPY . .

# Compile TypeScript
RUN npm run build

# Use a non-root user
USER node

# Expose port
EXPOSE 4000

# Run the compiled app
CMD ["node", "dist/index.js"]
