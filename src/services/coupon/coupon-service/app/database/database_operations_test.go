package database

import (
	"couponservice/app/model"
	"log"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestGetCoupons(t *testing.T) {
	tests := []struct {
		name string
	}{
		{"TestGetCoupons"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			database := NewDatabase()
			assert.NotNil(t, database)
			db, err := database.Connect()
			assert.NoError(t, err)
			coupons, err := db.GetCoupons()
			assert.NoError(t, err, "Error getting coupons")
			assert.NotNil(t, coupons)
			// log.Printf("Coupons: %v", coupons)
			coupon := coupons[0]
			assert.NotNil(t, coupon)
			assert.True(t, IsValidCoupon(t, coupon))
		})
	}
}

func IsValidCoupon(t *testing.T, coupon model.Coupon) bool {
	log.Printf("Coupon: %T", coupon)
	assert.IsType(t, primitive.ObjectID{}, coupon.ID)
	assert.IsType(t, "", coupon.CouponCode)
	assert.IsType(t, "", coupon.Description)
	assert.IsType(t, model.DiscountType_FIXED, coupon.DiscountType)
	assert.IsType(t, int32(0), coupon.DiscountValue)
	assert.IsType(t, float64(0.0), coupon.MinOrderValue)
	assert.IsType(t, []model.ProductCategory{}, coupon.ApplicableProductCategories)
	assert.IsType(t, []string{}, coupon.ApplicableProducts)
	assert.IsType(t, int32(0), coupon.RedemptionsLeft)
	assert.IsType(t, int32(0), coupon.PerUserLimit)
	assert.IsType(t, time.Time{}, coupon.ValidFrom)
	assert.IsType(t, time.Time{}, coupon.ValidTill)
	assert.IsType(t, false, coupon.IsActive)
	assert.IsType(t, "", coupon.CreatedBy)
	assert.IsType(t, time.Time{}, coupon.CreatedAt)
	assert.IsType(t, "", coupon.UpdatedBy)
	assert.IsType(t, time.Time{}, coupon.UpdatedAt)
	assert.IsType(t, "", coupon.TermsAndConditions)
	assert.IsType(t, []model.UsageEntry{}, coupon.UsageEntries)
	return true
}

func TestCreateCoupon(t *testing.T) {
	t.Run("CreateCouponSucess", func(t *testing.T) {
		database := NewDatabase()
		assert.NotNil(t, database)
		db, err := database.Connect()
		assert.NoError(t, err)
		coupon := model.Coupon{
			CouponCode:                  "TESTCOUPON",
			Description:                 "Test Coupon",
			DiscountType:                model.DiscountType_FIXED,
			DiscountValue:               100,
			MinOrderValue:               500,
			ApplicableProductCategories: []model.ProductCategory{model.ProductCategory_RETROFIT},
			ApplicableProducts:          []string{"TESTPRODUCT"},
			RedemptionsLeft:             100,
			PerUserLimit:                1,
			ValidFrom:                   time.Now(),
			ValidTill:                   time.Now().AddDate(0, 0, 7),
			IsActive:                    true,
			CreatedBy:                   "TESTUSER",
			CreatedAt:                   time.Now(),
			UpdatedBy:                   "TESTUSER",
			UpdatedAt:                   time.Now(),
			TermsAndConditions:          "Test Terms and Conditions",
			UsageEntries:                []model.UsageEntry{},
		}
		err = db.CreateCoupon(coupon)
		assert.NoError(t, err, "Error creating coupon")
	})
	t.Run("CreateCouponFailure", func(t *testing.T) {
		database := NewDatabase()
		assert.NotNil(t, database)
		db, err := database.Connect()
		assert.NoError(t, err)
		coupon := model.Coupon{
			CouponCode:                  "TESTCOUPON",
			Description:                 "Test Coupon",
			DiscountType:                model.DiscountType_FIXED,
			DiscountValue:               100,
			MinOrderValue:               500,
			ApplicableProductCategories: []model.ProductCategory{model.ProductCategory_RETROFIT},
			ApplicableProducts:          []string{"TESTPRODUCT"},
			RedemptionsLeft:             100,
			PerUserLimit:                1,
			ValidFrom:                   time.Now(),
			ValidTill:                   time.Now().AddDate(0, 0, 7),
			IsActive:                    true,
			CreatedBy:                   "TESTUSER",
			CreatedAt:                   time.Now(),
			UpdatedBy:                   "TESTUSER",
			UpdatedAt:                   time.Now(),
			TermsAndConditions:          "Test Terms and Conditions",
			UsageEntries:                []model.UsageEntry{},
		}
		err = db.CreateCoupon(coupon)
		assert.Error(t, err, "Error creating coupon")
	})
	DeleteCoupon(t)

}

func TestGetCouponByCode(t *testing.T) {
	tests := []struct {
		name string
	}{
		{"TestGetCouponByCode"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			database := NewDatabase()
			assert.NotNil(t, database)
			db, err := database.Connect()
			assert.NoError(t, err)
			couponCode := "SMART10"
			coupon, err := db.GetCouponByCode(couponCode)
			assert.NoError(t, err, "Error getting coupon by code")
			assert.NotNil(t, coupon)
			assert.True(t, IsValidCoupon(t, coupon))
		})
	}
}

func DeleteCoupon(t *testing.T) {
	tests := []struct {
		name       string
		couponCode string
	}{
		{"TestDeleteCoupon", "TESTCOUPON"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			database := NewDatabase()
			assert.NotNil(t, database)
			db, err := database.Connect()
			assert.NoError(t, err)
			err = db.DeleteCoupon(tt.couponCode)
			assert.NoError(t, err, "Error deleting coupon")
		})
	}
}

func TestGetCouponByUserID(t *testing.T) {
	tests := []struct {
		name   string
		userID string
	}{
		{"TestGetCouponByUserID", "user_333"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			database := NewDatabase()
			assert.NotNil(t, database)
			db, err := database.Connect()
			assert.NoError(t, err)
			coupons, err := db.GetCouponByUserID(tt.userID)
			assert.NoError(t, err, "Error getting coupon by user ID")
			assert.NotNil(t, coupons)
			// log.Printf("Coupons: %v", coupons)
			coupon := coupons[0]
			assert.NotNil(t, coupon)
			assert.True(t, IsValidCoupon(t, coupon))
		})
	}
}

func TestUpdateCoupon(t *testing.T) {
	tests := []struct {
		name string
	}{
		{"TestUpdateCoupon"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			database := NewDatabase()
			assert.NotNil(t, database)
			db, err := database.Connect()
			assert.NoError(t, err)
			couponCode := "WINTER50"
			coupon, err := db.GetCouponByCode(couponCode)
			assert.NoError(t, err, "Error getting coupon by code")
			assert.NotNil(t, coupon)
			coupon.Description = "Updated Test Coupon"
			err = db.UpdateCoupon(coupon)
			assert.NoError(t, err, "Error updating coupon")
		})
	}
}

func TestClose(t *testing.T) {
	tests := []struct {
		name string
	}{
		{"TestClose"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			database := NewDatabase()
			assert.NotNil(t, database)
			db, err := database.Connect()
			assert.NoError(t, err)
			err = db.Close()
			assert.NoError(t, err, "Error closing database connection")
		})
	}
}
