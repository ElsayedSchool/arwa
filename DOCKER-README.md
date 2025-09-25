# Docker Compose workflows (development & production)

This repository includes two docker-compose overlays and helper files for both development and production deployments.

Files added:

- `docker-compose.yml` - base compose file for services and volumes
- `docker-compose.dev.yml` - development overlay (mounts source, uses dev backend Dockerfile)
- `docker-compose.prod.yml` - production overlay (pulls pre-built images from registry)
- `.env.example` - example environment variables

Quickstart - Development (local)

1. Copy `.env.dev` from `.env.example` and adjust values.
2. From repo root run:

```powershell
# start dev stack (builds images and mounts source for live reload)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

3. To stop and remove:

```powershell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

Quickstart - Production (EC2)

1. Build and publish images locally (example uses GitHub Container Registry):

```powershell
# in arwa_back folder - backend image
cd arwa_back
docker build -t ghcr.io/<your-org>/arwa-back:latest .
docker push ghcr.io/<your-org>/arwa-back:latest

# in arwa folder - frontend image
cd ../arwa
docker build -t ghcr.io/<your-org>/arwa-front:latest .
docker push ghcr.io/<your-org>/arwa-front:latest
```

2. On the EC2 server clone this repository and create a `.env.production` file using `.env.example`.
3. Run the production compose (this pulls the images defined in `.env.production`):

```powershell
# on EC2 (Windows PowerShell used in examples)
cd C:\path\to\arwa
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Notes & Troubleshooting

- Data persistence: the Postgres and Redis data directories are host-mounted (`./pgdata`, `./redisdata`). Ensure these paths are on persistent storage (e.g., an attached EBS volume on EC2).
- Migrations: backend `entrypoint.sh` runs `npm run migration:run` on container start; ensure DB credentials/host are correct in `.env.production`.
- Healthchecks: consider adding healthcheck blocks to the compose for production.

If you want, I can:

- Run the development compose here and validate the categories endpoints.
- Build/publish example images to a registry I can use for testing (requires your registry credentials).
