FROM node:17-alpine AS runner
WORKDIR /app

COPY ./dist .
ENV NODE_ENV production
ENV PORT=3000
EXPOSE ${PORT}
RUN npm install --production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

CMD ["npm", "start"]
