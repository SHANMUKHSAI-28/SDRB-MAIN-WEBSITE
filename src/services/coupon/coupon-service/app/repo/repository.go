package repo

import (
	"context"
	"couponservice/app/database"
	"couponservice/app/model"
	serverpayloads "couponservice/app/server/server-payloads"
	"fmt"
	"log"
	"time"
)

type Repository interface {
	ValidateCoupon(ctx context.Context, request serverpayloads.ValidateCouponRequest) (serverpayloads.ValidateCouponResponse, error)
	GetCoupons(ctx context.Context) ([]model.Coupon, error)
	CreateCoupon(ctx context.Context, coupon model.Coupon) error
	UpdateCoupon(ctx context.Context, coupon model.Coupon) error
	DeleteCoupon(ctx context.Context, couponCode string) error
	RedeemCoupon(ctx context.Context, request serverpayloads.RedeemCouponRequest) (serverpayloads.RedeemCouponResponse, error)
	RevertCoupon(ctx context.Context, request serverpayloads.RevertCouponRequest) (serverpayloads.RevertCouponResponse, error)
	GetCouponAnalytics(ctx context.Context, request serverpayloads.CouponAnalyticsRequest) (serverpayloads.CouponAnalyticsResponse, error)
	UserCoupons(ctx context.Context, request serverpayloads.UserCouponsRequest) (serverpayloads.UserCouponsResponse, error)
	GenerateCouponReport(ctx context.Context, request serverpayloads.GenerateCouponReportRequest) (serverpayloads.GenerateCouponReportResponse, error)
}

type CouponRepository struct {
	DB database.Database
}

func NewCouponRepository() Repository {
	database := database.NewDatabase()
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	return &CouponRepository{DB: db}
}

func (c *CouponRepository) GetCoupons(ctx context.Context) ([]model.Coupon, error) {
	coupons, err := c.DB.GetCoupons()
	if err != nil {
		return nil, fmt.Errorf("Error getting coupons: %v", err)
	}
	return coupons, nil
}

func (c *CouponRepository) Validations(coupon model.Coupon) error {
	if coupon.CouponCode == "" {
		return fmt.Errorf("Coupon code is required")
	}
	if coupon.Description == "" {
		return fmt.Errorf("Description is required")
	}
	if coupon.ValidFrom.IsZero() {
		return fmt.Errorf("Valid from is required")
	}
	if coupon.ValidTill.IsZero() {
		return fmt.Errorf("Valid till is required")
	}
	if coupon.CreatedAt.IsZero() {
		return fmt.Errorf("Created at is required")
	}
	if coupon.MinOrderValue <= 0 {
		return fmt.Errorf("Minimum order value is required")
	}
	if coupon.RedemptionsLeft <= 0 {
		return fmt.Errorf("Redemptions left is required")
	}
	if coupon.PerUserLimit < 0 {
		return fmt.Errorf("Per user limit is required")
	}
	if coupon.CreatedBy == "" {
		return fmt.Errorf("Created by is required")
	}
	if coupon.TermsAndConditions == "" {
		return fmt.Errorf("Terms and conditions are required")
	}
	if coupon.DiscountType == model.DiscountType_DISCOUNT_TYPE_UNSET {
		return fmt.Errorf("Discount type is required")
	}
	if coupon.DiscountValue <= 0 {
		return fmt.Errorf("Discount value is required")
	}
	if coupon.ApplicableProductCategories == nil {
		return fmt.Errorf("Applicable product categories are required")
	}
	if coupon.ApplicableProducts == nil {
		return fmt.Errorf("Applicable products are required")
	}
	if coupon.PerUserLimit <= 0 {
		return fmt.Errorf("Per user limit should be greater than 0")
	}
	return nil
}

func (c *CouponRepository) CreateCoupon(ctx context.Context, coupon model.Coupon) error {
	validation_err := c.Validations(coupon)
	if validation_err != nil {
		return validation_err
	}
	err := c.DB.CreateCoupon(coupon)
	if err != nil {
		return fmt.Errorf("Error creating coupon: %v", err)
	}
	log.Printf("Successfully created coupon with code: %s", coupon.CouponCode)

	return nil
}

