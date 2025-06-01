FROM node:16-alpine as build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using npm install instead of npm ci
# This will handle any sync issues between package.json and package-lock.json
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]