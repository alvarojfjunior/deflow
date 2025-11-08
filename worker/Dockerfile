# ============================
FROM node:20-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies (inclui devDependencies para watch)
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=1

# Expose port 3000
EXPOSE 3000

# Run in development mode with watch
CMD ["npm", "run", "dev:watch"]
