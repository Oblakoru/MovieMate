FROM node:22.14.0
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies within the container
RUN npm install

# Copy everything else
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]