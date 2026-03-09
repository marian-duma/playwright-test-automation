# Pre-configured image with all Playwright dependencies
FROM mcr.microsoft.com/playwright:v1.58.2-noble

# Working directory inside the container
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Avoid Chromium shared memory issues
ENV CI=1

# Run tests
CMD ["npx", "playwright", "test"]