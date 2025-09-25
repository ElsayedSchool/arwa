#!/bin/sh
set -e

# If .env exists in the container root, copy it to app
if [ -f "/.env" ]; then
  echo "Loading environment file /.env"
  cp /.env /usr/app/.env
fi

# Run migrations if the command exists
echo "Running DB migrations..."
npm run migration:run || echo "Migration step failed or no migrations to run yet"

# Start the app in production
exec npm run start:prod
