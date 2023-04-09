FROM node:14.17.0-alpine
WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY build build
EXPOSE 8000
ENTRYPOINT ["node","build/index.js"]