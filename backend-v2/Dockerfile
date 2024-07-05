# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /server

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose ports (optional for the build stage)
EXPOSE 3000
EXPOSE 3001

# Stage 2: Run the application
FROM node:20-alpine

WORKDIR /server

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the built application from the builder stage
COPY --from=builder /server ./

# Change ownership and permissions
RUN chown -R node:node /server && chmod -R 755 /server

# Install PM2 globally
RUN npm install pm2 -g

# Copy PM2 ecosystem config file
COPY ecosystem.config.cjs .

# Switch to the node user
USER node

# Expose ports
EXPOSE 3000
EXPOSE 3001

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
