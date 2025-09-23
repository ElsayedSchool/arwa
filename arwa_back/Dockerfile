# Use an official Node.js runtime as a parent image
FROM node:22-alpine3.20


ENV STAGE=prod
ENV PORT=3000
# Install build tools for native modules (optional, if your project requires it)
RUN apk add --no-cache make gcc g++ python3

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies
RUN npm install --force

# Remove build tools to reduce image size (optional, if you installed them earlier)
RUN apk del make gcc g++ python3

# Copy the rest of the application code
COPY ./ ./

# Build the NestJS application
RUN npm run build


# Expose the port that the NestJS app runs on
EXPOSE 3000

RUN chmod -R +x /usr/app/node_modules/.bin

Copy .env.prod .
# Start the application
CMD [ "npm", "run", "start" ]
