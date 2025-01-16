package database

import (
	"couponservice/app/model"
)

type Database interface {
	Connect() (Database, error)
	Close() error
	Ping() error
	GetCoupons() ([]model.Coupon, error)
	CreateCoupon(model.Coupon) error
	DeleteCoupon(string) error
	UpdateCoupon(model.Coupon) error
	GetCouponByCode(couponCode string) (model.Coupon, error)
	GetCouponByUserID(userID string) ([]model.Coupon, error)
}

func (m *MongoClient) Connect() (Database, error) {
	return GetMongoClient()
}

func NewDatabase() Database {
	return &MongoClient{}
}
