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

# Copy your application code
COPY . .

# Runtime stage
# Start your application with PM2
FROM keymetrics/pm2:latest

# Copy your application code from the builder stage
COPY --from=builder /build /app

WORKDIR /app

# Replace "index.js" with your app's entry point
CMD ["pm2-runtime", "start", "index.js"]

EXPOSE 8000