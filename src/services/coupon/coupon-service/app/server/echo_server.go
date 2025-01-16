package server

import (
	"couponservice/app/database"
	"couponservice/app/repo"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

type Server interface {
	Start() error
	Stop() error
	Liveness(echo.Context) error
	GetCoupons(ctx echo.Context) error
}

type EchoServer struct {
	echo *echo.Echo
	DB   database.Database
	repo repo.Repository
}

func NewEchoServer() Server {
	database := database.NewDatabase()
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	server := &EchoServer{
		echo: echo.New(),
		DB:   db,
		repo: repo.NewCouponRepository(),
	}
	server.registerRoutes()
	return server
}

func (s *EchoServer) registerRoutes() {
	s.echo.GET("/liveness", s.Liveness)
	cg := s.echo.Group("/coupon")
	//CRUD operations
	cg.POST("/create-coupon", s.CreateCoupon)
	cg.GET("/get-coupons", s.GetCoupons)
	cg.PUT("/update-coupon", s.UpdateCoupon)
	cg.DELETE("/delete-coupon/:coupon_code", s.DeleteCoupon)

	//Validation and Redemption
	cg.POST("/validate-coupon", s.ValidateCoupon)
	cg.POST("/redeem-coupon", s.RedeemCoupon)
	cg.POST("/revert-coupon", s.RevertCoupon)

	//Admin Panel
	cg.POST("/coupon-analytics", s.CouponAnalytics)
	cg.POST("/generate-coupon-report", s.GenerateCouponReport)

	//User Interaction
	cg.POST("/apply-coupon", s.Test)
	cg.POST("/my-coupons", s.GetUserCoupons)

}

func (s *EchoServer) Test(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, "Request OK")
}

func (s *EchoServer) Start() error {
	godotenv.Load()
	if err := s.echo.Start("0.0.0.0:" + os.Getenv("ECHO_SERVER_PORT")); err != nil && err != http.ErrServerClosed {
		log.Fatalf("shutting down the server: %v", err)
		return err
	}
	return nil
}

func (s *EchoServer) Stop() error {
	if err := s.echo.Shutdown(nil); err != nil {
		log.Fatalf("shutting down the server: %v", err)
		return err
	}
	return nil
}

func (s *EchoServer) Liveness(ctx echo.Context) error {
	return ctx.String(http.StatusOK, "Server is alive")
}

func StartEchoServer() {
	server := NewEchoServer()
	err := server.Start()
	if err != nil {
		log.Fatalf("Error starting Echo server: %v", err)
	}
}
