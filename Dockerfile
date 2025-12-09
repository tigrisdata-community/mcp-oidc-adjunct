# Use Node.js LTS as base image
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY src/ ./src/
COPY tsconfig.json ./
RUN npm run build \
  && npm prune --production \
  && addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001 \
  && chown -R nodejs:nodejs /app

USER nodejs
EXPOSE 4001

ENV NODE_ENV=production
ENV PORT=4001

# Run the application
CMD ["node", "dist/index.js"]