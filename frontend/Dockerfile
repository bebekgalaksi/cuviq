# Tahap build (menggunakan Node.js)
FROM node:18-alpine AS builder

WORKDIR /app

# Salin file konfigurasi dan dependency
COPY package*.json ./
COPY vite.config.js tailwind.config.js ./

# Install dependencies dan build
RUN npm install
COPY . .  
RUN npm run build 

# Tahap production: gunakan Nginx untuk serve frontend statis
FROM nginx:alpine

# Salin konfigurasi default nginx jika perlu (opsional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Salin hasil build dari builder ke folder html Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx (default CMD dari base image sudah memadai)
CMD ["nginx", "-g", "daemon off;"]