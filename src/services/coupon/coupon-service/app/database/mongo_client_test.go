package database

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewMongoClient(t *testing.T) {
	tests := []struct {
		name    string
		wantErr bool
	}{
		{
			name:    "Test NewMongoClient",
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := NewMongoClient()
			assert.NoError(t, err)
		})
	}

}

func TestGetMongoClient(t *testing.T) {
	tests := []struct {
		name    string
		wantErr bool
	}{
		{
			name:    "Test GetMongoClient",
			wantErr: false,
		},
		{
			name:    "Test Singleton",
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.name == "Test Singleton" {
				_, err := GetMongoClient()
				assert.NoError(t, err)
			}
			_, err := GetMongoClient()
			assert.NoError(t, err)
		})
	}
}
