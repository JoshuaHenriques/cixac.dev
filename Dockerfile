FROM node:16 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install
RUN npm run build

FROM golang:1.22.2-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

RUN apk add --no-cache make

CMD ["make", "run"]

EXPOSE $PORT

ENV PORT=8080
