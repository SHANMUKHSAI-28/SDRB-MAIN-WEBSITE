package serverpayloads

import (
	"couponservice/app/model"
	"time"
)

type ListCouponsRequest struct {
	CreatedBy   string `json:"created_by"`
	CreatedFrom string `json:"created_from"`
	CreatedTo   string `json:"created_to"`
}

type ListCouponsResponse struct {
	Coupons []model.Coupon `json:"coupons"`
}

type CouponAnalyticsRequest struct {
	CreatedFrom time.Time `json:"created_from"`
	CreatedTo   time.Time `json:"created_to"`
}

type CouponAnalyticsResponse struct {
	TotalCouponsCreated int `json:"total_coupons_created"`
	TotalCouponsUsed    int `json:"total_coupons_used"`
	TotalCouponsExpired int `json:"total_coupons_expired"`
	TotalCouponsActive  int `json:"total_coupons_active"`
}

type GenerateCouponReportRequest struct {
	CouponCode string `json:"coupon_code"`
}

type GenerateCouponReportResponse struct {
	CouponCode                  string                  `json:"coupon_code"`
	Description                 string                  `json:"description"`
	DiscountType                model.DiscountType      `json:"discount_type"`
	DiscountValue               int32                   `json:"discount_value"`
	MinOrderValue               float64                 `json:"min_order_value"`
	ApplicableProductCategories []model.ProductCategory `json:"applicable_product_categories"`
	ApplicableProducts          []string                `json:"applicable_products"`
	RedemptionsLeft             int32                   `json:"redemptions_left"`
	PerUserLimit                int32                   `json:"per_user_limit"`
	ValidFrom                   time.Time               `json:"valid_from"`
	ValidTill                   time.Time               `json:"valid_till"`
	IsActive                    bool                    `json:"is_active"`
	CreatedBy                   string                  `json:"created_by"`
	CreatedAt                   time.Time               `json:"created_at"`
	UpdatedBy                   string                  `json:"updated_by"`
	UpdatedAt                   time.Time               `json:"updated_at"`
	TermsAndConditions          string                  `json:"terms_and_conditions"`
	TotalRedemptions            int32                   `json:"total_redemptions"`
}