func (c *CouponRepository) UpdateCoupon(ctx context.Context, coupon model.Coupon) error {
	validation_err := c.Validations(coupon)
	if validation_err != nil {
		return validation_err
	}
	_, errr := c.DB.GetCouponByCode(coupon.CouponCode)
	if errr != nil {
		return fmt.Errorf("Coupon does not exist")
	}
	err := c.DB.UpdateCoupon(coupon)
	if err != nil {
		return fmt.Errorf("Error updating coupon: %v", err)
	}
	log.Printf("Successfully updated coupon with code: %s", coupon.CouponCode)

	return nil
}

func (c *CouponRepository) DeleteCoupon(ctx context.Context, couponCode string) error {
	err := c.DB.DeleteCoupon(couponCode)
	if err != nil {
		return fmt.Errorf("Error deleting coupon: %v", err)
	}
	log.Printf("Successfully deleted coupon with code: %s", couponCode)

	return nil
}

func (c *CouponRepository) UserCoupons(ctx context.Context, request serverpayloads.UserCouponsRequest) (serverpayloads.UserCouponsResponse, error) {
	if request.UserID == "" {
		return serverpayloads.UserCouponsResponse{}, fmt.Errorf("User ID is required")
	}
	coupons, err := c.DB.GetCouponByUserID(request.UserID)
	if err != nil {
		return serverpayloads.UserCouponsResponse{}, fmt.Errorf("Error getting user coupons: %v", err)
	}
	return serverpayloads.UserCouponsResponse{Coupons: coupons}, nil
}

// ValidateCoupon validates the coupon based on the request
func (c *CouponRepository) ValidateCoupon(ctx context.Context, request serverpayloads.ValidateCouponRequest) (serverpayloads.ValidateCouponResponse, error) {
	if request.CouponCode == "" {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Coupon code is required"}, fmt.Errorf("Coupon code is required")
	}
	if request.UserID == "" {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "User ID is required"}, fmt.Errorf("User ID is required")
	}
	if request.OrderValue <= 0 {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Order value is required"}, fmt.Errorf("Order value is required")
	}
	if request.ProductCategory == string(model.ProductCategory_PRODUCT_CATEGORY_UNSET) {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Product category is required"}, fmt.Errorf("Product category is required")
	}
	if len(request.Products) == 0 {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Products are required"}, fmt.Errorf("Products are required")
	}
	coupon, err := c.DB.GetCouponByCode(request.CouponCode)
	if err != nil {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: err.Error()}, fmt.Errorf("Error getting coupon: %v", err)
	}
	if coupon.IsActive == false {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Coupon is not active"}, nil
	}
	if coupon.ValidFrom.After(time.Now()) {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Coupon is not valid yet"}, nil
	}
	if coupon.ValidTill.Before(time.Now()) {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Coupon has expired"}, nil
	}
	if request.OrderValue < coupon.MinOrderValue {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Order value is less than minimum order value"}, nil
	}
	if coupon.RedemptionsLeft <= 0 {
		return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Coupon has been fully redeemed"}, nil
	}
	if len(coupon.ApplicableProductCategories) > 0 {
		isApplicable := false
		for _, category := range coupon.ApplicableProductCategories {
			if string(category) == request.ProductCategory {
				isApplicable = true
				break
			}
		}
		if !isApplicable {
			return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Coupon is not applicable for the product category"}, nil
		}
	}
	if coupon.PerUserLimit > 0 {
		//Check if the user has already used the coupon
		userCoupons, err := c.UserCoupons(ctx, serverpayloads.UserCouponsRequest{UserID: request.UserID})
		if err != nil {
			return serverpayloads.ValidateCouponResponse{IsValid: false, Message: err.Error()}, fmt.Errorf("Error getting user coupons: %v", err)
		}
		var userRedemptions int32
		if len(userCoupons.Coupons) > 0 {
			for _, userCoupon := range userCoupons.Coupons {
				if userCoupon.CouponCode == coupon.CouponCode {
					userRedemptions++
				}
			}
		}
		if userRedemptions >= coupon.PerUserLimit {
			return serverpayloads.ValidateCouponResponse{Message: "User has already used the coupon"}, nil
		}
	}
	if coupon.ApplicableProducts != nil && len(coupon.ApplicableProducts) > 0 {
		counter := 0
		for _, product := range coupon.ApplicableProducts {
			for _, userProduct := range request.Products {
				if product == userProduct {
					counter++
				}
			}
		}
		if counter != len(request.Products) {
			return serverpayloads.ValidateCouponResponse{IsValid: false, Message: "Coupon is not applicable for the product/products"}, nil
		}
	}
	return serverpayloads.ValidateCouponResponse{IsValid: true, Message: "The Coupon is Valid!!"}, nil
}

