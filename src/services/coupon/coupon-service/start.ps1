Write-Host "Building Docker Container...."
docker build -t couponservice .

Write-Host "Running Docker Container...."
docker run -d -it --name coupon_service_container -p 6001:6001 couponservice

Write-Host "Docker Container is running...."