package database

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestConnect(t *testing.T) {
	tests := []struct {
		name string
	}{
		{"TestConnect"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			database := NewDatabase()
			assert.NotNil(t, database)
			db, err := database.Connect()
			assert.NoError(t, err)
			assert.NotNil(t, db)
			_, ok := db.(*MongoClient)
			assert.True(t, ok, "db is not of type MongoClient")
		})
	}
}
