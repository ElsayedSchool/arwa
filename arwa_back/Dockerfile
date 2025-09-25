### Multi-stage production Dockerfile
### - builder: installs all deps and builds TypeScript -> dist
### - runner: installs only production deps and copies compiled dist

FROM node:22-alpine3.20 AS builder
WORKDIR /usr/app

# Install build dependencies (needed for some native modules)
RUN apk add --no-cache make gcc g++ python3

# Copy package manifests and install full deps for build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Remove build tools in builder to keep layers small
RUN apk del make gcc g++ python3 || true


FROM node:22-alpine3.20 AS runner
WORKDIR /usr/app

ENV NODE_ENV=production
ENV STAGE=prod
ENV PORT=3000

# Copy package manifests and install only production dependencies
COPY package*.json ./
# Use npm install in runner to be more tolerant of registry/network issues
# and ensure production deps are installed. This is slightly less strict than
# `npm ci` but more likely to succeed in constrained environments.
RUN npm install --production --no-audit --no-fund

# Copy only the compiled output from builder
COPY --from=builder /usr/app/dist ./dist

# Copy entrypoint and make executable
COPY --from=builder /usr/app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh || true

# Expose the runtime port
EXPOSE 3000

# Entrypoint will run migrations then start the app
ENTRYPOINT ["/usr/app/entrypoint.sh"]
