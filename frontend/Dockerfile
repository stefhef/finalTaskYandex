FROM node:20.2-buster-slim as build-stage
WORKDIR /usr/src/app
COPY package.json ./
COPY . .
RUN npm build
RUN npm install -g serve

