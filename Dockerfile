FROM node:16 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install
RUN npm run build

FROM golang:1.22.2-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/ .

RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -a -installsuffix cgo -o bin/wsServer cmd/main.go

FROM alpine:3.18
WORKDIR /app

COPY --from=backend-builder /app/backend/bin/wsServer /app/bin/wsServer
COPY --from=backend-builder /app/backend/bin/cixac /app/bin/cixac
COPY --from=backend-builder /app/backend/Makefile /app/Makefile
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV FRONTEND_PATH=/app/frontend/dist

# Install runtime dependencies
# RUN apk add --no-cache make

RUN chmod +x /app/bin/wsServer /app/bin/cixac

ENTRYPOINT ["./bin/wsServer"]
# ENTRYPOINT ["make", "keep-alive"]
