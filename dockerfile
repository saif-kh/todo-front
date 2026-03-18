# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Run stage with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed (for API routing)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]