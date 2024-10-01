FROM node:16 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install
RUN npm run build

FROM golang:1.22.2-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# for debug
RUN echo "Contents of /app/backend/bin:"
RUN ls -la /app/backend/bin

RUN apk add --no-cache make

ENTRYPOINT ["make", "run"]

EXPOSE $PORT
