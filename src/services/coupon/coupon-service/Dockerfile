# Use the official Golang image as the base image
FROM golang:1.23.4-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Build the Go app
RUN go build -o main ./main.go

# Start a new stage from scratch
FROM alpine:latest

# Set the Current Working Directory inside the container
WORKDIR /root/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .
COPY --from=builder /app/.env .
COPY --from=builder /app/app/database/.env .
COPY --from=builder /app/app/server/.env .

# Expose port 6001 to the outside world
EXPOSE 6001

# Command to run the executable
CMD ["./main"]