# Dockerfile.dev
FROM node:22

# Container work directory
WORKDIR /app

# Copy project configuration files
COPY package*.json ./

# Clean install
RUN rm -rf node_modules package-lock.json

# Install dependencies
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3001

# Run the application.
CMD ["npm", "run", "dev"]
