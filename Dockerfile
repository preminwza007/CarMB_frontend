# Use an official Node runtime as a parent image
FROM node:24-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Install `serve` to serve your app on port 3000
RUN npm install -g serve

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]
