# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Stage 2: Run the application in development mode
FROM node:20-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app ./

# Install development dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 5173

# Start the application in development mode
#CMD ["npm", "run", "dev"]


# Start the application in development mode with --host flag
CMD ["npm", "run", "dev", "--", "--host"]
