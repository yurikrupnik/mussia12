# Install dependencies only when needed
#FROM node:16-alpine AS deps
## Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apk add --no-cache libc6-compat
#WORKDIR /app
#COPY package.json package-lock.json ./
#RUN npm i --frozen-lockfile

# Rebuild the source code only when needed
#FROM eu.gcr.io/mussia8/nx AS builder
#WORKDIR /app/builder
#RUN npm i
#RUN npx nx run fullstack-client-next:build --prod
#RUN npm run build && npm i --production --ignore-scripts --prefer-offline
#
## Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

#COPY --from=builder /app/builder/dist/apps/fullstack/client-next .
COPY ./dist .
ENV PORT=3000
EXPOSE ${PORT}
RUN npm install --production

RUN ls -a
RUN cat package.json
RUN npm install --only=production

ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]
