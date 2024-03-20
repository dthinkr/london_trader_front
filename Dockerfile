# Build stage
FROM node:20 AS build-stage

WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your application's source code
COPY . .

# Build the application
RUN yarn build

# Serve stage
FROM nginx:stable-alpine as serve-stage

# Copy built assets from build-stage to nginx server
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]