func (c *CouponRepository) RedeemCoupon(ctx context.Context, request serverpayloads.RedeemCouponRequest) (serverpayloads.RedeemCouponResponse, error) {
	validationResponse, err := c.ValidateCoupon(ctx, serverpayloads.ValidateCouponRequest{
		UserID:          request.UserID,
		CouponCode:      request.CouponCode,
		OrderValue:      request.OrderValue,
		ProductCategory: request.ProductCategory,
		Products:        request.Products,
	})
	if err != nil {
		return serverpayloads.RedeemCouponResponse{IsRedeemed: false, Message: err.Error()}, fmt.Errorf("Error validating coupon: %v", err)
	}
	if !validationResponse.IsValid {
		return serverpayloads.RedeemCouponResponse{IsRedeemed: false, Message: validationResponse.Message}, nil
	}
	coupon, err := c.DB.GetCouponByCode(request.CouponCode)
	if err != nil {
		return serverpayloads.RedeemCouponResponse{IsRedeemed: false, Message: err.Error()}, fmt.Errorf("Error getting coupon: %v", err)
	}
	coupon.RedemptionsLeft--
	if coupon.UsageEntries != nil {
		redemptions := 0
		for _, usageEntry := range coupon.UsageEntries {
			if usageEntry.OrderID == request.OrderID {
				redemptions++
			}
		}
		if redemptions >= int(coupon.PerUserLimit) {
			return serverpayloads.RedeemCouponResponse{IsRedeemed: false, Message: "Per user limit reached"}, nil
		}
	}
	coupon.UsageEntries = append(coupon.UsageEntries, model.UsageEntry{
		UserID:    request.UserID,
		OrderID:   request.OrderID,
		Timestamp: time.Now(),
	})
	err = c.DB.UpdateCoupon(coupon)
	if err != nil {
		return serverpayloads.RedeemCouponResponse{IsRedeemed: false, Message: err.Error()}, fmt.Errorf("Error updating coupon: %v", err)
	}
	return serverpayloads.RedeemCouponResponse{IsRedeemed: true, Message: "Coupon redeemed successfully"}, nil
}

// Revert Coupon
func (c *CouponRepository) RevertCoupon(ctx context.Context, request serverpayloads.RevertCouponRequest) (serverpayloads.RevertCouponResponse, error) {
	if request.CouponCode == "" {
		return serverpayloads.RevertCouponResponse{IsReverted: false, Message: "Coupon code is required"}, fmt.Errorf("Coupon code is required")
	}
	if request.OrderID == "" {
		return serverpayloads.RevertCouponResponse{IsReverted: false, Message: "Order ID is required"}, fmt.Errorf("Order ID is required")
	}
	coupon, err := c.DB.GetCouponByCode(request.CouponCode)
	if err != nil {
		return serverpayloads.RevertCouponResponse{IsReverted: false, Message: err.Error()}, fmt.Errorf("Error getting coupon: %v", err)
	}
	if coupon.UsageEntries == nil || len(coupon.UsageEntries) == 0 {
		return serverpayloads.RevertCouponResponse{IsReverted: false, Message: "No usage entries found"}, nil
	}
	for i, usageEntry := range coupon.UsageEntries {
		if usageEntry.OrderID == request.OrderID {
			coupon.RedemptionsLeft++
			coupon.UsageEntries = append(coupon.UsageEntries[:i], coupon.UsageEntries[i+1:]...)
			break
		}
	}
	err = c.DB.UpdateCoupon(coupon)
	if err != nil {
		return serverpayloads.RevertCouponResponse{IsReverted: false, Message: err.Error()}, fmt.Errorf("Error updating coupon: %v", err)
	}
	return serverpayloads.RevertCouponResponse{IsReverted: true, Message: "Coupon reverted successfully"}, nil
}

