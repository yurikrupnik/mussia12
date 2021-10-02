FROM eu.gcr.io/mussia8/nx AS builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder
RUN npm i
RUN npx nx build fullstack-users --prod

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/builder/dist/apps/fullstack/users ./
RUN ls
RUN npm install --only=production
RUN npm i -D tslib

ENV NODE_ENV=$NODE_ENV

CMD ["node", "main.js"]
