.PHONY: build test run

# Build the binary
build:
	@echo "Building wsServer..."
	@go build -o bin/wsServer cmd/main.go
	@echo "Build complete."

# Run tests
test:
	@echo "Running tests..."
	@go test -v ./...

# Run the server with improved error handling
run: build
	@echo "Starting wsServer..."
	@./bin/wsServer || { echo "wsServer exited with an error. Exit code: $$?"; exit 1; }

# Keep the container running even if the main process exits
keep-alive:
	@echo "Starting wsServer in keep-alive mode..."
	@./bin/wsServer || { echo "wsServer exited with an error. Exit code: $$?"; }
	@echo "wsServer stopped. Keeping container alive..."
	@tail -f /dev/null

# Default target
.DEFAULT_GOAL := run
