package server

import (
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestEchoServer(t *testing.T) {

	t.Run("TestEchoServer_Start", func(t *testing.T) {
		server := NewEchoServer()
		// err := server.Start()
		// assert.NoError(t, err)
		// err = server.Stop()
		go func() {
			err := server.Start()
			assert.NoError(t, err)
		}()
		time.Sleep(10 * time.Second)
		err := server.Stop()
		assert.NoError(t, err)
	})
}

func TestRegisteredRoutes(t *testing.T) {
	server := NewEchoServer()
	go func() {
		err := server.Start()
		assert.NoError(t, err)
	}()
	time.Sleep(10 * time.Second)
	testcases := []struct {
		name   string
		path   string
		method string
	}{
		{
			name:   "TestLiveness",
			path:   "/liveness",
			method: http.MethodGet,
		},
		// CRUD Operations
		{
			name:   "CreateCoupon",
			path:   "/coupon/create-coupon",
			method: http.MethodPost,
		},
		{
			name:   "GetCoupons",
			path:   "/coupon/get-coupons",
			method: http.MethodGet,
		},
		{
			name:   "UpdateCoupon",
			path:   "/coupon/update-coupon",
			method: http.MethodPut,
		},
		{
			name:   "DeleteCoupon",
			path:   "/coupon/delete-coupon",
			method: http.MethodDelete,
		},
		// Validation and Redemption
		{
			name:   "ValidateCoupon",
			path:   "/coupon/validate-coupon",
			method: http.MethodPost,
		},
		{
			name:   "RedeemCoupon",
			path:   "/coupon/redeem-coupon",
			method: http.MethodPost,
		},
		{
			name:   "RevertCoupon",
			path:   "/coupon/revert-coupon",
			method: http.MethodPost,
		},
		// Admin Panel
		{
			name:   "ListCoupons",
			path:   "/coupon/list-coupons",
			method: http.MethodPost,
		},
		{
			name:   "CouponAnalytics",
			path:   "/coupon/coupon-analytics",
			method: http.MethodPost,
		},
		{
			name:   "GenerateCouponReport",
			path:   "/coupon/generate-coupon-report",
			method: http.MethodPost,
		},
		// User Interaction
		{
			name:   "ApplyCoupon",
			path:   "/coupon/apply-coupon",
			method: http.MethodPost,
		},
		{
			name:   "MyCoupons",
			path:   "/coupon/my-coupons",
			method: http.MethodPost,
		},
	}
	for _, testcase := range testcases {

		t.Run(testcase.name, func(t *testing.T) {
			var err error
			switch testcase.method {
			case http.MethodGet:
				_, err = http.Get("http://localhost:6001" + testcase.path)
			case http.MethodPost:
				_, err = http.Post("http://localhost:6001"+testcase.path, "application/json", nil)
			case http.MethodPut:
				_, err = http.NewRequest(http.MethodPut, "http://localhost:6001"+testcase.path, nil)
			case http.MethodDelete:
				_, err = http.NewRequest(http.MethodDelete, "http://localhost:6001"+testcase.path, nil)
			}
			assert.NoError(t, err)
		})
	}
	err := server.Stop()
	assert.NoError(t, err)
}
