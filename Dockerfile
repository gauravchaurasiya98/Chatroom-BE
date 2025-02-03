# Stage 1: Builder - Install dependencies
FROM node:18-slim AS builder

WORKDIR /app

# Install OS dependencies needed for bcrypt (or other native modules)
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json ./

# Ensure a clean install of dependencies, including dotenv
RUN npm ci --omit=dev

# Copy the entire source code
COPY . .

# Rebuild bcrypt to ensure compatibility with container OS
RUN npm rebuild bcrypt --build-from-source

# Stage 2: Final Image
FROM node:18-slim

WORKDIR /app

# Copy only built dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json /app/package-lock.json ./

# Copy application source files
COPY --from=builder /app/app.js ./  
COPY --from=builder /app/controllers ./controllers  
COPY --from=builder /app/errors ./errors  
COPY --from=builder /app/middlewares ./middlewares  
COPY --from=builder /app/models ./models  
COPY --from=builder /app/routes ./routes  
COPY --from=builder /app/utils ./utils  

# Expose API port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
