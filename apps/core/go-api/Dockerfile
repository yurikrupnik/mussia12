# syntax=docker/dockerfile:1

# Alpine is chosen for its small footprint
# compared to Ubuntu
#FROM golang:1.16
FROM gcr.io/distroless/base-debian10

WORKDIR /app

#ENV NODE_ENV=$NODE_ENV
COPY ./main ./main
ENV PORT=3333
#EXPOSE ${PORT}

#USER nonroot:nonroot

ENTRYPOINT ["/main"]
