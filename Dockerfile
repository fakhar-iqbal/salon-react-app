# Build stage
FROM node:alpine3.18 AS build

# Set Node.js memory limit for low-memory environments
ENV NODE_OPTIONS="--max-old-space-size=2560"

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies with memory optimization
RUN npm ci --silent --no-optional

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Production stage - serve with nginx  
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]