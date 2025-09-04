@echo off
echo Stopping existing backend processes...
taskkill /F /IM java.exe 2>nul
timeout /t 2 >nul

echo Starting Schedule Planner Backend...

set DB_HOST=mysql-training.cd4qsem4uf1x.us-west-2.rds.amazonaws.com
set DB_PORT=3306
set DB_NAME=team3capstonedb
set DB_USERNAME=admin
set DB_PASSWORD=Be.Cognizant2025!
set SERVER_PORT=8080
set CORS_ALLOWED_ORIGINS=http://localhost:5173

echo Environment variables set
echo Starting Maven Spring Boot...

apache-maven-3.9.5\bin\mvn.cmd spring-boot:run 