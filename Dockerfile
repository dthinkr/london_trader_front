# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./
# If you're using yarn, uncomment the next line and delete the npm install line
# COPY yarn.lock ./

# Install any dependencies
RUN npm install
# If you're using yarn, uncomment the next line and delete the npm install line
# RUN yarn install

# Bundle your app's source code inside the Docker container
COPY . .

# Your application runs on port 3000, so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "--no-warnings", "./node_modules/.bin/vite" ]