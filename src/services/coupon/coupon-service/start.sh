#!/bin/bash

# Define variables
IMAGE_NAME="couponservice"
CONTAINER_NAME="couponservice_container"
PORT=6001

# Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME .

# Check if the container is already running and stop it
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping the running container..."
    docker stop $CONTAINER_NAME
fi

# Remove the container if it exists
if [ "$(docker ps -aq -f status=exited -f name=$CONTAINER_NAME)" ]; then
    echo "Removing the existing container..."
    docker rm $CONTAINER_NAME
fi

# Run the Docker container
echo "Running the Docker container..."
docker run -d --name $CONTAINER_NAME -p $PORT:$PORT --env-file .env $IMAGE_NAME

echo "Docker container is running on port $PORT"