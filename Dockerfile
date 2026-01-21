FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code and build
COPY . .
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
