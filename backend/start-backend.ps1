Write-Host "Starting Schedule Planner Backend..." -ForegroundColor Green

# Set environment variables
$env:DB_HOST = "mysql-training.cd4qsem4uf1x.us-west-2.rds.amazonaws.com"
$env:DB_PORT = "3306"
$env:DB_NAME = "team3capstonedb"
$env:DB_USERNAME = "admin"
$env:DB_PASSWORD = "Be.Cognizant2025!"
$env:SERVER_PORT = "8080"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173"

Write-Host "Environment variables set" -ForegroundColor Yellow
Write-Host "Starting Maven Spring Boot..." -ForegroundColor Yellow

# Start the application
& ".\apache-maven-3.9.5\bin\mvn.cmd" spring-boot:run 