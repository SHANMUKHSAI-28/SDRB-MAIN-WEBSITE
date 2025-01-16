package database

import (
	"context"
	"fmt"
	"os"
	"sync"

	"github.com/joho/godotenv"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoClient struct {
	DB *mongo.Database
}

var (
	mongoClient *MongoClient
	once        sync.Once
)

func NewMongoClient() (*MongoClient, error) {
	err := godotenv.Load()
	if err != nil {
		log.Errorf("Error loading .env file")
	}
	MONGO_URI := os.Getenv("MONGO_URI")
	MONGO_DB_NAME := os.Getenv("MONGO_DB_NAME")
	if MONGO_URI == "" || MONGO_DB_NAME == "" {
		log.Errorf("MONGO_URI or MONGO_DB_NAME not found in .env file")
		return nil, fmt.Errorf("MONGO_URI or MONGO_DB_NAME not found in .env file")
	}
	clientOptions := options.Client().ApplyURI(MONGO_URI)

	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Errorf("Error creating mongo client: %v", err)
		return nil, err
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Errorf("Error connecting to mongo: %v", err)
		return nil, err
	}

	log.Printf("Connected to MongoDB!")
	db := client.Database(MONGO_DB_NAME)

	return &MongoClient{DB: db}, nil

}

func GetMongoClient() (*MongoClient, error) {
	var err error
	once.Do(func() {
		mongoClient, err = NewMongoClient()
	})
	return mongoClient, err
}
