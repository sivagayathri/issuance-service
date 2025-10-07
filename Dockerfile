FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Use a non-root user
USER node

EXPOSE 3000
CMD ["node", "--loader", "ts-node/esm", "src/index.ts"]
