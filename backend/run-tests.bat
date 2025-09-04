@echo off
REM Test runner script for the Schedule Planner Backend (Windows)
REM This script runs all tests and generates a coverage report

echo === Schedule Planner Backend Test Suite ===
echo Running all tests...
echo.

REM Navigate to the backend directory
cd /d "%~dp0"

REM Clean and run tests
echo Cleaning project...
call .\apache-maven-3.9.5\bin\mvn.cmd clean

echo.
echo Running unit tests...
call .\apache-maven-3.9.5\bin\mvn.cmd test

echo.
echo Running integration tests...
call .\apache-maven-3.9.5\bin\mvn.cmd failsafe:integration-test

echo.
echo Generating test report...
call .\apache-maven-3.9.5\bin\mvn.cmd surefire-report:report

echo.
echo === Test Summary ===
echo Check target\site\surefire-report.html for detailed test results
echo Check target\surefire-reports\ for individual test reports
echo.

REM Check if tests passed
if %ERRORLEVEL% EQU 0 (
    echo ✅ All tests passed!
    exit /b 0
) else (
    echo ❌ Some tests failed!
    exit /b 1
)
