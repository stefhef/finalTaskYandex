FROM node:20.2-buster-slim as build-stage
WORKDIR /usr/src/app
COPY package.json ./
COPY . .
RUN npm install package.json
RUN npm run build
RUN npm install -g serve

