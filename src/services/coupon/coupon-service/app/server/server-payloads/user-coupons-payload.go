package serverpayloads

import "couponservice/app/model"

type UserCouponsRequest struct {
	UserID string `json:"user_id"`
}

type UserCouponsResponse struct {
	Coupons []model.Coupon `json:"coupons"`
}
