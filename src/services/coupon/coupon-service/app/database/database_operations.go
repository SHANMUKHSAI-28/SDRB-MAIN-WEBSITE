package database

import (
	"context"
	"couponservice/app/model"
	"fmt"

	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
)

func (m *MongoClient) GetCoupons() ([]model.Coupon, error) {
	if m.DB == nil {
		log.Error("DB is nil")
		return nil, fmt.Errorf("DB is nil")
	}
	collection := m.DB.Collection("coupons")
	if collection == nil {
		log.Error("Collection is nil")
		return nil, fmt.Errorf("Collection is nil")
	}
	cursor, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		log.Errorf("Error getting coupons: %v", err)
		return nil, err
	}
	var coupons []model.Coupon
	if err = cursor.All(context.Background(), &coupons); err != nil {
		log.Errorf("Error decoding coupons: %v", err)
		return nil, err
	}
	return coupons, nil
}

func (m *MongoClient) CreateCoupon(coupon model.Coupon) error {
	if m.DB == nil {
		log.Error("DB is nil")
		return fmt.Errorf("DB is nil")
	}
	collection := m.DB.Collection("coupons")
	errr := collection.FindOne(context.Background(), bson.M{"coupon_code": coupon.CouponCode}).Decode(&model.Coupon{})
	if errr == nil {
		log.Errorf("Coupon already exists")
		return fmt.Errorf("Coupon already exists")
	}
	_, err := collection.InsertOne(context.Background(), coupon)
	if err != nil {
		log.Errorf("Error creating coupon: %v", err)
		return err
	}
	return nil
}

func (m *MongoClient) DeleteCoupon(couponCode string) error {
	if m.DB == nil {
		log.Error("DB is nil")
		return fmt.Errorf("DB is nil")
	}
	collection := m.DB.Collection("coupons")
	result, err := collection.DeleteOne(context.Background(), bson.M{"coupon_code": couponCode})
	if err != nil {
		log.Errorf("Error deleting coupon: %v", err)
		return err
	}
	if result.DeletedCount == 0 {
		log.Errorf("No coupon found with coupon_code: %s", couponCode)
		return fmt.Errorf("No coupon found with coupon_code: %s", couponCode)
	}
	return nil
}

func (m *MongoClient) UpdateCoupon(coupon model.Coupon) error {
	if m.DB == nil {
		log.Error("DB is nil")
		return fmt.Errorf("DB is nil")
	}
	collection := m.DB.Collection("coupons")
	_, err := collection.UpdateOne(context.Background(), bson.M{"coupon_code": coupon.CouponCode}, bson.M{"$set": coupon})
	if err != nil {
		log.Errorf("Error updating coupon: %v", err)
		return err
	}
	return nil
}

func (m *MongoClient) GetCouponByCode(couponCode string) (model.Coupon, error) {
	if m.DB == nil {
		log.Error("DB is nil")
		return model.Coupon{}, fmt.Errorf("DB is nil")
	}
	collection := m.DB.Collection("coupons")
	var coupon model.Coupon
	err := collection.FindOne(context.Background(), bson.M{"coupon_code": couponCode}).Decode(&coupon)
	if err != nil {
		log.Errorf("Error getting coupon by code: %v", err)
		return model.Coupon{}, err
	}
	return coupon, nil
}

func (m *MongoClient) GetCouponByUserID(userID string) ([]model.Coupon, error) {
	if m.DB == nil {
		log.Error("DB is nil")
		return nil, fmt.Errorf("DB is nil")
	}
	collection := m.DB.Collection("coupons")
	cursor, err := collection.Find(context.Background(), bson.M{"usage_entries.user_id": userID})
	if err != nil {
		log.Errorf("Error getting coupons by user ID: %v", err)
		return nil, err
	}
	var coupons []model.Coupon
	if err = cursor.All(context.Background(), &coupons); err != nil {
		log.Errorf("Error decoding coupons: %v", err)
		return nil, err
	}
	return coupons, nil
}

func (m *MongoClient) Close() error {
	if m.DB.Client() != nil {
		if err := m.DB.Client().Disconnect(context.Background()); err != nil {
			log.Errorf("Error disconnecting from MongoDB: %v", err)
			return fmt.Errorf("Error disconnecting from MongoDB: %v", err)
		}
	}
	return nil
}

func (m *MongoClient) Ping() error {
	if m.DB.Client() != nil {
		if err := m.DB.Client().Ping(context.Background(), nil); err != nil {
			log.Errorf("Error pinging MongoDB: %v", err)
			return fmt.Errorf("Error pinging MongoDB: %v", err)
		}
	}
	return nil
}
