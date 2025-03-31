# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy environment files first (important to be before the rest of the app)
COPY .env* ./

# Copy the rest of the application
COPY . .



# Display environment variables for debugging (will be visible in build logs)
RUN echo "Environment variables:" && cat .env || echo "No .env file found"
RUN echo "Production environment variables:" && cat .env.production || echo "No .env.production file found"

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]