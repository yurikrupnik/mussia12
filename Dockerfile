FROM node:17-alpine

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .

