package server

import (
	"couponservice/app/model"
	serverpayloads "couponservice/app/server/server-payloads"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func (s *EchoServer) GetCoupons(ctx echo.Context) error {
	coupons, err := s.repo.GetCoupons(ctx.Request().Context())
	if err != nil {
		return fmt.Errorf("Error getting coupons: %v", err)
	}
	return ctx.JSON(http.StatusOK, coupons)
}

// Create Coupon
func (s *EchoServer) CreateCoupon(ctx echo.Context) error {
	coupon := model.Coupon{}
	if err := ctx.Bind(&coupon); err != nil {
		return fmt.Errorf("Error binding coupon: %v", err)
	}
	err := s.repo.CreateCoupon(ctx.Request().Context(), coupon)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err.Error())
	}
	return ctx.JSON(http.StatusOK, "Coupon created successfully")
}

// Update Coupon
func (s *EchoServer) UpdateCoupon(ctx echo.Context) error {
	coupon := model.Coupon{}
	if err := ctx.Bind(&coupon); err != nil {
		return fmt.Errorf("Error binding coupon: %v", err)
	}
	err := s.repo.UpdateCoupon(ctx.Request().Context(), coupon)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err.Error())
	}
	return ctx.JSON(http.StatusOK, "Coupon updated successfully")
}

// Delete Coupon
func (s *EchoServer) DeleteCoupon(ctx echo.Context) error {
	couponCode := ctx.Param("coupon_code")
	if couponCode == "" {
		return ctx.JSON(http.StatusBadRequest, "Coupon code is required")
	}
	err := s.repo.DeleteCoupon(ctx.Request().Context(), couponCode)
	if err != nil {
		return ctx.JSON(http.StatusNotFound, err.Error())
	}
	return ctx.JSON(http.StatusOK, "Coupon deleted successfully")
}

//Validation and Redemption

// Validate Coupon
func (s *EchoServer) ValidateCoupon(ctx echo.Context) error {
	request := serverpayloads.ValidateCouponRequest{}
	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, "Error binding request")
	}
	response, err := s.repo.ValidateCoupon(ctx.Request().Context(), request)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err.Error())
	}
	return ctx.JSON(http.StatusOK, response)
}

// Get User Coupons
func (s *EchoServer) GetUserCoupons(ctx echo.Context) error {
	request := serverpayloads.UserCouponsRequest{}
	if err := ctx.Bind(&request); err != nil {
		return fmt.Errorf("Error binding request: %v", err)
	}
	response, err := s.repo.UserCoupons(ctx.Request().Context(), request)
	if err != nil {
		return fmt.Errorf("Error getting user coupons: %v", err)
	}

	return ctx.JSON(http.StatusOK, response)
}

// Redeem Coupon
func (s *EchoServer) RedeemCoupon(ctx echo.Context) error {
	request := serverpayloads.RedeemCouponRequest{}
	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, "Error binding request")
	}
	response, err := s.repo.RedeemCoupon(ctx.Request().Context(), request)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err.Error())
	}

	return ctx.JSON(http.StatusOK, response)
}

// Revert Coupon
func (s *EchoServer) RevertCoupon(ctx echo.Context) error {
	request := serverpayloads.RevertCouponRequest{}
	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, "Error binding request")
	}
	response, err := s.repo.RevertCoupon(ctx.Request().Context(), request)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err.Error())
	}

	return ctx.JSON(http.StatusOK, response)
}

// Coupon Analytics
func (s *EchoServer) CouponAnalytics(ctx echo.Context) error {
	request := serverpayloads.CouponAnalyticsRequest{}
	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, "Error binding request")
	}
	response, err := s.repo.GetCouponAnalytics(ctx.Request().Context(), request)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err.Error())
	}
	return ctx.JSON(http.StatusOK, response)
}

// Generate Coupon Report
func (s *EchoServer) GenerateCouponReport(ctx echo.Context) error {
	request := serverpayloads.GenerateCouponReportRequest{}
	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, "Error binding request")
	}
	response, err := s.repo.GenerateCouponReport(ctx.Request().Context(), request)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, err.Error())
	}
	return ctx.JSON(http.StatusOK, response)
}
