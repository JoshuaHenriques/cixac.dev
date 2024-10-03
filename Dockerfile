# Stage 1: Build the frontend
FROM node:16 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install
RUN npm run build

# Stage 2: Build the backend
FROM golang:1.22.2-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Install build dependencies
RUN apk add --no-cache make

# Build the Go application
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -a -installsuffix cgo -o bin/wsServer cmd/main.go

# For debug: List contents of bin directory
RUN echo "Contents of /app/backend/bin:" && ls -la /app/backend/bin

# Stage 3: Create the final image
FROM alpine:3.18
WORKDIR /app

# Copy the built artifacts from previous stages
COPY --from=backend-builder /app/backend/bin/wsServer /app/bin/wsServer
COPY --from=backend-builder /app/backend/bin/cixac /app/bin/cixac
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
COPY --from=backend-builder /app/backend/Makefile /app/Makefile

# Install runtime dependencies
RUN apk add --no-cache make

# For debug: List contents of bin directory in final image
RUN echo "Contents of /app/bin:" && ls -la /app/bin

# Ensure executables have correct permissions
RUN chmod +x /app/bin/wsServer /app/bin/cixac

ENTRYPOINT ["./bin/wsServer"]
# ENTRYPOINT ["make", "keep-alive"]
