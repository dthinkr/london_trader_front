FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# Expose port
EXPOSE 3000

# run the Vite development server
CMD ["yarn", "prod"]