#FROM eu.gcr.io/mussia8/nx AS builder
FROM node:17-alpine AS builder

WORKDIR /app

ENV NODE_ENV=$NODE_ENV
COPY ./dist .
ENV PORT=3333
EXPOSE ${PORT}
RUN npm install --production

#ARG NODE_ENV
#ARG BUILD_FLAG
#
#WORKDIR /app/builder
#RUN npm i
#RUN npx nx build big-data-bi-service --prod
#
#FROM node:16-alpine
#WORKDIR /app
#COPY --from=builder /app/builder/dist/apps/big-data/bi-service ./
#RUN ls
#RUN npm install --only=production
#RUN npm i -D tslib
#
#ENV NODE_ENV=$NODE_ENV

CMD ["node", "main.js"]
