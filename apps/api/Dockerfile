# syntax=docker/dockerfile:1
# Build: docker build -t pos-api --build-arg VERSION=$(git rev-parse --short HEAD) apps/api
FROM golang:1.27-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
ARG VERSION=dev
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w -X main.version=${VERSION}" -o /out/api ./cmd/api

# Image akhir tanpa shell, jalan sebagai user non-root.
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/api /api
EXPOSE 8080
ENTRYPOINT ["/api"]
CMD ["serve"]
