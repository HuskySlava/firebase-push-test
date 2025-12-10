BINARY_NAME=push-sender
BUILD_DIR=bin
MAIN_FILE=main.go

# Default: builds for all platforms
all: dep clean macos windows linux

# Clean up previous builds
clean:
	@echo "Cleaning up..."
	@rm -rf $(BUILD_DIR)

# Get dependencies
dep:
	@echo "Checking dependencies..."
	@go mod tidy

# Build for Apple Silicon (macOS ARM64)
macos:
	@echo "Building for Apple Silicon (Darwin ARM64)..."
	@mkdir -p $(BUILD_DIR)
	@CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -o $(BUILD_DIR)/$(BINARY_NAME)-darwin-arm64 $(MAIN_FILE)

# Build for Windows (64-bit)
windows:
	@echo "Building for Windows (AMD64)..."
	@mkdir -p $(BUILD_DIR)
	@CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o $(BUILD_DIR)/$(BINARY_NAME)-windows-amd64.exe $(MAIN_FILE)

# Build for Linux (64-bit)
linux:
	@echo "Building for Linux (AMD64)..."
	@mkdir -p $(BUILD_DIR)
	@CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o $(BUILD_DIR)/$(BINARY_NAME)-linux-amd64 $(MAIN_FILE)

# Run locally (uses your current OS architecture)
run:
	go run $(MAIN_FILE)