FROM golang:1.21
ENV DOCKER=true

WORKDIR /code
COPY go.mod go.sum ./
RUN go mod download
COPY *.go ./