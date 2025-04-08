# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package.json and pnpm-lock.yaml for dependency installation
COPY package* ./

# Install all dependencies (including devDependencies) for building
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Remove the .env file 
RUN rm .env

# Expose port 3000 (default for Next.js)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]