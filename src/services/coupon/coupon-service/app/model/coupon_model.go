package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Coupon struct {
	ID                          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	CouponCode                  string             `bson:"coupon_code" json:"coupon_code"`
	Description                 string             `bson:"description" json:"description"`
	DiscountType                DiscountType       `bson:"discount_type" json:"discount_type"`
	DiscountValue               int32              `bson:"discount_value" json:"discount_value"`
	MinOrderValue               float64            `bson:"min_order_value" json:"min_order_value"`
	ApplicableProductCategories []ProductCategory  `bson:"applicable_product_categories" json:"applicable_product_categories"`
	ApplicableProducts          []string           `bson:"applicable_products" json:"applicable_products"`
	RedemptionsLeft             int32              `bson:"redemptions_left" json:"redemptions_left"`
	PerUserLimit                int32              `bson:"per_user_limit" json:"per_user_limit"`
	ValidFrom                   time.Time          `bson:"valid_from" json:"valid_from"`
	ValidTill                   time.Time          `bson:"valid_till" json:"valid_till"`
	IsActive                    bool               `bson:"is_active" json:"is_active"`
	CreatedBy                   string             `bson:"created_by" json:"created_by"`
	CreatedAt                   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedBy                   string             `bson:"updated_by" json:"updated_by"`
	UpdatedAt                   time.Time          `bson:"updated_at" json:"updated_at"`
	TermsAndConditions          string             `bson:"terms_and_conditions" json:"terms_and_conditions"`
	UsageEntries                []UsageEntry       `bson:"usage_entries" json:"usage_entries"`
}

// Define the DiscountType and ProductCategory enums
type DiscountType int32

const (
	DiscountType_DISCOUNT_TYPE_UNSET DiscountType = 0
	DiscountType_FREE_SHIPPING       DiscountType = 1
	DiscountType_PERCENTAGE          DiscountType = 2
	DiscountType_FIXED               DiscountType = 3
)

type ProductCategory string

const (
	ProductCategory_PRODUCT_CATEGORY_UNSET ProductCategory = "UNSET"
	ProductCategory_RETROFIT               ProductCategory = "RETROFIT"
	ProductCategory_SMARTSWITCH            ProductCategory = "SMARTSWITCH"
	ProductCategory_SECURITY               ProductCategory = "SECURITY"
)

// Define the UsageEntry struct
type UsageEntry struct {
	UserID    string    `bson:"user_id" json:"user_id"`
	OrderID   string    `bson:"order_id" json:"order_id"`
	Timestamp time.Time `bson:"timestamp" json:"timestamp"`
}
