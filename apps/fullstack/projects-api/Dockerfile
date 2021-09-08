FROM eu.gcr.io/mussia8/nx AS builder

ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app/builder

RUN npx nx build fullstack-projects-api --prod

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/builder/dist/apps/fullstack/projects-api ./
RUN ls
RUN npm install --only=production
RUN npm i -D tslib

ENV NODE_ENV=$NODE_ENV

CMD ["node", "main.js"]
