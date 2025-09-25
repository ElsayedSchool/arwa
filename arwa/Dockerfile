# Frontend Dockerfile - builds the Vite app and serves with a lightweight server
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies separately for better caching
COPY package*.json ./
# Use npm install (no lockfile present) – if you add a lockfile later you can switch to npm ci
RUN npm install --no-audit --no-fund

# Copy the rest of the source code
COPY . .

# Allow overriding base path for dev container builds
ARG BASE_PATH=/arwa/
ENV VITE_BASE_PATH=$BASE_PATH

# Build the application (includes type checking)
RUN npm run build

FROM nginx:stable-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