// Coupon Analytics
func (c *CouponRepository) GetCouponAnalytics(ctx context.Context, request serverpayloads.CouponAnalyticsRequest) (serverpayloads.CouponAnalyticsResponse, error) {
	if request.CreatedFrom.IsZero() {
		return serverpayloads.CouponAnalyticsResponse{}, fmt.Errorf("Created from is required")
	}
	if request.CreatedTo.IsZero() {
		return serverpayloads.CouponAnalyticsResponse{}, fmt.Errorf("Created to is required")
	}
	coupons, err := c.DB.GetCoupons()
	if err != nil {
		return serverpayloads.CouponAnalyticsResponse{}, fmt.Errorf("Error getting coupons: %v", err)
	}
	totalCouponsCreated := 0
	totalCouponsUsed := 0
	totalCouponsExpired := 0
	totalCouponsActive := 0
	for _, coupon := range coupons {
		if coupon.CreatedAt.After(request.CreatedFrom) && coupon.CreatedAt.Before(request.CreatedTo) {
			totalCouponsCreated++
			if coupon.IsActive {
				totalCouponsActive++
			}
			if coupon.RedemptionsLeft == 0 {
				totalCouponsExpired++
			}
			if coupon.UsageEntries != nil && len(coupon.UsageEntries) > 0 {
				totalCouponsUsed += len(coupon.UsageEntries)
			}
		}
	}
	return serverpayloads.CouponAnalyticsResponse{
		TotalCouponsCreated: totalCouponsCreated,
		TotalCouponsUsed:    totalCouponsUsed,
		TotalCouponsExpired: totalCouponsExpired,
		TotalCouponsActive:  totalCouponsActive,
	}, nil
}

// Coupon Report
func (c *CouponRepository) GenerateCouponReport(ctx context.Context, request serverpayloads.GenerateCouponReportRequest) (serverpayloads.GenerateCouponReportResponse, error) {
	if request.CouponCode == "" {
		return serverpayloads.GenerateCouponReportResponse{}, fmt.Errorf("Coupon code is required")
	}
	coupon, err := c.DB.GetCouponByCode(request.CouponCode)
	if err != nil {
		return serverpayloads.GenerateCouponReportResponse{}, fmt.Errorf("Error getting coupon: %v", err)
	}
	return serverpayloads.GenerateCouponReportResponse{
		CouponCode:                  coupon.CouponCode,
		Description:                 coupon.Description,
		DiscountType:                coupon.DiscountType,
		DiscountValue:               coupon.DiscountValue,
		MinOrderValue:               coupon.MinOrderValue,
		ApplicableProductCategories: coupon.ApplicableProductCategories,
		ApplicableProducts:          coupon.ApplicableProducts,
		RedemptionsLeft:             coupon.RedemptionsLeft,
		PerUserLimit:                coupon.PerUserLimit,
		ValidFrom:                   coupon.ValidFrom,
		ValidTill:                   coupon.ValidTill,
		IsActive:                    coupon.IsActive,
		CreatedBy:                   coupon.CreatedBy,
		CreatedAt:                   coupon.CreatedAt,
		UpdatedBy:                   coupon.UpdatedBy,
		UpdatedAt:                   coupon.UpdatedAt,
		TermsAndConditions:          coupon.TermsAndConditions,
		TotalRedemptions:            int32(len(coupon.UsageEntries)),
	}, nil
}
