package serverpayloads

type ValidateCouponRequest struct {
	UserID          string   `json:"user_id"`
	CouponCode      string   `json:"coupon_code"`
	OrderValue      float64  `json:"order_value"`
	ProductCategory string   `json:"product_category"`
	Products        []string `json:"products"`
}

type ValidateCouponResponse struct {
	IsValid bool `json:"is_valid"`
	// DiscountValue float64 `json:"discount_value"`
	// DiscountType  string  `json:"discount_type"`
	Message string `json:"message"`
}

type RedeemCouponRequest struct {
	CouponCode      string   `json:"coupon_code"`
	UserID          string   `json:"user_id"`
	OrderID         string   `json:"order_id"`
	OrderValue      float64  `json:"order_value"`
	ProductCategory string   `json:"product_category"`
	Products        []string `json:"products"`
}

type RedeemCouponResponse struct {
	IsRedeemed bool   `json:"is_redeemed"`
	Message    string `json:"message"`
}

type RevertCouponRequest struct {
	CouponCode string `json:"coupon_code"`
	OrderID    string `json:"order_id"`
}

type RevertCouponResponse struct {
	IsReverted bool   `json:"is_reverted"`
	Message    string `json:"message"`
}
