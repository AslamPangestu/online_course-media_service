# Build stage
FROM node:20.17.0-alpine3.20 AS builder

# Install Yarn
RUN apk add --no-cache yarn

# Copy All
COPY . .

# Install dependencies using Yarn
RUN yarn install

# Compile app to js
RUN yarn build

RUN yarn global add pm2

# Replace "index.js" with your app's entry point
CMD ["pm2-runtime", "start", "pm2.json"]

EXPOSE 10000