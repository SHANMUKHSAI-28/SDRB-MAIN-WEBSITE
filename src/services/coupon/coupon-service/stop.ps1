Write-Host "Stopping Docker Container...."
docker kill coupon_service_container
Write-Host "Removing Docker Container...."
docker rm coupon_service_container
Write-Host "Docker Container is removed...."
Write-Host "Removing Docker Image...."
docker rmi couponservice
Write-Host "Docker Image is removed...."