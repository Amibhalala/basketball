FROM node:14.17.0-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
ENTRYPOINT ["node","build/index.js"]