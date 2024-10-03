FROM node:16 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install
RUN npm run build

FROM alpine:3.18 AS backend-builder
WORKDIR /app/backend
COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV GO_VERSION 1.22.2

RUN apk add --no-cache ca-certificates make

RUN wget -O go.tgz "https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz" \
  && tar -C /usr/local -xzf go.tgz \
  && rm go.tgz

ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH /go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH

RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"

# for debug
RUN echo "Contents of /app/backend/bin:"
RUN ls -la /app/backend/bin

RUN go build -o bin/wsServer cmd/main.go

ENTRYPOINT ["make", "keep-alive"]

EXPOSE $PORT
